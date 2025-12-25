# Merry Christmas Website

## Overview

[Webpage URL](https://joanne-09.github.io/Christmas/)

## Backend Deployment

1. Create a Docker image for the backend as `backend/Dockerfile`.
2. Create a workflow in `.github/workflows/backend.yml` to build and push the Docker image to a container registry on every push to the `master` branch.
3. Create a Render Web Service for the backend using the Docker image from the container registry.
4. Set Render hook URL in Github and configure this variable in workflow file.

## Frontend Deployment

1. Create a Docker image for the frontend as `frontend/Dockerfile`.
2. Create a workflow in `.github/workflows/frontend.yml` to build and deploy the frontend to GitHub Pages on every push to the `master` branch.
3. Configure Github page in the workfow file.

## Production Mode

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
