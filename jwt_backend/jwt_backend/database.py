import datetime
from sqlmodel import SQLModel, Session, create_engine



sqlite_file_name = "database.sqlite"
sqlite_url = f"sqlite:///{sqlite_file_name}"

engine = create_engine(sqlite_url)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)