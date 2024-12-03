from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from huggingface_hub import InferenceClient
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from typing import List
import secrets
from database import get_db
from models import Question, Choice, User, UserProgress 
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

app = FastAPI()

# Allow requests from any origin (for testing purposes)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the Hugging Face Inference API client
api_key = "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"
client = InferenceClient(api_key=api_key)

# Dummy database to store user information
users_db = {}
verification_codes = {}

# Request models
class SignupRequest(BaseModel):
    email: EmailStr
    username: str
    password: str

class ProgressRequest(BaseModel):
    user_id: int
    question_id: int
    correct: bool

class VerificationRequest(BaseModel):
    email: EmailStr
    code: str

class ChoiceResponse(BaseModel):
    id: int
    choice_text: str
    is_correct: bool

    class Config:
        from_attributes = True  # Pydantic v2 replacement for orm_mode

class QuestionResponse(BaseModel):
    id: int
    question_text: str
    question_expression: str  # Include this if needed
    choices: List[ChoiceResponse]

    class Config:
        from_attributes = True  # Pydantic v2 replacement for orm_mode

# Chat endpoint
@app.post("/chat")
async def chat_with_gpt(request: Request):
    data = await request.json()
    messages = data.get("messages", [])

    if not messages or not isinstance(messages, list):
        return {"response": "Please provide a valid conversation context!"}

    try:
        response_text = ""
        stream = client.chat.completions.create(
            model="microsoft/Phi-3.5-mini-instruct",
            messages=messages,
            max_tokens=500,
            stream=True
        )
        for chunk in stream:
            response_text += chunk.choices[0].delta.content

        return {"response": response_text}

    except Exception as e:
        print("Error during inference:", e)
        return {"response": "An error occurred while processing your request. Please refine your query."}

# Signup endpoint
@app.post("/api/signup")
async def signup(request: SignupRequest, db: Session = Depends(get_db)):
    if db.query(User).filter((User.email == request.email) | (User.username == request.username)).first():
        raise HTTPException(status_code=400, detail="Email or username already exists")

    new_user = User(
        email=request.email,
        username=request.username,
        password=hash_password(request.password),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully"}

@app.post("/api/login")
async def login(request: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == request.username).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    if not verify_password(request.password, user.password):
        raise HTTPException(status_code=401, detail="Incorrect password")
    return {"message": "Login successful", "user_id": user.id}

# Verify endpoint
@app.post("/api/verify")
async def verify(request: VerificationRequest):
    if request.email not in verification_codes:
        raise HTTPException(status_code=400, detail="Invalid email or code")

    if verification_codes[request.email] == request.code:
        users_db[request.email]["verified"] = True
        del verification_codes[request.email]
        return {"message": "Email verified successfully."}
    else:
        raise HTTPException(status_code=400, detail="Invalid verification code")

@app.get("/")
def read_root():
    return {"message": "Welcome to the API! Available endpoints are /chat, /api/signup, /api/verify, and /api/questions"}

# Questions endpoint
@app.get("/api/questions", response_model=List[QuestionResponse])
def get_questions(module: str = None, db: Session = Depends(get_db)):
    if module:
        questions = db.query(Question).filter(Question.module == module).all()
    else:
        questions = db.query(Question).all()
    return questions

@app.post("/api/progress")
async def update_progress(request: ProgressRequest, db: Session = Depends(get_db)):
    progress = db.query(UserProgress).filter_by(
        user_id=request.user_id, question_id=request.question_id
    ).first()

    if progress:
        progress.answered_correctly = request.correct
    else:
        new_progress = UserProgress(
            user_id=request.user_id, question_id=request.question_id, answered_correctly=request.correct
        )
        db.add(new_progress)

    db.commit()
    return {"message": "Progress updated"}
