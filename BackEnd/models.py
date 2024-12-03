# models.py
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

# Quiz model (if applicable for a separate table)
class Quiz(Base):
    __tablename__ = "quizzes"
    
    id = Column(Integer, primary_key=True, index=True)
    prompt = Column(String, index=True)
    completion = Column(String)

# Question model with a module label
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False, index=True)
    username = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    progress = relationship("UserProgress", back_populates="user")

class UserProgress(Base):
    __tablename__ = "user_progress"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    question_id = Column(Integer, ForeignKey("questions.id"))
    answered_correctly = Column(Boolean, default=False)
    user = relationship("User", back_populates="progress")

class Question(Base):
    __tablename__ = "questions"
    id = Column(Integer, primary_key=True, index=True)
    question_text = Column(String, nullable=False)
    question_expression = Column(String, nullable=True)
    module = Column(String, nullable=False)
    choices = relationship("Choice", back_populates="question")

class Choice(Base):
    __tablename__ = "choices"
    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.id"))
    choice_text = Column(String, nullable=False)
    is_correct = Column(Boolean, default=False)
    question = relationship("Question", back_populates="choices")