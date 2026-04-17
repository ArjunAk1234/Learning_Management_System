// routes/auth.js

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const { getDB } = require("../config/db");
const { JWT_SECRET, EMAIL_FROM, EMAIL_PASSWORD } = require("../config/config");

const router = express.Router();

// ================= OTP STORAGE =================
const otpStorage = new Map();

// ================= HELPERS =================
function generateOTP() {
    return String(100000 + Math.floor(Math.random() * 900000));
}

async function sendOTP(email, otp) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: EMAIL_FROM, pass: EMAIL_PASSWORD },
    });

    await transporter.sendMail({
        from: EMAIL_FROM,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP is: ${otp}`,
    });
}

function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
}

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization || "";

    if (!authHeader.startsWith("Bearer "))
        return res.status(401).json({ error: "No token" });

    try {
        const decoded = verifyToken(authHeader.split(" ")[1]);
        req.email = decoded.email;
        next();
    } catch {
        res.status(401).json({ error: "Invalid token" });
    }
}

// ================= ROUTES =================

// REGISTER
router.post("/register", async (req, res) => {
    const db = getDB();
    const userCollection = db.collection("users");
    const leaderboardCollection = db.collection("leaderboard");

    const { username, email, password } = req.body;

    const existing = await userCollection.findOne({ username });
    if (existing) return res.status(409).json({ error: "User exists" });

    const hashed = await bcrypt.hash(password, 10);

    await userCollection.insertOne({
        username,
        email,
        password: hashed,
        role: "student",
        loggedIn: "false"
    });

    await leaderboardCollection.insertOne({ username, points: 0 });

    res.json({ message: "Registered successfully" });
});

// LOGIN
router.post("/login", async (req, res) => {
    const db = getDB();
    const userCollection = db.collection("users");

    const { email, password } = req.body;

    const user = await userCollection.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid email/password" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid email/password" });

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "7d" });

    await userCollection.updateOne({ email }, { $set: { loggedIn: "true" } });

    res.json({ message: "Login successful", token });
});

// LOGOUT
router.post("/logout", async (req, res) => {
    const db = getDB();
    const userCollection = db.collection("users");

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token" });

    try {
        const decoded = verifyToken(token);

        await userCollection.updateOne(
            { email: decoded.email },
            { $set: { loggedIn: "false" } }
        );

        res.json({ message: "Logged out" });
    } catch {
        res.status(401).json({ error: "Invalid token" });
    }
});

// STATUS (Protected)
router.get("/status", authMiddleware, async (req, res) => {
    const db = getDB();
    const userCollection = db.collection("users");

    const user = await userCollection.findOne({ email: req.email });

    res.json({ loggedIn: user?.loggedIn || false });
});

// USERNAME FROM TOKEN
router.get("/username", async (req, res) => {
    const db = getDB();
    const userCollection = db.collection("users");

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token" });

    try {
        const decoded = verifyToken(token);
        const user = await userCollection.findOne({ email: decoded.email });

        res.json({ username: user.username });
    } catch {
        res.status(401).json({ error: "Invalid token" });
    }
});

// ================= OTP =================

// REQUEST OTP
router.post("/request-otp", async (req, res) => {
    const { email } = req.body;

    const otp = generateOTP();
    otpStorage.set(email, otp);

    try {
        await sendOTP(email, otp);
        res.json({ message: "OTP sent" });
    } catch {
        res.status(500).json({ error: "Failed to send OTP" });
    }
});

// VERIFY OTP
router.post("/verify-otp", (req, res) => {
    const { email, otp } = req.body;

    if (otpStorage.get(email) !== otp)
        return res.status(401).json({ error: "Invalid OTP" });

    otpStorage.delete(email);
    res.json({ message: "OTP verified" });
});

// FORGOT PASSWORD
router.post("/forgotpassword", async (req, res) => {
    const db = getDB();
    const userCollection = db.collection("users");

    const { email, newPassword } = req.body;

    const hashed = await bcrypt.hash(newPassword, 10);

    await userCollection.updateOne(
        { email },
        { $set: { password: hashed } }
    );

    res.json({ message: "Password reset successful" });
});

module.exports = router;