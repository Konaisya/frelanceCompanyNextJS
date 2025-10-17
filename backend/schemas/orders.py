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
    updated_at: Optional[datetime]
    deadline: Optional[datetime]

class OrderResponse(BaseModel):
    id: int
    user_customer: CustomerResponse
    user_executor: ExecutorResponse
    service: ShortServiceResponse
    status: OrderStatus
    name: str
    description: str
    price: float
    created_at: datetime
    updated_at: Optional[datetime]
    deadline: Optional[datetime]

class CreateOrder(BaseModel):
    id_user_executor: int
    id_service: int
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

