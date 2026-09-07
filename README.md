# QuickLink

A simple full-stack URL shortener built with React, TypeScript, Vite, Tailwind CSS, Express, and PostgreSQL.

## Project structure

```
client/               React + TypeScript frontend (Vite, Tailwind CSS)
  src/
    components/        Header, ShortenForm, StatusMessage, ShortUrlResult, Footer
    lib/shorten.ts      URL validation + /shorten API call
    App.tsx             Top-level state and layout
server/                Express + TypeScript backend
  src/
    index.ts            App setup and routes
    db.ts                PostgreSQL connection pool
    env.ts               Loads environment variables
  schema.sql             PostgreSQL table schema
```

## Prerequisites

- Node.js 18+ installed
- PostgreSQL installed and running
- `npm` available

## Database setup

1. Create a PostgreSQL database:

    ```bash
    createdb url_shortener
    ```

2. Initialize the schema:

    ```bash
    psql url_shortener -f server/schema.sql
    ```

3. Create a `.env` file in `server/` with your connection string:

    ```env
    DATABASE_URL=postgres://user:password@localhost:5432/url_shortener
    PORT=5000
    ```

## Server setup

```bash
cd server
npm install
```

Run the backend in development (TypeScript, hot reload via `tsx`):

```bash
npm run dev
```

Build and run the compiled JavaScript:

```bash
npm run build
npm start
```

The API will be available at `http://localhost:5000`.

## Client setup

```bash
cd client
npm install
```

Run the frontend:

```bash
npm run dev
```

Open the local URL shown in the terminal, typically `http://localhost:5173`.

Build for production (type-checks then bundles):

```bash
npm run build
```

## API Endpoints

- `GET /health` — health check
- `GET /` — API status
- `POST /shorten` — create a shortened URL from `{ longUrl }`
- `GET /:code` — redirect to the original URL

## Notes

- The backend validates incoming URLs and returns informative errors.
- The database schema stores a unique `short_code` and tracks creation time.
- Vite is configured to proxy `/shorten` and `/health` calls to the backend for local development.
- The frontend UI is styled with Tailwind CSS and follows the system's light/dark color scheme automatically.

## Optional client config

If you want the frontend to call the backend directly without relying on the Vite proxy, create `client/.env` with:

```env
VITE_API_URL=http://localhost:5000
```

Then restart the Vite dev server.
