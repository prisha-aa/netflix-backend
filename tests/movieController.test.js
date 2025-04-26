import { getMoviesByCategory, getMovieDetails, searchMovies } from "../controllers/movieController";
import axios from "axios";

jest.mock("axios");

const req = {};
const res = { json: jest.fn(), status: jest.fn(() => res) };

beforeEach(() => {
  jest.clearAllMocks();
});

describe("movieController", () => {
  describe("getMoviesByCategory", () => {
    it("should return movies by category", async () => {
      req.params = { category: "popular" };
      req.query = { page: 1 };
      axios.get.mockResolvedValue({ data: { results: ["movie1", "movie2"] } });

      await getMoviesByCategory(req, res);

      expect(res.json).toHaveBeenCalledWith({ results: ["movie1", "movie2"] });
    });

    it("should return 400 if invalid category", async () => {
      req.params = { category: "invalid" };
      req.query = {};

      await getMoviesByCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid category" });
    });

    it("should handle errors while fetching movies", async () => {
      req.params = { category: "popular" };
      req.query = {};
      axios.get.mockRejectedValue(new Error("TMDB error"));

      await getMoviesByCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Failed to fetch movies" });
    });
  });

  describe("getMovieDetails", () => {
    it("should return movie details", async () => {
      req.params = { movieId: "123" };
      axios.get.mockResolvedValue({ data: { title: "Movie Title" } });

      await getMovieDetails(req, res);

      expect(res.json).toHaveBeenCalledWith({ title: "Movie Title" });
    });

    it("should handle errors while fetching movie details", async () => {
      req.params = { movieId: "123" };
      axios.get.mockRejectedValue(new Error("Error"));

      await getMovieDetails(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Failed to fetch movie details" });
    });
  });

  describe("searchMovies", () => {
    it("should return searched movies", async () => {
      req.query = { query: "Batman", page: 1 };
      axios.get.mockResolvedValue({ data: { results: ["Batman Begins"] } });

      await searchMovies(req, res);

      expect(res.json).toHaveBeenCalledWith({ results: ["Batman Begins"] });
    });

    it("should handle errors while searching movies", async () => {
      req.query = { query: "Batman", page: 1 };
      axios.get.mockRejectedValue(new Error("Error"));

      await searchMovies(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Failed to search movies" });
    });
  });
});
