
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const { connectDB } = require("./config/db");
const { PORT, UPLOAD_DIR } = require("./config/config");

// Route modules
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const courseRoutes = require("./routes/courses");
const assignmentRoutes = require("./routes/assignments");
const leaderboardRoutes = require("./routes/leaderboard");
const quizRoutes = require("./routes/quiz");
const dashboardRoutes = require("./routes/dashboard");

// ─────────────────────────────────────────────
// App setup
// ─────────────────────────────────────────────
const app = express();

app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Origin", "Content-Type", "Authorization"],
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files as static assets
fs.mkdirSync(UPLOAD_DIR, { recursive: true });
app.use("/uploads", express.static(UPLOAD_DIR));

// ─────────────────────────────────────────────
// Routes
// ─────────────────────────────────────────────
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/courses", courseRoutes);
app.use("/assignments", assignmentRoutes);
app.use("/leaderboard", leaderboardRoutes);
app.use("/quiz", quizRoutes);
app.use("/dashboard", dashboardRoutes);
// app.use("/", authRoutes);
// app.use("/", userRoutes);
// app.use("/", courseRoutes);
// app.use("/", assignmentRoutes);
// app.use("/", leaderboardRoutes);
// app.use("/", quizRoutes);
// app.use("/", dashboardRoutes);
// Health check
app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.post("/request-otp1", (req, res) => {
    console.log("HIT request-otp1");
    res.json({ message: "Direct route working" });
});
// 404 fallback
app.use((_req, res) => res.status(404).json({ error: "Route not found" }));

// Global error handler
app.use((err, _req, res, _next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error" });
});

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);

        });

    })
    .catch(err => {
        console.error("Failed to connect to MongoDB:", err.message);
        process.exit(1);
    });