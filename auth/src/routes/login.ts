import express from "express";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import jwt from "jsonwebtoken";

import { userExists, getUserByUsername } from "../utils/json";

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "test_secret_key";

router.post("/auth/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if the user exists
        if (!userExists(username)) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        const user = getUserByUsername(username);
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: "1h" });
        res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });
        res.status(200).json({ message: "Login successful" });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;