from fastapi import FastAPI, Depends
from gpt_tutor import GPT2Tutor
from .database import SessionLocal, get_db
from .models import Quiz

app = FastAPI()

# Load the GPT-2 tutor
tutor = GPT2Tutor()

@app.get("/")
async def root():
    return {"message": "Welcome to the AI Tutor"}

# GPT-2 endpoint
@app.post("/tutor")
async def tutor_endpoint(prompt: str):
    response = tutor.generate_response(prompt)
    return {"response": response}

# PostgreSQL endpoint to get quizzes
@app.get("/quizzes/")
async def get_quizzes(db: Session = Depends(get_db)):
    quizzes = db.query(Quiz).all()
    return quizzes
