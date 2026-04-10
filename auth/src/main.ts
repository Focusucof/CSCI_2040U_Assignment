import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import registerRoutes from "./routes/register";
import loginRoutes from "./routes/login";
import meRoutes from "./routes/me";
import likesRoutes from "./routes/likes";
import playlistsRoutes from "./routes/playlists";
import logoutRoutes from "./routes/logout";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use(registerRoutes);
app.use(loginRoutes);
app.use(meRoutes);
app.use(likesRoutes);
app.use(playlistsRoutes);
app.use(logoutRoutes);

app.get("/ping", (req, res) => {
    res.send("Pong!");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

