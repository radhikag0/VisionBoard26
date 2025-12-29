from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List
import shutil
import uuid # Imported at the top to ensure it is available for the upload endpoint

from models import (
    Goal, GoalCreate, GoalUpdate,
    Todo, TodoCreate, TodoUpdate,
    MoodBoardImage, MoodBoardImageCreate, MoodBoardImageUpdate,
    GalleryItem, GalleryItemCreate
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create uploads directory
UPLOADS_DIR = ROOT_DIR / 'uploads'
UPLOADS_DIR.mkdir(exist_ok=True)

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Collections
goals_collection = db.goals
todos_collection = db.todos
moodboard_collection = db.moodboard
gallery_collection = db.gallery

# Create the main app
app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root route defined on the main app
@app.get("/")
async def root():
    return {"message": "2026 Vision Board API"}

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Mount uploads directory for static file serving
app.mount("/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="uploads")

# Goals Endpoints
@api_router.get("/goals", response_model=List[Goal])
async def get_goals():
    goals = await goals_collection.find().to_list(1000)
    return [Goal(**goal) for goal in goals]

@api_router.post("/goals", response_model=Goal)
async def create_goal(goal_data: GoalCreate):
    goal = Goal(**goal_data.dict())
    await goals_collection.insert_one(goal.dict())
    return goal

@api_router.put("/goals/{goal_id}", response_model=Goal)
async def update_goal(goal_id: str, goal_data: GoalUpdate):
    existing_goal = await goals_collection.find_one({"id": goal_id})
    if not existing_goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    
    update_data = {k: v for k, v in goal_data.dict().items() if v is not None}
    await goals_collection.update_one({"id": goal_id}, {"$set": update_data})
    
    updated_goal = await goals_collection.find_one({"id": goal_id})
    return Goal(**updated_goal)

@api_router.delete("/goals/{goal_id}")
async def delete_goal(goal_id: str):
    result = await goals_collection.delete_one({"id": goal_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Goal not found")
    return {"message": "Goal deleted"}

# Todos Endpoints
@api_router.get("/todos", response_model=List[Todo])
async def get_todos():
    todos = await todos_collection.find().to_list(1000)
    return [Todo(**todo) for todo in todos]

@api_router.post("/todos", response_model=Todo)
async def create_todo(todo_data: TodoCreate):
    todo = Todo(**todo_data.dict())
    await todos_collection.insert_one(todo.dict())
    return todo

@api_router.put("/todos/{todo_id}", response_model=Todo)
async def update_todo(todo_id: str, todo_data: TodoUpdate):
    existing_todo = await todos_collection.find_one({"id": todo_id})
    if not existing_todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    update_data = {k: v for k, v in todo_data.dict().items() if v is not None}
    await todos_collection.update_one({"id": todo_id}, {"$set": update_data})
    
    updated_todo = await todos_collection.find_one({"id": todo_id})
    return Todo(**updated_todo)

@api_router.delete("/todos/{todo_id}")
async def delete_todo(todo_id: str):
    result = await todos_collection.delete_one({"id": todo_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Todo not found")
    return {"message": "Todo deleted"}

# MoodBoard Endpoints
@api_router.get("/moodboard", response_model=List[MoodBoardImage])
async def get_moodboard_images():
    images = await moodboard_collection.find().to_list(1000)
    return [MoodBoardImage(**img) for img in images]

@api_router.post("/moodboard", response_model=MoodBoardImage)
async def create_moodboard_image(image_data: MoodBoardImageCreate):
    image = MoodBoardImage(**image_data.dict())
    await moodboard_collection.insert_one(image.dict())
    return image

@api_router.put("/moodboard/{image_id}", response_model=MoodBoardImage)
async def update_moodboard_image(image_id: str, image_data: MoodBoardImageUpdate):
    existing_image = await moodboard_collection.find_one({"id": image_id})
    if not existing_image:
        raise HTTPException(status_code=404, detail="Image not found")
    
    update_data = image_data.dict(exclude_unset=True)
    await moodboard_collection.update_one({"id": image_id}, {"$set": update_data})
    
    updated_image = await moodboard_collection.find_one({"id": image_id})
    return MoodBoardImage(**updated_image)

@api_router.delete("/moodboard/{image_id}")
async def delete_moodboard_image(image_id: str):
    result = await moodboard_collection.delete_one({"id": image_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Image not found")
    return {"message": "Image deleted"}

# Gallery Endpoints
@api_router.get("/gallery", response_model=List[GalleryItem])
async def get_gallery_items():
    items = await gallery_collection.find().to_list(1000)
    return [GalleryItem(**item) for item in items]

@api_router.post("/gallery", response_model=GalleryItem)
async def create_gallery_item(item_data: GalleryItemCreate):
    item = GalleryItem(**item_data.dict())
    await gallery_collection.insert_one(item.dict())
    return item

@api_router.delete("/gallery/{item_id}")
async def delete_gallery_item(item_id: str):
    result = await gallery_collection.delete_one({"id": item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    return {"message": "Gallery item deleted"}

# File Upload Endpoint
@api_router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        # Create unique filename using uuid
        file_extension = Path(file.filename).suffix
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = UPLOADS_DIR / unique_filename
        
        # Save file to local disk
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Return the URL path for the frontend
        file_url = f"/uploads/{unique_filename}"
        return {"url": file_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")
    finally:
        file.file.close()

# Include the router in the main app
app.include_router(api_router)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()