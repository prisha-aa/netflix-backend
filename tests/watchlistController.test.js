import { getWatchlist, addToWatchlist, removeFromWatchlist } from "../controllers/watchlistController";
import User from "../models/User";

jest.mock("../models/User");

const req = {};
const res = { json: jest.fn(), status: jest.fn(() => res) };

beforeEach(() => {
  jest.clearAllMocks();
});

describe("watchlistController", () => {
  
  describe("getWatchlist", () => {
    it("should return user watchlist", async () => {
      req.user = "userid";
      User.findById.mockResolvedValue({ watchlist: ["movie1", "movie2"] });

      await getWatchlist(req, res);

      expect(User.findById).toHaveBeenCalledWith("userid");
      expect(res.json).toHaveBeenCalledWith({ watchlist: ["movie1", "movie2"] });
    });

    it("should handle errors when fetching watchlist", async () => {
      req.user = "userid";
      User.findById.mockRejectedValue(new Error("DB error"));

      await getWatchlist(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "error fetching watchlist" });
    });
  });

  describe("addToWatchlist", () => {
    it("should add movie to watchlist if not already present", async () => {
      req.user = "userid";
      req.body = { movieId: "movie3" };
      const saveMock = jest.fn();
      User.findById.mockResolvedValue({
        watchlist: ["movie1", "movie2"],
        save: saveMock,
      });

      await addToWatchlist(req, res);

      expect(User.findById).toHaveBeenCalledWith("userid");
      expect(saveMock).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ watchlist: ["movie1", "movie2", "movie3"] });
    });

    it("should not add movie if already present", async () => {
      req.user = "userid";
      req.body = { movieId: "movie1" }; // already in watchlist
      const saveMock = jest.fn();
      User.findById.mockResolvedValue({
        watchlist: ["movie1", "movie2"],
        save: saveMock,
      });

      await addToWatchlist(req, res);

      expect(saveMock).not.toHaveBeenCalled(); // Should not save
      expect(res.json).toHaveBeenCalledWith({ watchlist: ["movie1", "movie2"] });
    });

    it("should handle errors when adding to watchlist", async () => {
      req.user = "userid";
      req.body = { movieId: "movie3" };
      User.findById.mockRejectedValue(new Error("DB error"));

      await addToWatchlist(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "error adding to watchlist" });
    });
  });

  describe("removeFromWatchlist", () => {
    it("should remove movie from watchlist", async () => {
      req.user = "userid";
      req.body = { movieId: "movie2" };
      const saveMock = jest.fn();
      User.findById.mockResolvedValue({
        watchlist: ["movie1", "movie2"],
        save: saveMock,
      });

      await removeFromWatchlist(req, res);

      expect(User.findById).toHaveBeenCalledWith("userid");
      expect(saveMock).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ watchlist: ["movie1"] });
    });

    it("should handle errors when removing from watchlist", async () => {
      req.user = "userid";
      req.body = { movieId: "movie2" };
      User.findById.mockRejectedValue(new Error("DB error"));

      await removeFromWatchlist(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "error removing from watchlist" });
    });
  });

});
