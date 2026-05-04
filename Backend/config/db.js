const { MongoClient } = require("mongodb");
const { MONGO_URI, DB_NAME } = require("./config");

let db;

async function connectDB() {
    const client = new MongoClient(MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
    });
    await client.connect();
    db = client.db(DB_NAME);
    console.log(`✅ MongoDB connected → ${DB_NAME}`);
}

function getDB() {
    if (!db) throw new Error("Database not initialised. Call connectDB() first.");
    return db;
}

const collections = {
    users: () => getDB().collection("users"),
    details: () => getDB().collection("details"),
    courses: () => getDB().collection("courses"),
    assignments: () => getDB().collection("assignments"),
    leaderboard: () => getDB().collection("leaderboard"),
    quiz: () => getDB().collection("quiz"),
    submissions: () => getDB().collection("submissions"),
    chats: () => getDB().collection("chats"),
    vectors: () => getDB().collection("vectors"),
};

module.exports = { connectDB, getDB, collections };