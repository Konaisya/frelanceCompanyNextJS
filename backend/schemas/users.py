from pydantic import BaseModel, Field, field_validator, EmailStr
import re
from typing import Optional
from utils.enums import Roles
from .specializations import SpecializationResponse

class UserCreate(BaseModel):
    name: str
    role: Roles
    email: EmailStr
    password: str

    @field_validator('email')
    @classmethod
    def validate_email(cls, val: str):
        if not re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', val):
            raise ValueError('Invalid email address')
        return val

    @field_validator('password')
    @classmethod
    def validate_password(cls, val: str):
        if not re.match(r'^(?=.{8,}$)(?=.*[A-Za-z])(?=.*\d).+', val):
            raise ValueError('Invalid password')
        return val

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    balance: Optional[float] = None

    @field_validator('email')
    @classmethod
    def validate_email(cls, val: str):
        if val is None: 
            return None
        if not re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', val):
            raise ValueError('Invalid email address')
        return val

    @field_validator('password')
    @classmethod
    def validate_password(cls, val: str):
        if val is None: 
            return None
        if not re.match(r'^(?=.{8,}$)(?=.*[A-Za-z])(?=.*\d).+', val):
            raise ValueError('Invalid password')
        return val
    
class UserLogin(BaseModel):
    email: EmailStr
    password: str
    
    @field_validator('email')
    @classmethod
    def validate_email(cls, val: str):
        if not re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', val):
            raise ValueError('Invalid email address')
        return val

    @field_validator('password')
    @classmethod
    def validate_password(cls, val: str):
        if not re.match(r'^(?=.{8,}$)(?=.*[A-Za-z])(?=.*\d).+', val):
            raise ValueError('Invalid password')
        return val
    
class User(BaseModel):
    id: int
    name: str
    image: str
    role: str
    email: str
    password: str
    balance: float

class UserResponse(BaseModel):
    id: int
    name: str
    image: str
    role: str
    email: str
    balance: float

class UserTransactionResponse(BaseModel):
    id: int
    name: str
    email: str
    role: Roles

class UserMessageResponse(BaseModel):
    id: int
    name: str


class CustomerResponse(UserResponse):
    company: Optional[str] = None
    contacts: Optional[str] = None

class CreateCustomer(BaseModel):
    company: Optional[str] = None
    contacts: Optional[str] = None

class UpdateCustomer(BaseModel):
    company: Optional[str] = None
    contacts: Optional[str] = None  


class ExecutorResponse(UserResponse):
    specialization: SpecializationResponse
    contacts: Optional[str] = None
    experience: int
    skills: Optional[str] = None
    hourly_rate: Optional[float] = None
    description: Optional[str] = None

class CreateExecutor(BaseModel):
    id_specialization: int
    contacts: Optional[str] = None
    experience: int
    skills: Optional[str] = None
    hourly_rate: float
    description: Optional[str] = None

class UpdateExecutor(BaseModel):
    id_specialization: Optional[int] = None
    contacts: Optional[str] = None
    experience: Optional[int] = None
    skills: Optional[str] = None
    hourly_rate: Optional[float] = None
    description: Optional[str] = None


class CreateUser(BaseModel):
    user: UserCreate
    executor_profile: Optional[CreateExecutor] = None
    customer_profile: Optional[CreateCustomer] = None

class UpdateUser(BaseModel):
    user: Optional[UserUpdate] = None
    executor_profile: Optional[UpdateExecutor] = None
    customer_profile: Optional[UpdateCustomer] = None