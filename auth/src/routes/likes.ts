import express from "express";
import { requireAuth } from "../middleware/auth";
import type { AuthRequest } from "../middleware/auth";
import { getUserById, updateUser } from "../utils/json";

const router = express.Router();

router.get("/auth/likes", requireAuth, (req: AuthRequest, res) => {
  const user = getUserById(req.user!.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json({ likedSongs: user.likedSongs || [] });
});

router.post("/auth/likes/toggle", requireAuth, (req: AuthRequest, res) => {
  const { songId } = req.body;
  if (!songId) {
    return res.status(400).json({ message: "songId is required" });
  }

  const updated = updateUser(req.user!.userId, (user) => {
    const likedSongs: string[] = user.likedSongs || [];
    const index = likedSongs.indexOf(songId);
    if (index === -1) {
      likedSongs.push(songId);
    } else {
      likedSongs.splice(index, 1);
    }
    return { ...user, likedSongs };
  });

  if (!updated) {
    return res.status(404).json({ message: "User not found" });
  }

  const liked = updated.likedSongs.includes(songId);
  res.json({ liked, likedSongs: updated.likedSongs });
});

export default router;
