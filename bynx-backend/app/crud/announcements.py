from app.database.mongodb import get_collection
from app.schemas.announcements import AnnouncementCreate, AnnouncementResponse
from bson import ObjectId

async def get_announcements():
    collection = get_collection("announcements")
    announcements = await collection.find().to_list(length=None)
    return [AnnouncementResponse(id=str(a["_id"]), **a) for a in announcements]

async def create_announcement(announcement: AnnouncementCreate):
    collection = get_collection("announcements")
    result = await collection.insert_one(announcement.dict())
    return str(result.inserted_id)