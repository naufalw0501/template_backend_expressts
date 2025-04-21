import express from 'express';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';

const app = express();
app.use(express.json());

// Prefix semua route users
app.use('/users', userRoutes);
app.use('/auth', authRoutes);

export default app;
