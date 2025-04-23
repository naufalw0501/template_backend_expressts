import app from './app';
require('dotenv').config();
const PORT = process.env.APP_PORT || 3000;
const MODE: "DEVELOPMENT" | "PRODUCTION" = process.env.APP_MODE === "DEVELOPMENT" ? "DEVELOPMENT" : "PRODUCTION";


app.listen(PORT, () => {
  console.log(`Server Running On ${MODE} Mode With Port ${PORT}`);
});
