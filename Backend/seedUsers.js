const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");
require("dotenv").config();

async function run() {
    const client = new MongoClient(process.env.MONGO_URI);
    try {
        await client.connect();
        const db = client.db(process.env.DB_NAME);
        const pwd = await bcrypt.hash("password123", 14);
        
        // Admin
        await db.collection("users").updateOne(
            { email: "teacher@test.com" }, 
            { $set: { username: "teacher", email: "teacher@test.com", password: pwd, role: "admin", loggedIn: "false" } }, 
            { upsert: true }
        );

        // Student
        await db.collection("users").updateOne(
            { email: "student@test.com" }, 
            { $set: { username: "student", email: "student@test.com", password: pwd, role: "student", loggedIn: "false" } }, 
            { upsert: true }
        );
        
        console.log("Successfully seeded teacher@test.com and student@test.com (password: password123)");
        process.exit(0);
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
}
run();
