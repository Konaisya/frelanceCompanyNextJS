from pydantic import BaseModel, Field, field_validator, ConfigDict
import re
from typing import Optional
from datetime import datetime
from .users import *
from .orders import ShortOrderResponse

class MessageResponse(BaseModel):
    id: int
    order: Optional[ShortOrderResponse] = None
    sender: UserMessageResponse
    recipient: UserMessageResponse
    message: str
    created_at: datetime

class MessageWSResponse(BaseModel):
    id: int
    message: str
    created_at: str

class CreateMessage(BaseModel):
    id_user_recipient: int
    id_order: Optional[int] = None
    message: str
