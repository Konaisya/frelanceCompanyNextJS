from pydantic import BaseModel, Field, field_validator
import re
from typing import Optional
from datetime import datetime
from utils.enums import TransactionType
from schemas.users import *
from schemas.orders import ShortOrderResponse

# Transaction
class TransactionResponse(BaseModel):
    id: int
    order: Optional[ShortOrderResponse] = None
    sender: UserTransactionResponse
    recipient: UserTransactionResponse
    amount: float
    commission: float
    type: TransactionType
    created_at: datetime

class CreateTransaction(BaseModel):
    id_order: Optional[int] = None
    id_user_recipient: int
    amount: float
    type: TransactionType