## Debt Tracking System (DTS)

Debt Tracking System (DTS) is a comprehensive full-stack application built with React and Django, designed to streamline the financial reconciliation process between businesses and their customers. 

### Frontend

*   **Framework:** React
*   **Routing:** React Router
*   **Styling:** Tailwind CSS
*   **UI Components:** Headless UI
*   **Icons:** React Icons
*   **API Client:** Axios
*   **Notifications:** React Toastify

### Backend

*   **Framework:** Django
*   **API:** Django REST Framework
*   **Authentication:** Token Authentication (DRF)
*   **CORS Management:** Django CORS Headers
*   **Database:** SQLite (Default for development)

## Setup and Installation

Follow these steps to run the project on your local machine.

### 1. Prerequisites

Ensure you have the following software installed on your system:
*   Python (3.8+ recommended)
*   Node.js and npm
*   Git

### 2. Project Setup

Clone the repository and navigate to the project directory:
```bash
git clone https://github.com/MustafaMertMumcu00/debt-tracking-system.git
cd debt-tracking-system
```

### 3. Backend Setup (Django)

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```

2.  Create and activate a virtual environment:
    *   **On macOS/Linux:**
        ```bash
        python3 -m venv venv
        source venv/bin/activate
        ```
    *   **On Windows:**
        ```bash
        python -m venv venv
        .\venv\Scripts\activate
        ```
        > **Note for Windows PowerShell users:** If you get an error about scripts being disabled, run the following command once to allow scripts for your user, then try the `activate` command again:
        > `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`

3.  Install the required Python packages from the `requirements.txt` file:
    ```bash
    pip install -r requirements.txt
    ```

4.  Create the database tables:
    ```bash
    python manage.py migrate
    ```

5.  Import the initial data into the database:
    ```bash
    python manage.py import_data
    ```

### 4. Frontend Setup (React)

1.  Open a new terminal and navigate to the frontend directory from the root project folder:
    ```bash
    cd frontend
    ```

2.  Install the required JavaScript packages:
    ```bash
    npm install
    ```

### 5. Running the Application

To run the application, you need to have both the backend and frontend servers running simultaneously in **two separate terminals**.

**Terminal 1 (Backend):**
```bash
# Make sure you are in the `backend` directory with the virtual environment (venv) activated:
python manage.py runserver
```
> The backend server will run on `http://localhost:8000`.

**Terminal 2 (Frontend):**
```bash
# Make sure you are in the `frontend` directory:
npm start
```
> The frontend development server will start and automatically open `http://localhost:3000` in your browser.

You are now ready to use the application.
