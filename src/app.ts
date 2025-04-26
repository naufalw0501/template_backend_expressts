import express from 'express';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import cors from "cors";
import { format } from "date-fns";

const app = express();

// ✅ CORS setup
app.use(cors({
    origin: "http://localhost:4000",
    credentials: true
}));

// ✅ JSON parser
app.use(express.json());

app.use((req, res, next) => {
    console.log("==================")
    console.log(format(new Date(), "yyyy-MM-dd HH:mm:ss"));
    console.log("➡️  Incoming Request:");
    console.log("URL:", req.method, req.originalUrl);
    // console.log("Body:", req.body);

    // Tangkap original method res.send
    const originalSend = res.send.bind(res);

    res.send = (body) => {
        console.log("⬅️  Response:");
        console.log("Status:", res.statusCode);
        // console.log("Body:", body);
        console.log("==================")
        return originalSend(body);
    };

    next();
});

// ✅ Route
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

export default app;
