from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from huggingface_hub import InferenceClient
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

# Initialize the Hugging Face Inference API client
api_key = "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"
client = InferenceClient(api_key=api_key)

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

    # Prepare the message format for the Inference API
    messages = [{"role": "user", "content": user_message}]

    # Stream the response from the Inference API
    try:
        response_text = ""
        stream = client.chat.completions.create(
            model="microsoft/Phi-3.5-mini-instruct",
            messages=messages,
            max_tokens=500,
            stream=True
        )
        
        # Collect and concatenate the streamed response
        for chunk in stream:
            response_text += chunk.choices[0].delta.content

        return {"response": response_text}

    except Exception as e:
        print("Error during inference:", e)
        return {"response": "An error occurred while processing your request."}

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
