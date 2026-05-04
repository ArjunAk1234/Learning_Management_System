
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const { collections } = require("../config/db");
const { JWT_SECRET, EMAIL_FROM, EMAIL_PASSWORD } = require("../config/config");
const { verifyToken, authMiddleware } = require("../middleware");

const router = express.Router();

const otpStorage = new Map();


function generateOTP() {
    return String(100000 + Math.floor(Math.random() * 900000));
}

async function sendOTP(email, otp) {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: { user: EMAIL_FROM, pass: EMAIL_PASSWORD },
    });
    await transporter.sendMail({
        from: EMAIL_FROM,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP is: ${otp}`,
    });
}



// POST /api/auth/register
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password)
            return res.status(400).json({ error: "username, email and password are required" });

        const existing = await collections.users().findOne({ username });
        if (existing) return res.status(409).json({ error: "Username already exists" });

        const hashedPassword = await bcrypt.hash(password, 14);
        await collections.users().insertOne({
            username, email,
            password: hashedPassword,
            role: "student",
            loggedIn: "false",
        });
        await collections.leaderboard().insertOne({ username, points: 0 });

        res.json({ success: true, message: "User registered successfully!" });
    } catch (err) {
        console.error("register:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ error: "email and password are required" });

        const user = await collections.users().findOne({ email });
        if (!user) return res.status(401).json({ error: "Invalid email or password" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: "Invalid email or password" });

        const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: "7d" });
        await collections.users().updateOne({ email }, { $set: { loggedIn: "true" } });

        res.json({ message: "Login successful!", token });
    } catch (err) {
        console.error("login:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// POST /api/auth/logout
router.post("/logout", async (req, res) => {
    try {
        const token = req.headers["authorization"]?.split(" ")[1];
        if (!token) return res.status(401).json({ error: "Authorization token required" });

        const claims = verifyToken(token);
        await collections.users().updateOne({ email: claims.email }, { $set: { loggedIn: "false" } });
        res.json({ message: "Logged out successfully!" });
    } catch {
        res.status(401).json({ error: "Invalid or expired token" });
    }
});

// GET /api/auth/status  (protected)
router.get("/status", authMiddleware, async (req, res) => {
    try {
        const user = await collections.users().findOne({ email: req.email });
        if (!user) return res.status(401).json({ loggedIn: false, error: "User not found" });
        res.json({ loggedIn: user.loggedIn, email: req.email });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// POST /api/auth/check-role
router.post("/check-role", async (req, res) => {
    try {
        const { email } = req.body;
        const user = await collections.users().findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json({ isAdmin: user.role === "admin" });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET /api/auth/username  (from JWT)
router.get("/username", async (req, res) => {
    try {
        const token = req.headers["authorization"]?.split(" ")[1];
        if (!token) return res.status(401).json({ error: "Missing token" });

        const claims = verifyToken(token);
        const user = await collections.users().findOne({ email: claims.email });
        if (!user) return res.status(404).json({ error: "User not found" });

        res.json({ loggedIn: user.username, email: claims.email });
    } catch {
        res.status(401).json({ error: "Invalid token" });
    }
});

// GET /api/auth/username/email/:email
router.get("/username/email/:email", async (req, res) => {
    try {
        const user = await collections.users().findOne({ email: req.params.email });
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json({ username: user.username });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// ─────────────────────────────────────────────
// OTP routes
// ─────────────────────────────────────────────

// POST /api/auth/request-otp
router.post("/request-otp1", async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: "email is required" });

        const otp = generateOTP();
        otpStorage.set(email, otp);
        await sendOTP(email, otp);
        res.json({ message: "OTP sent successfully!" });
    } catch (err) {
        console.error("request-otp:", err);
        res.status(500).json({ error: "Failed to send OTP" });
    }
});

// POST /api/auth/verify-otp
router.post("/verify-otp1", (req, res) => {
    const { email, otp } = req.body;
    if (otpStorage.get(email) !== otp)
        return res.status(401).json({ error: "Invalid OTP" });
    otpStorage.delete(email);
    res.json({ message: "OTP verified successfully!" });
});

// POST /api/auth/forgotpassword
router.post("/forgotpassword", async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const user = await collections.users().findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found" });

        const hashed = await bcrypt.hash(newPassword, 14);
        await collections.users().updateOne({ email }, { $set: { password: hashed } });
        res.json({ message: "Password reset successful" });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;