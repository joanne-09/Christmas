# Merry Christmas Website

## Running the Project

Run the entire stack using Docker Compose. This will build the images and start the services.

1.  **Build and Start:**
    ```bash
    docker-compose up --build
    ```

2.  **Access the Application:**
    -   **Frontend:** [http://localhost:5173](http://localhost:5173)
    -   **Backend API Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)

3.  **Stop the Application:**
    Press `Ctrl+C` in the terminal or run:
    ```bash
    docker-compose down
    ```

## Project Structure

-   **`frontend/`**: React application created with Vite.
    -   Uses TypeScript for type safety.
    -   Uses Tailwind CSS for styling.
    -   Runs on port `5173`.
-   **`backend/`**: FastAPI application.
    -   Provides REST API endpoints.
    -   Runs on port `8000`.
-   **`docker-compose.yml`**: Orchestrates the multi-container application.

## CI/CD Pipelines

This project uses GitHub Actions for Continuous Integration. The workflows are defined in the `.github/workflows/` directory.

### 1. Backend workflow (`backend.yml`)
-   **Trigger:** Pushes or Pull Requests to the `main` branch affecting the `backend/` folder.
-   **Jobs:**
    -   Sets up Python 3.10.
    -   Installs dependencies from `requirements.txt`.
    -   Builds the Docker image to ensure the `Dockerfile` is valid.

### 2. Frontend workflow (`frontend.yml`)
-   **Trigger:** Pushes or Pull Requests to the `main` branch affecting the `frontend/` folder.
-   **Jobs:**
    -   Sets up Node.js 18.
    -   Installs dependencies (`npm install`).
    -   Runs the build script (`npm run build`) to check for compilation errors.
    -   Builds the Docker image to ensure the `Dockerfile` is valid.
