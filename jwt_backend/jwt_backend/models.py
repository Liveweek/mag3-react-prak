from sqlmodel import SQLModel, Field


class User(SQLModel, table=True):
    id:               int | None = Field(default=None, primary_key=True)
    username:         str
    hashed_password:  str
    refresh_token:    str | None
    user_information: str