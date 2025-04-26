# Bookshelf Management API

Python FastAPI backend for the Bookshelf Management application.

## Features

-   RESTful API for managing books
-   In-memory data storage (no database required)
-   API key authentication
-   Custom sorting algorithm implementation
-   Search functionality

## Technology Stack

-   Python 3.12
-   FastAPI framework
-   Pydantic for data validation
-   python-dotenv for environment variables
-   uvicorn for ASGI server

## Prerequisites

-   Python 3.12
-   uv (for dependency management)

## Getting Started

### Development

1. Create a virtual environment and install dependencies:

    ```bash
    cd server
    pip install uv
    uv venv
    .venv/Scripts/activate
    uv pip install -r pyproject.toml
    ```

2. Create a `.env` file with the following content:

    ```
    API_SECRET=your_api_key_here
    ```

3. Start the development server:

    ```bash
    fastapi dev src/main.py
    ```

4. Access the API at [http://localhost:8000/api/v1/books](http://localhost:8000/api/v1/books)
   and the API documentation at [http://localhost:8000/docs](http://localhost:8000/docs)
