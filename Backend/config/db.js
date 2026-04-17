const { MongoClient } = require("mongodb");
const { MONGO_URI, DB_NAME } = require("./config");

let db;

async function connectDB() {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    db = client.db(DB_NAME);
    console.log("MongoDB Connected");
}

function getDB() {
    return db;
}

module.exports = { connectDB, getDB };