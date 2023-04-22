from datetime import timedelta
from typing import Annotated
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends, Header, HTTPException, status, Cookie
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session
import uvicorn


import jwt_backend.models as db
import jwt_backend.api_models as api

from .database import create_db_and_tables, engine
from .utils import get_password_hash, authenticate_user, create_token, get_session, get_user, get_refresh_user


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=['*'],
    allow_methods=['*'],
    allow_headers=['*']
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    
    

        

@app.post('/register')
def register_user(
        user_api: api.UserAPI,
        session: Session = Depends(get_session)
    ):
    
    user = db.User(**user_api.dict())
    user.hashed_password = get_password_hash(user_api.password)
    
    session.add(user)
    session.commit()
    

@app.post('/refresh')
def refresh_token(
        session: Session = Depends(get_session),
        refreshed_user: db.User = Depends(get_refresh_user)
    ):
    
    access_token_expires = timedelta(seconds=10)
    refresh_token_expires = timedelta(minutes=10)
    
    token_data = {"username": refreshed_user.username}
    
    access_token = create_token(token_data, access_token_expires)
    refresh_token = create_token(token_data, refresh_token_expires)
    
    refreshed_user.refresh_token = refresh_token
    
    session.add(refreshed_user)
    session.commit()
    
    response = JSONResponse(
        status_code=200,
        content={
            "token_type": "bearer",
            "access_token": access_token
        }
    )
    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True)
    return response
    
    
    
    
    
    
@app.post('/login')
def login_user(
        login_form : api.LoginModel,
        session: Session = Depends(get_session)
    ):
    
    flg, user = authenticate_user(session, login_form.username, login_form.password)
    
    if not flg:
        return JSONResponse(
            status_code=401,
            content={"message": "Invalid username or password"}
        )
        
    access_token_expires = timedelta(seconds=10)
    refresh_token_expires = timedelta(minutes=10)
    
    token_data = {"username": user.username}
    
    access_token = create_token(token_data, access_token_expires)
    refresh_token = create_token(token_data, refresh_token_expires)
    
    user.refresh_token = refresh_token
    
    session.add(user)
    session.commit()
    
    response = JSONResponse(
        status_code=200,
        content={
            "token_type": "bearer",
            "access_token": access_token
        }
    )
    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True)
    return response


@app.get('/user_info')
def get_user_info(
        session: Session = Depends(get_session),
        user: db.User = Depends(get_user)
    ):
    
    return {"user": user.user_information}