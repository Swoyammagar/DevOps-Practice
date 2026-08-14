const Movie = require("../models/Movie");

// GET /api/movies
const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createMovie = async (req, res) => {
  try {
    const { title, genre, rating } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Movie title is required" });
    }

    const parsedRating = Math.min(5, Math.max(1, Number(rating) || 3));

    const movie = await Movie.create({
      title: title.trim(),
      genre: (genre || "").trim(),
      rating: parsedRating,
    });
    res.status(201).json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/movies/:id (toggle watched)
const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    movie.watched = !movie.watched;
    await movie.save();

    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/movies/:id
const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.status(200).json({ message: "Movie deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMovies,
  createMovie,
  updateMovie,
  deleteMovie,
};
