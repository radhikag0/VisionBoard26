from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import uuid

# Goal Model
class GoalBase(BaseModel):
    title: str
    category: str

class GoalCreate(GoalBase):
    pass

class GoalUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    completed: Optional[bool] = None

class Goal(GoalBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    completed: bool = False
    createdAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

# Todo Model
class TodoBase(BaseModel):
    title: str
    priority: str  # high, medium, low
    dueDate: Optional[str] = None

class TodoCreate(TodoBase):
    pass

class TodoUpdate(BaseModel):
    title: Optional[str] = None
    priority: Optional[str] = None
    dueDate: Optional[str] = None
    completed: Optional[bool] = None

class Todo(TodoBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    completed: bool = False
    createdAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

# MoodBoard Image Model
class ImagePosition(BaseModel):
    x: float
    y: float
    rotation: float
    zIndex: int

class MoodBoardImageBase(BaseModel):
    url: str
    position: ImagePosition
    width: float
    height: float

class MoodBoardImageCreate(MoodBoardImageBase):
    pass

class MoodBoardImageUpdate(BaseModel):
    url: Optional[str] = None
    position: Optional[ImagePosition] = None
    width: Optional[float] = None
    height: Optional[float] = None

class MoodBoardImage(MoodBoardImageBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))

# Gallery Item Model
class GalleryItemBase(BaseModel):
    type: str  # 'image' or 'video'
    url: str
    title: str
    description: Optional[str] = None
    date: str

class GalleryItemCreate(GalleryItemBase):
    pass

class GalleryItem(GalleryItemBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))