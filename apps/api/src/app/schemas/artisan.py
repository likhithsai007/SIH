from pydantic import BaseModel
from typing import List
from datetime import datetime


class ArtisanCreate(BaseModel):
    name: str
    location: str
    craft_category: str
    languages: List[str]
    business_type: str


class ArtisanResponse(BaseModel):
    id: str
    name: str
    location: str
    craft_category: str
    languages: List[str]
    business_type: str
    verification_status: str
    phone: str | None = None
    email: str | None = None
    profile_image: str | None = None
    created_at: datetime
    is_active: bool

    model_config = {"from_attributes": True}
