# ReceiptVault Fullstack Application

This project is a fullstack application with a React frontend and a Node.js/Express backend.

## Project Structure

- `client/`: Contains the React frontend application.
- `server/`: Contains the Node.js/Express backend API.

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

- Node.js (LTS version recommended)
- npm (Node Package Manager)
- MongoDB (for the backend database)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <your-repository-url>
    cd receiptvault
    ```

2.  **Backend Setup:**

    Navigate to the `server` directory and install dependencies:

    ```bash
    cd server
    npm install
    ```

3.  **Frontend Setup:**

    Navigate to the `client` directory and install dependencies:

    ```bash
    cd ../client
    npm install
    ```

### Environment Variables

Create a `.env` file in the `server/` directory with the following content:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string_here
```

-   `PORT`: The port on which the backend server will run (e.g., `5000`).
-   `MONGODB_URI`: Your MongoDB connection string. Replace `your_mongodb_connection_string_here` with your actual MongoDB URI (e.g., `mongodb://localhost:27017/receiptvault` or a cloud-based URI).

### Running the Application

To run both the frontend and backend concurrently, you can use the `dev` script from the root of the project (after installing `concurrently` and `nodemon` globally or as dev dependencies).

1.  **Install `concurrently` (if not already installed):**

    ```bash
    npm install -g concurrently # or npm install concurrently --save-dev in the root
    ```

2.  **From the project root directory (`receiptvault/`), run the combined development script:**

    ```bash
    npm run dev
    ```

    This script will:
    -   Start the backend server using `nodemon` (for automatic restarts on code changes).
    -   Start the React development server.

### Individual Scripts

-   **Backend (from `server/` directory):**

    ```bash
    npm start   # Starts the server
    npm run dev # Starts the server with nodemon
    ```

-   **Frontend (from `client/` directory):**

    ```bash
    npm start   # Starts the React development server
    ```

## Database Connection

The backend is configured to connect to MongoDB. Ensure your `MONGODB_URI` in `server/.env` is correctly set. You can use a local MongoDB instance or a cloud service like MongoDB Atlas.

Example MongoDB URI:

-   **Local:** `mongodb://localhost:27017/receiptvault`
-   **MongoDB Atlas:** `mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/<database-name>?retryWrites=true&w=majority`

## API Endpoints (Planned)

-   `POST /api/auth/register`: User registration
-   `POST /api/auth/login`: User login
-   `GET /api/receipts`: Get all receipts (user-specific or admin)
-   `POST /api/receipts`: Upload a new receipt
-   `GET /api/receipts/:id/download`: Download a specific receipt

## Contributing

Feel free to contribute to this project. Please follow standard Git workflow practices.