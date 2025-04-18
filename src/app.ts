import express from 'express';
import userRoutes from './routes/userRoutes';

const app = express();
app.use(express.json());

// Prefix semua route users
app.use('/users', userRoutes);

export default app;
