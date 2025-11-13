from pydantic import BaseModel, Field, field_validator
import re
from typing import Optional
from datetime import datetime
from utils.enums import OrderStatus, TransactionType
from schemas.users import *
from schemas.services import ShortServiceResponse

# Order
class ShortOrderResponse(BaseModel):
    id: int
    status: OrderStatus
    name: str
    description: str
    price: float
    created_at: datetime
    updated_at: Optional[datetime] = None
    deadline: Optional[datetime] = None

class OrderResponse(BaseModel):
    id: int
    user_customer: CustomerResponse
    user_executor: Optional[ExecutorResponse] = None
    service: Optional[ShortServiceResponse] = None
    status: OrderStatus
    name: str
    description: str
    price: float
    created_at: datetime
    updated_at: Optional[datetime] = None
    deadline: Optional[datetime] = None

class CreateOrder(BaseModel):
    id_user_executor: Optional[int] = None
    id_service: Optional[int] = None
    price: float
    name: str
    description: str
    deadline: Optional[datetime] = None

class UpdateOrder(BaseModel):
    status: Optional[OrderStatus] = None
    price: Optional[float] = None
    name: Optional[str] = None
    description: Optional[str] = None
    deadline: Optional[datetime] = None
    id_user_executor: Optional[int] = None
    id_service: Optional[int] = None

