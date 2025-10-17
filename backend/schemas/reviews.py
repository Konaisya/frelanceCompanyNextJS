from pydantic import BaseModel, Field, field_validator
import re
from typing import Optional
from datetime import datetime
from .orders import ShortOrderResponse
from .users import UserResponse

class ReviewResponse(BaseModel):
    id: int
    order: ShortOrderResponse
    user_author: UserResponse
    user_target: UserResponse
    rating: int
    comment: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

class CreateReview(BaseModel):
    id_order: int
    id_user_target: int
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None

class UpdateReview(BaseModel):
    rating: Optional[int] = Field(None, ge=1, le=5)
    comment: Optional[str] = None