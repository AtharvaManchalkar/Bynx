# Bynx Project

## Prerequisites

- Node.js and npm installed
- Python 3.8+ installed
- MySQL server running
- MongoDB server running

## Setup Instructions

### Backend Setup

1. **Open Terminal 1** and navigate to the `bynx-backend` directory:

    ```sh
    cd bynx-backend
    ```

2. **Create and activate a virtual environment**:

    ```sh
    python3 -m venv venv
    source venv/bin/activate
    ```

3. **Install the required Python packages**:

    ```sh
    pip install -r requirements.txt
    ```

4. **Create a [.env](http://_vscodecontentref_/11) file** in the [bynx-backend](http://_vscodecontentref_/12) directory with the following content:

    ```plaintext
    MYSQL_USER=your_mysql_user
    MYSQL_PASSWORD=your_mysql_password
    MYSQL_HOST=localhost
    MYSQL_PORT=3306
    MYSQL_DATABASE=bynx_mysql
    MONGODB_URI=mongodb://localhost:27017
    MONGODB_DATABASE=bynx
    ```

5. **Start the backend server**:

    ```sh
    uvicorn app.main:app --reload
    ```

### Frontend Setup

1. **Open Terminal 2** and navigate to the [bynx-frontend](http://_vscodecontentref_/13) directory:

    ```sh
    cd bynx-frontend
    ```

2. **Install the required npm packages**:

    ```sh
    npm install
    ```

3. **Start the frontend server**:

    ```sh
    npm start
    ```

### Summary

- **Terminal 1**: Backend server running with `uvicorn`
- **Terminal 2**: Frontend server running with `npm start`

By following these steps, you will have both the backend and frontend servers running for the Bynx project.