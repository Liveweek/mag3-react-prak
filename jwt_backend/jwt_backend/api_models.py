from pydantic import BaseModel


class UserAPI(BaseModel):
    username:         str
    password:         str
    user_information: str
    
    
class LoginModel(BaseModel):
    username: str
    password: str