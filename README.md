# Bookshelf Management Application

A full-stack application for managing a collection of books with a Python FastAPI backend and Next.js frontend.

## Project Overview

This application allows users to manage their book collection with the following features:

-   View all books in the collection
-   Add new books individually or via JSON upload
-   Edit existing book details
-   Delete books from the collection
-   Sort books by title, author, or year
-   Search for books by title

## Technology Stack

### Backend

-   Python 3.12
-   FastAPI framework
-   In-memory data storage
-   Custom sorting algorithm implementation
-   API key authentication

### Frontend

-   Next.js 15
-   React 19
-   TypeScript
-   TailwindCSS for styling
-   React Query for data fetching and state management
-   React Hook Form with Zod validation
-   shadcn UI components

## Prerequisites

-   Docker and Docker Compose
-   Node.js 20+ and npm/bun (for local development)
-   Python 3.12 (for local development)

## Getting Started

### Using Docker (Recommended)

1. Clone the repository:

    ```bash
    git clone <repository-url>
    cd bookshelf-management-app
    ```

2. Create a `.env` file in the root directory with the following content:

    ```
    API_SECRET=your_api_key_here
    NEXT_PUBLIC_BACKEND_URL=http://localhost:8000/api/v1
    NEXT_PUBLIC_API_KEY=your_api_key_here
    ```

3. Build and start the containers:

    ```bash
    docker-compose up --d
    ```

4. Access the application:
    - Frontend: http://localhost:3000
    - Backend API: http://localhost:8000/api/v1/books

### Running Locally (Development)

See the README files in the `www` and `server` directories for instructions on running each component locally.
