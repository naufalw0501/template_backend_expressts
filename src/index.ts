import app from './app';
import cors from "cors";
require('dotenv').config();
const PORT = process.env.APP_PORT || 3000;
const MODE: "DEVELOPMENT" | "PRODUCTION" = process.env.APP_MODE === "DEVELOPMENT" ? "DEVELOPMENT" : "PRODUCTION";

app.use(cors({
  origin: "http://localhost:4000", // sesuaikan dengan frontend kamu
  credentials: true                // ini penting kalau pakai cookie atau ingin kirim credentials
}));

app.listen(PORT, () => {
  console.log(`Server Running On ${MODE} Mode With Port ${PORT}`);
});
