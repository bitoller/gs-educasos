# Educa SOS - Frontend

This is the frontend application for the Educa SOS Platform, built with React and Vite.

## Features

*   User Authentication (Login, Register)
*   Emergency Kit Management (View, Create, Edit, Delete Auto and Custom Kits)
*   Disaster Awareness Content (View Content)
*   (Add any other key frontend features here)

## Getting Started

To set up and run the frontend application, follow these steps:

1.  **Navigate to the frontend project root:**

    ```bash
    cd /path/to/your/project/root
    ```

2.  **Install Dependencies:**

    ```bash
    npm install
    # or yarn install
    ```

3.  **Start the Development Server:**

    ```bash
    npm run dev
    # or yarn dev
    ```

    The frontend application should now be running on `http://localhost:5173` (or another port if 5173 is in use).

## API Communication

This frontend application communicates with the backend API. Ensure the backend is running before starting the frontend development server.

The frontend development server is configured to proxy API requests (starting with `/api`) to the backend, which is expected to be running on `http://localhost:8080/disaster-awareness`.

For details on setting up and running the backend, please refer to the `README.md` file located in the `backend/` directory.
