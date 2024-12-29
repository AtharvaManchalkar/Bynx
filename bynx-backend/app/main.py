from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import bins, tasks, complaints, users, announcements, auth, summary_metrics, maintenance_requests, report_data, waste_processing_centers, waste_records, maintenance_records, waste_collection_schedules, alerts, maintenance
from dotenv import load_dotenv
import subprocess

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,  # Set to False since we're not using credentials
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)
# Load environment variables from .env file
load_dotenv()

# Initialize the database with initial data
subprocess.run(["python", "init_db.py"])

# Include routers
app.include_router(bins.router, prefix="/api")
app.include_router(tasks.router, prefix="/api")
app.include_router(complaints.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(announcements.router, prefix="/api")
app.include_router(auth.router, prefix="/api")
app.include_router(summary_metrics.router, prefix="/api")
app.include_router(maintenance_requests.router, prefix="/api")
app.include_router(report_data.router, prefix="/api")
app.include_router(waste_processing_centers.router, prefix="/api")
app.include_router(waste_records.router, prefix="/api")
app.include_router(maintenance_records.router, prefix="/api")
app.include_router(waste_collection_schedules.router, prefix="/api")
app.include_router(alerts.router, prefix="/api")
app.include_router(maintenance.router, prefix="/api")