from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import bins, tasks, complaints, users, announcements, auth, summary_metrics, maintenance_requests, report_data
from dotenv import load_dotenv
import subprocess

# Load environment variables from .env file
load_dotenv()

# Initialize the database with initial data
subprocess.run(["python", "init_db.py"])

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to your frontend's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the routers
app.include_router(auth.router)
app.include_router(summary_metrics.router)
app.include_router(complaints.router)
app.include_router(maintenance_requests.router)
app.include_router(report_data.router)
app.include_router(bins.router)
app.include_router(tasks.router)
app.include_router(users.router)
app.include_router(announcements.router)