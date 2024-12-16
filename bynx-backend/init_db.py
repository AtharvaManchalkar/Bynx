import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv
import os

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
    CREATE TABLE IF NOT EXISTS Bins (
        bin_id INT AUTO_INCREMENT PRIMARY KEY,
        location VARCHAR(255) NOT NULL,
        capacity INT NOT NULL,
        current_level INT NOT NULL,
        status ENUM('Empty', 'Partially Full', 'Full', 'Damaged') NOT NULL,
        last_collected TIMESTAMP NULL
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
        bin_id INT,
        description TEXT NOT NULL,
        status ENUM('Pending', 'Resolved') DEFAULT 'Pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        resolved_at DATETIME,
        FOREIGN KEY (user_id) REFERENCES Users(user_id),
        FOREIGN KEY (bin_id) REFERENCES Bins(bin_id)
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
        description VARCHAR(255) NOT NULL,
        status ENUM('pending', 'completed') DEFAULT 'pending',
        bin_id INT NOT NULL,
        worker_id INT NOT NULL,
        deadline DATETIME NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (bin_id) REFERENCES Bins(bin_id),
        FOREIGN KEY (worker_id) REFERENCES Users(user_id)
    )
    """)
    
    connection.commit()

def insert_initial_data(connection):
    cursor = connection.cursor()
    
    # Insert initial data for Routes
    cursor.execute("SELECT COUNT(*) FROM Routes")
    if cursor.fetchone()[0] == 0:
        cursor.execute("""
        INSERT INTO Routes (start_point, end_point, total_distance)
        VALUES
        ('Depot', 'Downtown', 10.5),
        ('Depot', 'Uptown', 15.0),
        ('Depot', 'Suburb', 20.0)
        """)
    
    # Insert initial data for Bins
    cursor.execute("SELECT COUNT(*) FROM Bins")
    if cursor.fetchone()[0] == 0:
        cursor.execute("""
        INSERT INTO Bins (location, capacity, current_level, status, last_collected)
        VALUES
        ('Downtown', 100, 50, 'Partially Full', NOW()),
        ('Uptown', 200, 100, 'Full', NOW()),
        ('Suburb', 150, 0, 'Empty', NOW())
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
        ('V003', 1200, 'Under Maintenance')
        """)
    
    # Insert initial data for Users
    cursor.execute("SELECT COUNT(*) FROM Users")
    if cursor.fetchone()[0] == 0:
        cursor.execute("""
        INSERT INTO Users (name, email, password, role, vehicle_id)
        VALUES
        ('Admin User', 'admin@example.com', 'adminpassword', 'Admin', NULL),
        ('Worker User', 'worker@example.com', 'workerpassword', 'Worker', 1),
        ('Regular User', 'user@example.com', 'userpassword', 'User', NULL)
        """)
    
    # Insert initial data for Complaints
    cursor.execute("SELECT COUNT(*) FROM Complaints")
    if cursor.fetchone()[0] == 0:
        cursor.execute("""
        INSERT INTO Complaints (user_id, bin_id, description, status, created_at, resolved_at)
        VALUES
        (3, 1, 'Bin is overflowing', 'Pending', NOW(), NULL),
        (3, 2, 'Bin is damaged', 'Resolved', NOW(), NOW())
        """)
    
    # Insert initial data for MaintenanceRequests
    cursor.execute("SELECT COUNT(*) FROM MaintenanceRequests")
    if cursor.fetchone()[0] == 0:
        cursor.execute("""
        INSERT INTO MaintenanceRequests (bin_id, description, status, created_at, completed_at)
        VALUES
        (1, 'Fix the lid', 'Pending', NOW(), NULL),
        (2, 'Replace the bin', 'Completed', NOW(), NOW())
        """)
    
    # Insert initial data for Tasks
    cursor.execute("SELECT COUNT(*) FROM Tasks")
    if cursor.fetchone()[0] == 0:
        cursor.execute("""
        INSERT INTO Tasks (description, status, bin_id, worker_id, deadline)
        VALUES
        ('Task 1', 'pending', 1, 2, NOW() + INTERVAL 1 DAY),
        ('Task 2', 'completed', 2, 3, NOW() + INTERVAL 2 DAY),
        ('Task 3', 'pending', 3, 1, NOW() + INTERVAL 3 DAY)
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