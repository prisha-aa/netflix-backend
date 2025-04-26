import { getHistory, addToHistory } from "../controllers/historyController";
import User from "../models/User";

jest.mock("../models/User");

const req = {};
const res = { json: jest.fn(), status: jest.fn(() => res) };

beforeEach(() => {
  jest.clearAllMocks();
});

describe("historyController", () => {
  describe("getHistory", () => {
    it("should return user history", async () => {
      req.user = "userid";
      User.findById.mockResolvedValue({ history: ["movie1", "movie2"] });

      await getHistory(req, res);

      expect(User.findById).toHaveBeenCalledWith("userid");
      expect(res.json).toHaveBeenCalledWith({ history: ["movie1", "movie2"] });
    });

    it("should handle errors when fetching history", async () => {
      req.user = "userid";
      User.findById.mockRejectedValue(new Error("DB error"));

      await getHistory(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "error fetching histroy" });
    });
  });

  describe("addToHistory", () => {
    it("should add movie to user history", async () => {
      req.user = "userid";
      req.body = { movieId: "movie3" };
      const saveMock = jest.fn();
      User.findById.mockResolvedValue({
        history: ["movie1", "movie2"],
        save: saveMock,
      });

      await addToHistory(req, res);

      expect(User.findById).toHaveBeenCalledWith("userid");
      expect(saveMock).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ history: ["movie1", "movie2", "movie3"] });
    });

    it("should handle errors when adding to history", async () => {
      req.user = "userid";
      req.body = { movieId: "movie3" };
      User.findById.mockRejectedValue(new Error("DB error"));

      await addToHistory(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "error dding to history" });
    });
  });
});
