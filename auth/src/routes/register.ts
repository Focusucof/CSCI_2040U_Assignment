import express from "express";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";

import { userExists, writeUser } from "../utils/json";

const router = express.Router();

router.post("/auth/register", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if the user already exists
        if (userExists(username)) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userID = randomUUID();

        const newUser = {
            id: userID,
            username: username,
            password: hashedPassword,
            likedSongs: [] as string[],
            playlists: [] as string[],
            isAdmin: false
        };

        // write user to file
        writeUser(newUser);

        res.status(201).json({ message: "User registered successfully" });



    } catch (error) {
        console.log(req.body);
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;