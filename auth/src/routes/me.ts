import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "test_secret_key";

router.get("/auth/me", (req, res) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; username: string; isAdmin: boolean };
        res.status(200).json({
            userId: decoded.userId,
            username: decoded.username,
            isAdmin: decoded.isAdmin || false,
        });
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
});

export default router;
