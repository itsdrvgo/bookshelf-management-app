# Bookshelf Management Frontend

Next.js frontend for the Bookshelf Management application.

## Features

- Display books with cover images and details
- Add new books individually or via JSON upload
- Edit book information
- Delete books
- Sort books by title, author, or year
- Search books by title
- Responsive design for all screen sizes

## Technology Stack

- Next.js 15
- React 19
- TypeScript
- TailwindCSS for styling
- React Query for data fetching
- React Hook Form with Zod validation
- Radix UI components with shadcn/ui
- Axios for API requests
- nuqs for URL query state management

## Prerequisites

- Node.js 20+ and npm/bun

## Getting Started

### Development

1. Install dependencies:

    ```bash
    cd www
    bun install
    ```

2. Create a `.env.local` file with the following content:

    ```
    NEXT_PUBLIC_BACKEND_URL=http://localhost:8000/api/v1
    NEXT_PUBLIC_API_KEY=your_api_key_here
    ```

3. Start the development server:

    ```bash
    bun run dev
    ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

1. Build the application:

    ```bash
    bun run build
    ```

2. Start the production server:
    ```bash
    bun run start
    ```
