from fastapi import FastAPI, APIRouter, HTTPException, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Literal, Dict, Any
import uuid
from datetime import datetime
from bson import ObjectId

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# ----------------------------------------------------------------------------
# Models
# ----------------------------------------------------------------------------
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

class InspirationCreate(BaseModel):
    url: str
    title: Optional[str] = None
    image_base64: Optional[str] = Field(default=None, description="Base64 image string")
    country: str
    city: str
    type: Literal['activity', 'cafe']
    theme: Optional[List[str]] = Field(default_factory=list)
    cost_indicator: Optional[Literal['$', '$$', '$$$']] = None
    vibe_notes: Optional[str] = None
    added_by: Optional[str] = None

class Inspiration(BaseModel):
    id: str
    url: str
    title: Optional[str] = None
    image_base64: Optional[str] = None
    country: str
    city: str
    type: Literal['activity', 'cafe']
    theme: List[str] = Field(default_factory=list)
    cost_indicator: Optional[Literal['$', '$$', '$$$']] = None
    vibe_notes: Optional[str] = None
    added_by: Optional[str] = None
    contributors: List[str] = Field(default_factory=list)
    created_at: datetime

class CountrySummary(BaseModel):
    country: str
    count: int
    contributors: List[str] = Field(default_factory=list)

class CitySummary(BaseModel):
    city: str
    count: int

# ----------------------------------------------------------------------------
# Utility
# ----------------------------------------------------------------------------

def _doc_to_inspiration(doc: Dict[str, Any]) -> Inspiration:
    return Inspiration(
        id=str(doc.get('_id')),
        url=doc.get('url'),
        title=doc.get('title'),
        image_base64=doc.get('image_base64'),
        country=doc.get('country'),
        city=doc.get('city'),
        type=doc.get('type'),
        theme=doc.get('theme', []) or [],
        cost_indicator=doc.get('cost_indicator'),
        vibe_notes=doc.get('vibe_notes'),
        added_by=doc.get('added_by'),
        contributors=doc.get('contributors', []) or [],
        created_at=doc.get('created_at') or datetime.utcnow(),
    )

# ----------------------------------------------------------------------------
# Routes
# ----------------------------------------------------------------------------
@api_router.get("/")
async def root():
    return {"message": "Verso API"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# ---- Inspirations CRUD (minimal for v1) ----
@api_router.post("/inspirations", response_model=Inspiration)
async def add_inspiration(payload: InspirationCreate):
    data = payload.dict()
    data['created_at'] = datetime.utcnow()
    data['contributors'] = [data.get('added_by')] if data.get('added_by') else []
    res = await db.inspirations.insert_one(data)
    inserted = await db.inspirations.find_one({"_id": res.inserted_id})
    return _doc_to_inspiration(inserted)

@api_router.get("/inspirations", response_model=List[Inspiration])
async def list_inspirations(country: Optional[str] = None, city: Optional[str] = None, type: Optional[str] = Query(default=None, pattern="^(activity|cafe)$")):
    q: Dict[str, Any] = {}
    if country:
        q['country'] = country
    if city:
        q['city'] = city
    if type:
        q['type'] = type
    docs = await db.inspirations.find(q).sort("created_at", -1).to_list(1000)
    return [_doc_to_inspiration(d) for d in docs]

# ---- Collections summaries ----
@api_router.get("/collections/summary", response_model=List[CountrySummary])
async def collections_summary():
    pipeline = [
        {"$group": {"_id": "$country", "count": {"$sum": 1}, "contributors": {"$addToSet": "$added_by"}}},
        {"$sort": {"count": -1}}
    ]
    agg = await db.inspirations.aggregate(pipeline).to_list(1000)
    out: List[CountrySummary] = []
    for row in agg:
        out.append(CountrySummary(country=row.get('_id'), count=row.get('count', 0), contributors=[c for c in (row.get('contributors') or []) if c]))
    return out

@api_router.get("/collections/{country}/cities", response_model=List[CitySummary])
async def cities_within_country(country: str):
    pipeline = [
        {"$match": {"country": country}},
        {"$group": {"_id": "$city", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    agg = await db.inspirations.aggregate(pipeline).to_list(1000)
    out: List[CitySummary] = []
    for row in agg:
        out.append(CitySummary(city=row.get('_id'), count=row.get('count', 0)))
    return out

@api_router.get("/city/{country}/{city}/items", response_model=List[Inspiration])
async def city_items(country: str, city: str, type: Optional[str] = Query(default=None, pattern="^(activity|cafe)$")):
    q: Dict[str, Any] = {"country": country, "city": city}
    if type:
        q['type'] = type
    docs = await db.inspirations.find(q).sort("created_at", -1).to_list(1000)
    return [_doc_to_inspiration(d) for d in docs]

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()