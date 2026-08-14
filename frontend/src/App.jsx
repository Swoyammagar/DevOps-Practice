import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const GENRES = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Fantasy",
  "Horror",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Thriller",
];


function StarRating({ value, onChange, readOnly = false }) {
  return (
    <div className={`stars ${readOnly ? "read-only" : ""}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`star ${star <= value ? "on" : ""}`}
          onClick={() => !readOnly && onChange && onChange(star)}
          disabled={readOnly}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function App() {
  const [movies, setMovies] = useState([]);
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [rating, setRating] = useState(3);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // all | unwatched | watched

  // Fetch all movies on mount
  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${API_URL}/api/movies`);
      setMovies(res.data);
    } catch (err) {
      setError("Failed to load movies. Make sure the backend server is running.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setError(null);
      await axios.post(`${API_URL}/api/movies`, { title, genre, rating });
      setTitle("");
      setGenre("");
      setRating(3);
      fetchMovies();
    } catch (err) {
      setError("Failed to add movie. Please try again.");
      console.error(err);
    }
  };

  const handleToggle = async (id) => {
    try {
      setError(null);
      await axios.patch(`${API_URL}/api/movies/${id}`);
      fetchMovies();
    } catch (err) {
      setError("Failed to update movie.");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      setError(null);
      await axios.delete(`${API_URL}/api/movies/${id}`);
      fetchMovies();
    } catch (err) {
      setError("Failed to delete movie.");
      console.error(err);
    }
  };

  const watchedCount = movies.filter((m) => m.watched).length;
  const filteredMovies = movies.filter((m) =>
    filter === "all" ? true : filter === "watched" ? m.watched : !m.watched
  );

  return (
    <div className="app">
      <header className="header">
        <h1>🎬 CineWatch</h1>
        <p className="subtitle">Your personal movie watchlist</p>
      </header>

      <main className="main">
        {/* Error banner */}
        {error && (
          <div className="error-banner" onClick={() => setError(null)}>
            {error}
          </div>
        )}

        {/* Add movie form */}
        <form className="add-form" onSubmit={handleAdd}>
          <input
            type="text"
            className="input"
            placeholder="Movie title (e.g. Inception)..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
          <select
            className="input select"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          >
            <option value="">Genre…</option>
            {GENRES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
          <button type="submit" className="btn btn-add">
            + Add
          </button>
        </form>

        {/* Star rating picker for the new movie */}
        <div className="rating-picker">
          <span className="rating-label">Rating</span>
          <StarRating value={rating} onChange={setRating} />
        </div>

        {/* Loading state */}
        {loading && <p className="status-text">Loading your watchlist…</p>}

        {/* Empty state */}
        {!loading && movies.length === 0 && (
          <p className="status-text">No movies yet. Add your first one above!</p>
        )}

        {!loading && movies.length > 0 && (
          <>
            {/* Toolbar: filters + stats */}
            <div className="toolbar">
              <div className="filters">
                {[
                  { key: "all", label: "All" },
                  { key: "unwatched", label: "To Watch" },
                  { key: "watched", label: "Watched" },
                ].map((f) => (
                  <button
                    key={f.key}
                    className={`filter-btn ${filter === f.key ? "active" : ""}`}
                    onClick={() => setFilter(f.key)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <span className="count">
                {watchedCount}/{movies.length} watched
              </span>
            </div>

            {/* Movie list */}
            {filteredMovies.length === 0 ? (
              <p className="status-text">
                No movies in this view yet. Add one above or switch filters.
              </p>
            ) : (
              <ul className="movie-list">
                {filteredMovies.map((movie) => (
                  <li
                    key={movie._id}
                    className={`movie ${movie.watched ? "watched" : ""}`}
                  >
                    <div className="movie-info">
                      <span
                        className="movie-title"
                        onClick={() => handleToggle(movie._id)}
                        title={
                          movie.watched
                            ? "Click to mark as unwatched"
                            : "Click to mark as watched"
                        }
                      >
                        {movie.title}
                      </span>
                      {movie.genre && (
                        <span className="genre-badge">{movie.genre}</span>
                      )}
                      <StarRating value={movie.rating} readOnly />
                    </div>
                    <div className="movie-actions">
                      <button
                        className="btn btn-toggle"
                        onClick={() => handleToggle(movie._id)}
                        title={
                          movie.watched
                            ? "Mark as unwatched"
                            : "Mark as watched"
                        }
                      >
                        {movie.watched ? "✓ Watched" : "○ Watch"}
                      </button>
                      <button
                        className="btn btn-delete"
                        onClick={() => handleDelete(movie._id)}
                        title="Delete movie"
                      >
                        ✕
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
