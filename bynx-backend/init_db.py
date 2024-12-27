import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

def create_connection():
    try:
        connection = mysql.connector.connect(
            host=os.getenv("MYSQL_HOST"),
            user=os.getenv("MYSQL_USER"),
            password=os.getenv("MYSQL_PASSWORD"),
            database=os.getenv("MYSQL_DATABASE")
        )
        if connection.is_connected():
            print("Connected to MySQL database")
            return connection
    except Error as e:
        print(f"Error: {e}")
        return None

def create_tables(connection):
    cursor = connection.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS Location (
        location_id INT AUTO_INCREMENT PRIMARY KEY,
        latitude DECIMAL(9,6) NOT NULL,
        longitude DECIMAL(9,6) NOT NULL,
        address VARCHAR(255) NOT NULL
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS Users (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        role ENUM('Admin', 'Worker', 'User') NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        phone VARCHAR(15),
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        location_id INT,
        FOREIGN KEY (location_id) REFERENCES Location(location_id)
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS Vehicle (
        vehicle_id INT AUTO_INCREMENT PRIMARY KEY,
        vehicle_number VARCHAR(50) NOT NULL,
        capacity INT NOT NULL,
        last_maintenance TIMESTAMP,
        assigned_worker_id INT,
        location_id INT,
        FOREIGN KEY (assigned_worker_id) REFERENCES Users(user_id),
        FOREIGN KEY (location_id) REFERENCES Location(location_id)
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS WasteBin (
        bin_id INT AUTO_INCREMENT PRIMARY KEY,
        current_level INT NOT NULL,
        last_emptied TIMESTAMP,
        type VARCHAR(50) NOT NULL,
        location_id INT NOT NULL,
        vehicle_id INT,
        FOREIGN KEY (location_id) REFERENCES Location(location_id),
        FOREIGN KEY (vehicle_id) REFERENCES Vehicle(vehicle_id)
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS WasteProcessingCenter (
        center_id INT AUTO_INCREMENT PRIMARY KEY,
        address VARCHAR(255) NOT NULL,
        processing_type VARCHAR(50) NOT NULL,
        capacity INT NOT NULL,
        contact_no VARCHAR(15) NOT NULL
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS WasteRecord (
        record_id INT AUTO_INCREMENT PRIMARY KEY,
        weight DECIMAL(10,2) NOT NULL,
        date_collected TIMESTAMP NOT NULL,
        processing_center_id INT NOT NULL,
        bin_id INT NOT NULL,
        FOREIGN KEY (processing_center_id) REFERENCES WasteProcessingCenter(center_id),
        FOREIGN KEY (bin_id) REFERENCES WasteBin(bin_id)
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS MaintenanceRecord (
        maintenance_id INT AUTO_INCREMENT PRIMARY KEY,
        details TEXT NOT NULL,
        cost DECIMAL(10,2) NOT NULL,
        maintenance_date TIMESTAMP,
        vehicle_id INT NOT NULL,
        status ENUM('Pending', 'Resolved') DEFAULT 'Pending',
        FOREIGN KEY (vehicle_id) REFERENCES Vehicle(vehicle_id)
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS Complaint (
        complaint_id INT AUTO_INCREMENT PRIMARY KEY,
        description TEXT NOT NULL,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        resolved_at TIMESTAMP,
        status ENUM('Pending','Assigned', 'Resolved') DEFAULT 'Pending',
        user_id INT NOT NULL,
        location_id INT NOT NULL,
        assigned_to VARCHAR(100),
        worker_id INT,
        FOREIGN KEY (user_id) REFERENCES Users(user_id),
        FOREIGN KEY (location_id) REFERENCES Location(location_id)
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS WasteCollectionSchedule (
        schedule_id INT AUTO_INCREMENT PRIMARY KEY,
        collection_date TIMESTAMP NOT NULL,
        collected_at TIMESTAMP,
        status ENUM('Scheduled', 'Completed', 'Missed') DEFAULT 'Scheduled',
        worker_id INT NOT NULL,
        vehicle_id INT NOT NULL,
        bin_id INT NOT NULL,
        FOREIGN KEY (worker_id) REFERENCES Users(user_id),
        FOREIGN KEY (vehicle_id) REFERENCES Vehicle(vehicle_id),
        FOREIGN KEY (bin_id) REFERENCES WasteBin(bin_id)
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS Alert (
        alert_id INT AUTO_INCREMENT PRIMARY KEY,
        type VARCHAR(50) NOT NULL,
        bin_id INT NOT NULL,
        FOREIGN KEY (bin_id) REFERENCES WasteBin(bin_id)
    )
    """)

    connection.commit()

def insert_initial_data(connection):
    cursor = connection.cursor()

    # Insert initial data for Location
    cursor.execute("SELECT COUNT(*) FROM Location")
    if cursor.fetchone()[0] == 0:
        cursor.execute("""
        INSERT INTO Location (latitude, longitude, address)
        VALUES
        (12.9716, 77.5946, 'Bangalore, India'),
        (13.0827, 80.2707, 'Chennai, India'),
        (19.0760, 72.8777, 'Mumbai, India')
        """)

    # Insert initial data for Users
    cursor.execute("SELECT COUNT(*) FROM Users")
    if cursor.fetchone()[0] == 0:
        users = [
            ("Admin User", "Admin", "admin@example.com", "1234567890", "admin", 1),
            ("Worker User", "Worker", "worker@example.com", "0987654321", "worker", 2),
            ("Regular User", "User", "user@example.com", "1122334455", "user", 3)
        ]
        cursor.executemany("""
        INSERT INTO Users (name, role, email, phone, password, location_id)
        VALUES (%s, %s, %s, %s, %s, %s)
        """, users)

    # Insert initial data for Vehicle
    cursor.execute("SELECT COUNT(*) FROM Vehicle")
    if cursor.fetchone()[0] == 0:
        cursor.execute("""
        INSERT INTO Vehicle (vehicle_number, capacity, last_maintenance, assigned_worker_id, location_id)
        VALUES
        ('V001', 1000, NOW(), 2, 1),
        ('V002', 1500, NOW(), 2, 2),
        ('V003', 1200, NOW(), 2, 3)
        """)

    # Insert initial data for WasteBin
    cursor.execute("SELECT COUNT(*) FROM WasteBin")
    if cursor.fetchone()[0] == 0:
        cursor.execute("""
        INSERT INTO WasteBin (current_level, last_emptied, type, location_id, vehicle_id)
        VALUES
        (50, NOW(), 'General', 1, 1),
        (75, NOW(), 'Recyclable', 2, 2),
        (30, NOW(), 'Organic', 3, 3)
        """)

    # Insert initial data for WasteProcessingCenter
    cursor.execute("SELECT COUNT(*) FROM WasteProcessingCenter")
    if cursor.fetchone()[0] == 0:
        cursor.execute("""
        INSERT INTO WasteProcessingCenter (address, processing_type, capacity, contact_no)
        VALUES
        ('123 Main St', 'Recycling', 500, '123-456-7890'),
        ('456 Elm St', 'Composting', 300, '987-654-3210'),
        ('789 Oak St', 'Incineration', 700, '555-555-5555')
        """)

    # Insert initial data for WasteRecord
    cursor.execute("SELECT COUNT(*) FROM WasteRecord")
    if cursor.fetchone()[0] == 0:
        cursor.execute("""
        INSERT INTO WasteRecord (weight, date_collected, processing_center_id, bin_id)
        VALUES
        (100.5, NOW(), 1, 1),
        (200.0, NOW(), 2, 2),
        (150.0, NOW(), 3, 3)
        """)

    # Insert initial data for MaintenanceRecord
    cursor.execute("SELECT COUNT(*) FROM MaintenanceRecord")
    if cursor.fetchone()[0] == 0:
        cursor.execute("""
        INSERT INTO MaintenanceRecord (details, cost, maintenance_date, vehicle_id)
        VALUES
        ('Oil change', 50.0, NOW(), 1),
        ('Tire replacement', 100.0, NOW(), 2),
        ('Brake repair', 75.0, NOW(), 3)
        """)

    # Insert initial data for Complaint
    cursor.execute("SELECT COUNT(*) FROM Complaint")
    if cursor.fetchone()[0] == 0:
        cursor.execute("""
        INSERT INTO Complaint (description, submitted_at, resolved_at, status, user_id, location_id, assigned_to, worker_id)
        VALUES
        ('Bin is overflowing', NOW(), NULL, 'Pending', 3, 1, NULL, NULL),
        ('Bin is damaged', NOW(), NOW(), 'Resolved', 3, 2, 'Worker User', 2),
        ('Bin is not emptied', NOW(), NULL, 'Pending', 3, 3, NULL, NULL)
        """)

    # Insert initial data for WasteCollectionSchedule
    cursor.execute("SELECT COUNT(*) FROM WasteCollectionSchedule")
    if cursor.fetchone()[0] == 0:
        cursor.execute("""
        INSERT INTO WasteCollectionSchedule (collection_date, collected_at, status, worker_id, vehicle_id, bin_id)
        VALUES
        (NOW(), NULL, 'Scheduled', 2, 1, 1),
        (NOW(), NOW(), 'Completed', 2, 2, 2),
        (NOW(), NULL, 'Missed', 2, 3, 3)
        """)

    # Insert initial data for Alert
    cursor.execute("SELECT COUNT(*) FROM Alert")
    if cursor.fetchone()[0] == 0:
        cursor.execute("""
        INSERT INTO Alert (type, bin_id)
        VALUES
        ('Overflow', 1),
        ('Damage', 2),
        ('Maintenance', 3)
        """)

    connection.commit()

def main():
    connection = create_connection()
    if connection:
        create_tables(connection)
        insert_initial_data(connection)
        connection.close()

if __name__ == "__main__":
    main()