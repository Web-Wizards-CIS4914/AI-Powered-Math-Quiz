from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# PostgreSQL connection details for AWS RDS
SQLALCHEMY_DATABASE_URL = "postgresql://webwizard:Cis_4914@my-fastapi-db.cf40kk4cg2l9.us-east-2.rds.amazonaws.com:5432/postgres"

# Create the engine and session
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependency to get a DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()