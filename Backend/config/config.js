require("dotenv").config();
const path = require("path");

module.exports = {
    PORT: process.env.PORT || 8000,
    JWT_SECRET: process.env.JWT_SECRET,
    MONGO_URI: process.env.MONGO_URI,
    DB_NAME: process.env.DB_NAME,
    UPLOAD_DIR: process.env.UPLOAD_DIR || path.join(__dirname, "../uploads"),
    EMAIL_FROM: process.env.EMAIL_FROM,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY
};