from pydantic import BaseModel, Field, field_validator
import re
from typing import Optional

class SpecializationResponse(BaseModel):
    id: int
    name: str

class CreateSpecialization(BaseModel):
    name: str

class UpdateSpecialization(BaseModel):
    name: Optional[str] = None