import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import playlistRoutes from './routes/playlist'

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/playlist', playlistRoutes);

app.get('/health', (_, res) => res.json({ status: 'ok' }))

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`VibeList Backend running on port ${PORT}`);
});

