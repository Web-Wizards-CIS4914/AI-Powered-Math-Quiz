# models.py

from sqlalchemy import Column, Integer, String
from .database import Base

class Quiz(Base):
    __tablename__ = "quizzes"
    
    id = Column(Integer, primary_key=True, index=True)
    prompt = Column(String, index=True)
    completion = Column(String)
