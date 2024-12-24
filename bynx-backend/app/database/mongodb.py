from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

async def get_mongo_connection():
    client = AsyncIOMotorClient(os.getenv('MONGODB_URI'))
    db = client[os.getenv('MONGODB_DATABASE')]
    return db

def get_collection(collection_name: str):
    client = AsyncIOMotorClient(os.getenv('MONGODB_URI'))
    db = client[os.getenv('MONGODB_DATABASE')]
    return db[collection_name]