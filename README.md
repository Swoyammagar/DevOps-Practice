# MERN Movie Watchlist (CineWatch)

A minimal full-stack movie watchlist application built with the MERN stack (MongoDB, Express, React, Node.js). Add movies to your watchlist, pick a genre, rate them with stars, mark them as watched, and remove them — all through a dark, cinema-themed UI.

## Project Structure

```
/
├── frontend/           # React + Vite
├── backend/            # Node.js + Express
└── README.md
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) — local installation, [MongoDB Atlas](https://www.mongodb.com/atlas), or a Docker container (see below)

## Running MongoDB with Docker (optional)

If you don't have MongoDB installed locally, run it in a container:

```bash
docker run -d --name mern-movie-mongo -p 27017:27017 mongo:7
# Reuse it on later runs (data persists):
docker start mern-movie-mongo
# Stop it when done:
docker stop mern-movie-mongo
```

The backend's `MONGO_URI` in `backend/.env` already points to `mongodb://localhost:27017/mern-movie-watchlist`.

## Setup & Run

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # Update MONGO_URI with your MongoDB connection string
npm start              # Starts on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env   # VITE_API_URL defaults to http://localhost:5000
npm run dev            # Starts on http://localhost:5173
```

### 3. Open the app

Visit **http://localhost:5173** in your browser.

## API Endpoints

| Method | Endpoint            | Description         |
|--------|---------------------|---------------------|
| GET    | /api/movies         | Get all movies      |
| POST   | /api/movies         | Create a new movie  |
| PATCH  | /api/movies/:id     | Toggle watched      |
| DELETE | /api/movies/:id     | Delete a movie      |

## Model Fields

| Field    | Type    | Description                              |
|----------|---------|------------------------------------------|
| title    | String  | Movie title (required)                   |
| genre    | String  | Optional genre, e.g. "Sci-Fi"            |
| rating   | Number  | Star rating from 1 to 5 (default 3)      |
| watched  | Boolean | Whether the movie has been watched       |
| createdAt / updatedAt | Date | Auto-managed timestamps          |
