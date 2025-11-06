from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.engine import create_engine
from dotenv import load_dotenv
import os 

load_dotenv()
Base = declarative_base()

NAME_DB = os.getenv('NAME_DB')

engine = create_engine(f'sqlite:///./app.db', connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()