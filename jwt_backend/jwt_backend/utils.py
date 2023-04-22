from datetime import timedelta, datetime
from typing import Annotated
from passlib.context import CryptContext
from fastapi import Depends, status, Header, HTTPException, Cookie
from jose import JWTError, ExpiredSignatureError, jwt
from sqlmodel import Session, select
from .database import engine

import jwt_backend.models as db


SECRET_KEY = "test"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_session():
    with Session(engine) as session:
        yield session


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def get_user_by_username(session: Session, username: str) -> db.User | None:
    statement = select(db.User).where(db.User.username == username)
    user = session.exec(statement).one_or_none()
    return user


def authenticate_user(session: Session, username: str, password: str) -> tuple[bool, db.User | None]:
    user = get_user_by_username(session, username)
    if not user:
        return False, None
    if not verify_password(password, user.hashed_password):
        return False, None
    return True, user


def create_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

        
def get_user(bearer:  Annotated[str, Header()], session: Session = Depends(get_session)) -> db.User:
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    expired_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Access token expired"
    )
    try:
        payload = jwt.decode(bearer, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("username")
        if username is None:
            print('sas')   
            raise credentials_exception
    except ExpiredSignatureError:
        print('susu')
        raise expired_exception
    except JWTError as e:
        print('sus' + str(e))
        raise credentials_exception
    

    user = get_user_by_username(session, username=username)
        
    if user is None:
        print('soooos')
        raise credentials_exception
    
    return user


def get_refresh_user(refresh_token: Annotated[str | None, Cookie()], session: Session = Depends(get_session)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    expired_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Access token expired"
    )
    
    try:
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("username")
        if username is None:
            raise credentials_exception
    except ExpiredSignatureError:
        raise expired_exception
    except JWTError:
        raise credentials_exception
    

    user = get_user_by_username(session, username=username)
    print("Refresh old:" + user.refresh_token)
    print("Refresh new:" + refresh_token)
    
    
    if user is None or user.refresh_token != refresh_token:
        raise credentials_exception
        
    return user