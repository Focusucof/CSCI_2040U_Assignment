import express from 'express';

import registerRoutes from "./routes/register";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(registerRoutes);

app.get("/ping", (req, res) => {
    res.send("Pong!");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

