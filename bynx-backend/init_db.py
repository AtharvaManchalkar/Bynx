import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv
import os
from passlib.hash import bcrypt
from datetime import datetime

# Load environment variables from .env file
load_dotenv()

def create_connection():
    try:
        connection = mysql.connector.connect(
            host=os.getenv('MYSQL_HOST'),
            user=os.getenv('MYSQL_USER'),
            password=os.getenv('MYSQL_PASSWORD'),
            database=os.getenv('MYSQL_DATABASE'),
            port=os.getenv('MYSQL_PORT')
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
    CREATE TABLE IF NOT EXISTS Routes (
        route_id INT AUTO_INCREMENT PRIMARY KEY,
        start_point VARCHAR(255) NOT NULL,
        end_point VARCHAR(255) NOT NULL,
        total_distance DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS Vehicles (
        vehicle_id INT AUTO_INCREMENT PRIMARY KEY,
        vehicle_number VARCHAR(50) NOT NULL,
        capacity INT NOT NULL,
        status ENUM('Available', 'In Use', 'Under Maintenance') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS Users (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('Admin', 'Worker', 'User') NOT NULL,
        vehicle_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (vehicle_id) REFERENCES Vehicles(vehicle_id)
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS Locations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        latitude DECIMAL(9,6) NOT NULL,
        longitude DECIMAL(9,6) NOT NULL
    )
    """)
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS Bins (
        bin_id INT AUTO_INCREMENT PRIMARY KEY,
        location_id INT NOT NULL,
        capacity INT NOT NULL,
        current_level INT NOT NULL,
        status ENUM('Empty', 'Partially Full', 'Full', 'Damaged') NOT NULL,
        last_collected TIMESTAMP NULL,
        FOREIGN KEY (location_id) REFERENCES Locations(id)
    )
    """)
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS CollectionSchedules (
        schedule_id INT AUTO_INCREMENT PRIMARY KEY,
        bin_id INT NOT NULL,
        route_id INT NOT NULL,
        collection_time TIMESTAMP NOT NULL,
        status ENUM('Scheduled', 'Completed', 'Missed') DEFAULT 'Scheduled',
        FOREIGN KEY (bin_id) REFERENCES Bins(bin_id),
        FOREIGN KEY (route_id) REFERENCES Routes(route_id)
    )
    """)
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS Complaints (
        complaint_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        location VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        status ENUM('Pending', 'Resolved') DEFAULT 'Pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        resolved_at DATETIME,
        assigned_to VARCHAR(100) DEFAULT 'Not yet assigned',
        FOREIGN KEY (user_id) REFERENCES Users(user_id)
    )
    """)
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS MaintenanceRequests (
        request_id INT AUTO_INCREMENT PRIMARY KEY,
        bin_id INT NOT NULL,
        description TEXT NOT NULL,
        status ENUM('Pending', 'In Progress', 'Completed') DEFAULT 'Pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        completed_at DATETIME,
        FOREIGN KEY (bin_id) REFERENCES Bins(bin_id)
    )
    """)
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS Tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        complaint_id INT NOT NULL,
        location VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        status ENUM('pending', 'completed') DEFAULT 'pending',
        worker_id INT NOT NULL,
        assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (complaint_id) REFERENCES Complaints(complaint_id),
        FOREIGN KEY (worker_id) REFERENCES Users(user_id)
    )
    """)
    
    connection.commit()

def insert_initial_data(connection):
    cursor = connection.cursor()
    
    cursor.execute("SELECT COUNT(*) FROM Locations")
    if cursor.fetchone()[0] == 0:
        cursor.execute("""
        INSERT INTO Locations (name, latitude, longitude)
        VALUES
        ('Downtown', 12.9716, 77.5946),
        ('Uptown', 12.2958, 76.6394),
        ('Suburb', 11.0168, 76.9558)
        """)
 
    # Insert initial data for Routes
    cursor.execute("SELECT COUNT(*) FROM Routes")
    if cursor.fetchone()[0] == 0:
        cursor.execute("""
        INSERT INTO Routes (start_point, end_point, total_distance)
        VALUES
        ('Uptown', 'Downtown', 10.5),
        ('Suburb', 'Uptown', 15.0),
        ('Uptown', 'Suburb', 20.0)
        """)
    
    # Insert initial data for Bins
    cursor.execute("SELECT COUNT(*) FROM Bins")
    if cursor.fetchone()[0] == 0:
        cursor.execute("""
        INSERT INTO Bins (location_id, capacity, current_level, status, last_collected)
        VALUES
        (1, 100, 50, 'Partially Full', NOW()),
        (2, 200, 100, 'Full', NOW()),
        (3, 150, 0, 'Empty', NOW())
        """)

    # Insert initial data for CollectionSchedules
    cursor.execute("SELECT COUNT(*) FROM CollectionSchedules")
    if cursor.fetchone()[0] == 0:
        cursor.execute("""
        INSERT INTO CollectionSchedules (bin_id, route_id, collection_time, status)
        VALUES 
        (1, 1, NOW(), 'Scheduled'),
        (2, 2, NOW(), 'Scheduled'),
        (3, 3, NOW(), 'Scheduled')
        """)
    
    # Insert initial data for Vehicles
    cursor.execute("SELECT COUNT(*) FROM Vehicles")
    if cursor.fetchone()[0] == 0:
        cursor.execute("""
        INSERT INTO Vehicles (vehicle_number, capacity, status)
        VALUES
        ('V001', 1000, 'Available'),
        ('V002', 1500, 'In Use'),
        ('V003', 1200, 'Under Maintenance'),
        ('V004', 1300, 'Available'),
        ('V005', 1400, 'In Use')
        """)
    
    # Insert initial data for Users
    cursor.execute("SELECT COUNT(*) FROM Users")
    if cursor.fetchone()[0] == 0:
        users = [
            ("Admin User", "admin@example.com", "adminpassword", "Admin", None),
            ("Worker User", "worker@example.com", "workerpassword", "Worker", 1),
            ("Regular User", "user@example.com", "userpassword", "User", None),
            ("Worker One", "worker1@example.com", "worker1password", "Worker", 2),
            ("Worker Two", "worker2@example.com", "worker2password", "Worker", 3),
            ("Worker Three", "worker3@example.com", "worker3password", "Worker", 4),
            ("Worker Four", "worker4@example.com", "worker4password", "Worker", 5)
        ]
        cursor.executemany("""
        INSERT INTO Users (name, email, password, role, vehicle_id)
        VALUES (%s, %s, %s, %s, %s)
        """, users)
    
    # Insert initial data for Complaints
    cursor.execute("SELECT COUNT(*) FROM Complaints")
    if cursor.fetchone()[0] == 0:
        complaints = [
            (3, 'Uptown', 'Bin is overflowing', 'Pending', datetime.now(), None, 'Not yet assigned'),
            (3, 'Uptown', 'Bin is damaged', 'Resolved', datetime.now(), datetime.now(), 'Worker One'),
            (4, 'Suburb', 'Bin is full', 'Pending', datetime.now(), None, 'Not yet assigned'),
            (5, 'Downtown', 'Bin is partially full', 'Pending', datetime.now(), None, 'Not yet assigned'),
            (6, 'Downtown', 'Bin is empty', 'Resolved', datetime.now(), datetime.now(), 'Worker Two')
        ]
        cursor.executemany("""
        INSERT INTO Complaints (user_id, location, description, status, created_at, resolved_at, assigned_to)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, complaints)
    
    # Insert initial data for MaintenanceRequests
    cursor.execute("SELECT COUNT(*) FROM MaintenanceRequests")
    if cursor.fetchone()[0] == 0:
        maintenance_requests = [
            (1, 'Fix the lid', 'Pending', datetime.now(), None),
            (2, 'Replace the bin', 'Completed', datetime.now(), datetime.now()),
            (3, 'Repair the base', 'In Progress', datetime.now(), None)
        ]
        cursor.executemany("""
        INSERT INTO MaintenanceRequests (bin_id, description, status, created_at, completed_at)
        VALUES (%s, %s, %s, %s, %s)
        """, maintenance_requests)
    
    # Insert initial data for Tasks
    cursor.execute("SELECT COUNT(*) FROM Tasks")
    if cursor.fetchone()[0] == 0:
        tasks = [
            (1, 'Sector 5', 'Bin is overflowing', 'pending', 2, datetime.now()),
            (2, 'Central Park', 'Bin is damaged', 'completed', 3, datetime.now()),
            (3, 'Sector 8', 'Bin is full', 'pending', 4, datetime.now()),
            (4, 'Main Street', 'Bin is partially full', 'pending', 5, datetime.now()),
            (5, 'Sector 11', 'Bin is empty', 'completed', 6, datetime.now())
        ]
        cursor.executemany("""
        INSERT INTO Tasks (complaint_id, location, description, status, worker_id, assigned_at)
        VALUES (%s, %s, %s, %s, %s, %s)
        """, tasks)
    
    connection.commit()

def main():
    connection = create_connection()
    if connection:
        create_tables(connection)
        insert_initial_data(connection)
        connection.close()

if __name__ == "__main__":
    main()