# init_db.py
from models import Base  # Adjusted to import directly from models
from database import engine  # Import engine from database.py

# Create all tables in the database
Base.metadata.create_all(bind=engine)
print("Database tables created successfully.")
