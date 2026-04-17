require("dotenv").config();

module.exports = {
    PORT: process.env.PORT || 8000,
    JWT_SECRET: process.env.JWT_SECRET,
    MONGO_URI: process.env.MONGO_URI,
    DB_NAME: process.env.DB_NAME,
};