import express from "express";
import { randomUUID } from "crypto";
import { requireAuth } from "../middleware/auth";
import type { AuthRequest } from "../middleware/auth";
import { getUserById, updateUser } from "../utils/json";

const router = express.Router();

router.get("/auth/playlists", requireAuth, (req: AuthRequest, res) => {
  const user = getUserById(req.user!.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json({ playlists: user.playlists || [] });
});

router.post("/auth/playlists", requireAuth, (req: AuthRequest, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ message: "Playlist name is required" });
  }

  const newPlaylist = {
    id: randomUUID(),
    name: name.trim(),
    songIds: [],
    createdAt: new Date().toISOString(),
  };

  const updated = updateUser(req.user!.userId, (user) => {
    const playlists = user.playlists || [];
    playlists.push(newPlaylist);
    return { ...user, playlists };
  });

  if (!updated) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(201).json(newPlaylist);
});

router.delete("/auth/playlists/:id", requireAuth, (req: AuthRequest, res) => {
  const { id } = req.params;

  const user = getUserById(req.user!.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const playlists = user.playlists || [];
  const index = playlists.findIndex((p: any) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Playlist not found" });
  }

  updateUser(req.user!.userId, (user) => {
    const playlists = user.playlists || [];
    return { ...user, playlists: playlists.filter((p: any) => p.id !== id) };
  });

  res.json({ message: "Playlist deleted" });
});

router.put("/auth/playlists/:id", requireAuth, (req: AuthRequest, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ message: "Playlist name is required" });
  }

  const user = getUserById(req.user!.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const playlists = user.playlists || [];
  const playlist = playlists.find((p: any) => p.id === id);
  if (!playlist) {
    return res.status(404).json({ message: "Playlist not found" });
  }

  const updated = updateUser(req.user!.userId, (user) => {
    const playlists = user.playlists || [];
    return {
      ...user,
      playlists: playlists.map((p: any) =>
        p.id === id ? { ...p, name: name.trim() } : p
      ),
    };
  });

  const updatedPlaylist = updated!.playlists.find((p: any) => p.id === id);
  res.json(updatedPlaylist);
});

router.post("/auth/playlists/:id/songs", requireAuth, (req: AuthRequest, res) => {
  const { id } = req.params;
  const { songId } = req.body;

  if (!songId) {
    return res.status(400).json({ message: "songId is required" });
  }

  const user = getUserById(req.user!.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const playlists = user.playlists || [];
  const playlist = playlists.find((p: any) => p.id === id);
  if (!playlist) {
    return res.status(404).json({ message: "Playlist not found" });
  }

  if (playlist.songIds.includes(songId)) {
    return res.status(400).json({ message: "Song already in playlist" });
  }

  const updated = updateUser(req.user!.userId, (user) => {
    const playlists = user.playlists || [];
    return {
      ...user,
      playlists: playlists.map((p: any) =>
        p.id === id ? { ...p, songIds: [...p.songIds, songId] } : p
      ),
    };
  });

  const updatedPlaylist = updated!.playlists.find((p: any) => p.id === id);
  res.json(updatedPlaylist);
});

router.delete("/auth/playlists/:id/songs/:songId", requireAuth, (req: AuthRequest, res) => {
  const { id, songId } = req.params;

  const user = getUserById(req.user!.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const playlists = user.playlists || [];
  const playlist = playlists.find((p: any) => p.id === id);
  if (!playlist) {
    return res.status(404).json({ message: "Playlist not found" });
  }

  const updated = updateUser(req.user!.userId, (user) => {
    const playlists = user.playlists || [];
    return {
      ...user,
      playlists: playlists.map((p: any) =>
        p.id === id
          ? { ...p, songIds: p.songIds.filter((s: string) => s !== songId) }
          : p
      ),
    };
  });

  const updatedPlaylist = updated!.playlists.find((p: any) => p.id === id);
  res.json(updatedPlaylist);
});

export default router;
