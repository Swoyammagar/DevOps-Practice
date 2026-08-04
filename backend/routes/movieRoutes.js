const express = require("express");
const router = express.Router();
const {
  getMovies,
  createMovie,
  updateMovie,
  deleteMovie,
} = require("../controllers/movieController");

router.get("/", getMovies);
router.post("/", createMovie);
router.patch("/:id", updateMovie);
router.delete("/:id", deleteMovie);

module.exports = router;
