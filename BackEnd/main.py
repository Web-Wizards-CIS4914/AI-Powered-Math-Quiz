from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from transformers import GPT2LMHeadModel, GPT2Tokenizer
from pydantic import BaseModel, EmailStr
import secrets


app = FastAPI()

# Allow requests from any origin (for testing purposes)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the GPT-2 model and tokenizer from Hugging Face
model = GPT2LMHeadModel.from_pretrained("gpt2")
tokenizer = GPT2Tokenizer.from_pretrained("gpt2")

# Dummy database to store user information
users_db = {}
verification_codes = {}

# Request models
class SignupRequest(BaseModel):
    email: EmailStr
    password: str

class VerificationRequest(BaseModel):
    email: EmailStr
    code: str

@app.get("/")
def read_root():
    return {"message": "Welcome to the API! Available endpoints are /chat, /api/signup, and /api/verify"}

# Chat endpoint
@app.post("/chat")
async def chat_with_gpt(request: Request):
    data = await request.json()
    user_message = data.get("message", "")
    
    if not user_message:
        return {"response": "Please ask a question!"}

    # Generate response from GPT-2
    inputs = tokenizer.encode(user_message, return_tensors="pt")
    outputs = model.generate(inputs, max_length=100)
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)

    return {"response": response}

# Signup endpoint
@app.post("/api/signup")
async def signup(request: SignupRequest):
    if request.email in users_db:
        raise HTTPException(status_code=400, detail="User already exists")
    
    # Generate a simple verification code (6 characters)
    verification_code = secrets.token_hex(3)  # 6-character hex code
    verification_codes[request.email] = verification_code
    users_db[request.email] = {"password": request.password, "verified": False}

    # Simulate sending email (replace with actual email sending code)
    print(f"Verification code for {request.email}: {verification_code}")
    return {"message": "Verification code sent to your email."}

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