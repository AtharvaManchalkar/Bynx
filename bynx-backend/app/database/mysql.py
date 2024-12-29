import mysql.connector
from mysql.connector import pooling
from dotenv import load_dotenv
import os

load_dotenv()

pool_config = {
    "pool_name": "mypool",
    "pool_size": 5,
    "pool_reset_session": True,
    "host": os.getenv('MYSQL_HOST'),
    "user": os.getenv('MYSQL_USER'),
    "password": os.getenv('MYSQL_PASSWORD'),
    "database": os.getenv('MYSQL_DATABASE'),
    "port": int(os.getenv('MYSQL_PORT')),
    "connect_timeout": 10
}

connection_pool = pooling.MySQLConnectionPool(**pool_config)

def get_mysql_connection():
    try:
        connection = connection_pool.get_connection()
        if connection.is_connected():
            return connection
    except mysql.connector.Error as e:
        print(f"Database connection error: {e}")
        return None
