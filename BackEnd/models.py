# models.py
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from BackEnd.database import Base  # Import Base from database.py

# Quiz model (if applicable for a separate table)
class Quiz(Base):
    __tablename__ = "quizzes"
    
    id = Column(Integer, primary_key=True, index=True)
    prompt = Column(String, index=True)
    completion = Column(String)

# Question model with a module label
class Question(Base):
    __tablename__ = "questions"
    
    id = Column(Integer, primary_key=True, index=True)
    module = Column(String, nullable=False)  # Module label
    question_text = Column(String, nullable=False)
    choices = relationship("Choice", back_populates="question")  # One-to-many with choices

# Choice model for answer options
class Choice(Base):
    __tablename__ = "choices"
    
    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.id"))
    choice_text = Column(String, nullable=False)
    is_correct = Column(Boolean, default=False)
    question = relationship("Question", back_populates="choices")
