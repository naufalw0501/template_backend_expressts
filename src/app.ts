import express from 'express';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import fileRoutes from './routes/fileRoutes';
import cors from "cors";
import { format } from "date-fns";
import allowed_origins from './config/allowedOrigins';
const MODE: "DEVELOPMENT" | "PRODUCTION" = process.env.APP_MODE === "DEVELOPMENT" ? "DEVELOPMENT" : "PRODUCTION";
import fs from 'fs';
import path from 'path';

const app = express();

// ✅ CORS setup 
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowed_origins.includes(origin)) {
            callback(null, true); // izinkan
        } else {
            callback(new Error('Not allowed by CORS')); // tolak
        }
    },
    credentials: true
}));

// ✅ JSON parser
app.use((req, res, next) => {
    if (req.headers['content-type']?.includes('multipart/form-data')) {
        next(); // Let Multer Handle 
    } else {
        express.json({ limit: '10mb' })(req, res, next);
    }
});
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ✅ Logging
function logToFile(content: string) {
    const date = format(new Date(), "yyyy_MM_dd");
    const logDir = path.join(__dirname, "../logs");
    const logPath = path.join(logDir, `${date}.txt`); 
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir);
    }
    fs.appendFileSync(logPath, content + '\n');
}

app.use((req, res, next) => {
    const time = format(new Date(), "yyyy-MM-dd HH:mm:ss");
    let logs = `==================\n${time}\n➡️  Incoming Request:\nURL: ${req.method} ${req.originalUrl}`;

    if (MODE === "DEVELOPMENT") {
        console.log(logs);
    } else {
        logToFile(logs);
    }

    const originalSend = res.send.bind(res);
    res.send = (body) => {
        const responseLog = `⬅️  Response:\nStatus: ${res.statusCode}\n==================`;

        if (MODE === "DEVELOPMENT") {
            console.log(responseLog);
        } else {
            logToFile(responseLog);
        }

        return originalSend(body);
    };

    next();
});


// ✅ Route
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/files', fileRoutes);

export default app;
