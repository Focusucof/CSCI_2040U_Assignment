import express from 'express';
import cors from 'cors';

import registerRoutes from "./routes/register";
import loginRoutes from "./routes/login";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json());

app.use(registerRoutes);
app.use(loginRoutes);

app.get("/ping", (req, res) => {
    res.send("Pong!");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

