from pydantic import BaseModel, Field, field_validator
import re
from typing import Optional
from .specializations import SpecializationResponse
from .users import ExecutorResponse

class ShortServiceResponse(BaseModel):
    id: int
    name: str
    description: str
    price: float
    delivery_time: int
    specialization: SpecializationResponse

class ServiceResponse(BaseModel):
    id: int
    name: str
    description: str
    specialization: SpecializationResponse
    user_executor: ExecutorResponse
    price: float
    delivery_time: int

class CreateService(BaseModel):
    name: str
    description: str
    id_specialization: int
    id_user_executor: int
    price: float
    delivery_time: Optional[int] = None

class UpdateService(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    id_specialization: Optional[int] = None
    price: Optional[float] = None
    delivery_time: Optional[int] = None
