import express from 'express';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import cors from "cors";

const app = express();
app.use(cors({
    origin: "http://localhost:4000",
    credentials: true
}));
app.use(express.json());

// Prefix semua route users
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

export default app;
