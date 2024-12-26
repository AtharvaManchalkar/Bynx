import mysql.connector
from mysql.connector import pooling
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

connection_pool = pooling.MySQLConnectionPool(
    pool_name="mypool",
    pool_size=10,
    host=os.getenv('MYSQL_HOST'),
    user=os.getenv('MYSQL_USER'),
    password=os.getenv('MYSQL_PASSWORD'),
    database=os.getenv('MYSQL_DATABASE'),
    port=int(os.getenv('MYSQL_PORT'))
)

def get_mysql_connection():
    try:
        connection = connection_pool.get_connection()
        if connection.is_connected():
            return connection
    except mysql.connector.Error as e:
        print(f"Error: {e}")
        return None