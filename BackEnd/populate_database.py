# populate_database.py
import json
from sqlalchemy.orm import Session
from .database import SessionLocal
from .models import Question, Choice

# Load JSON data from the specified file path
json_file_path = r"C:\Users\Connor Devaney\Documents\Senior Project\questions.json"
with open(json_file_path) as f:
    data = json.load(f)

def populate_database():
    # Create a new database session
    db: Session = SessionLocal()

    try:
        for item in data:
            # Create a Question instance
            question = Question(
                module=item["module"],
                question_text=item["question_text"]
            )
            db.add(question)
            db.commit()  # Commit to get the question ID

            # Add choices linked to the question
            for choice_data in item["choices"]:
                choice = Choice(
                    question_id=question.id,  # Link choice to question
                    choice_text=choice_data["choice_text"],
                    is_correct=choice_data["is_correct"]
                )
                db.add(choice)

            # Commit after adding all choices for a question
            db.commit()

        print("Database populated successfully.")
    finally:
        # Close the session
        db.close()

# Run the function
populate_database()
