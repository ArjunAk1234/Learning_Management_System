
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
const aiRoutes = require("./routes/ai");

// ─────────────────────────────────────────────
// App setup
// ─────────────────────────────────────────────
const app = express();

const serverLogs = [];
global.addLog = (msg) => {
    const log = `[${new Date().toLocaleTimeString()}] ${msg}`;
    console.log(log);
    serverLogs.push(log);
    if (serverLogs.length > 50) serverLogs.shift();
};

app.use((req, res, next) => {
    global.addLog(`${req.method} ${req.url} (Type: ${req.get('Content-Type') || 'None'})`);
    next();
});

app.get("/api/server-logs", (req, res) => res.json(serverLogs));

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Origin", "Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files as static assets
fs.mkdirSync(UPLOAD_DIR, { recursive: true });
app.use("/uploads", express.static(UPLOAD_DIR));

// ─────────────────────────────────────────────
// Routes
// ─────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/ai", aiRoutes);
// app.use("/", authRoutes);
// app.use("/", userRoutes);
// app.use("/", courseRoutes);
// app.use("/", assignmentRoutes);
// app.use("/", leaderboardRoutes);
// app.use("/", quizRoutes);
// app.use("/", dashboardRoutes);
// Health check
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.post("/request-otp1", (req, res) => {
    console.log("HIT request-otp1");
    res.json({ message: "Direct route working" });
});
// HTML Test Portals
app.get("/test-ai", (req, res) => {
    res.sendFile(path.join(__dirname, "../test-ai.html"));
});
app.get("/test-upload", (req, res) => {
    res.sendFile(path.join(__dirname, "../test-upload.html"));
});

app.use((_req, res) => res.status(404).json({ error: "Route not found" }));

// Global error handler
app.use((err, _req, res, _next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error" });
});

connectDB()
    .then(() => {
        app.listen(PORT, async () => {
            console.log(`\n🚀 Backend Server: http://localhost:${PORT}`);
            
            // Explicit ChromaDB Startup Verification
            try {
                const response = await fetch("http://127.0.0.1:8000/api/v2/heartbeat");
                if (response.ok) {
                    const hb = await response.json();
                    console.log(`✅ ChromaDB: CONNECTED (Heartbeat: ${hb['nanosecond heartbeat']})`);
                    if (global.addLog) global.addLog("SYSTEM: ChromaDB Connection Verified via v2 Heartbeat.");
                } else {
                    console.warn("⚠️ ChromaDB: Server responded with status:", response.status);
                }
            } catch (err) {
                console.error("❌ ChromaDB: NOT FOUND on port 8000. Start it with the PROTOCOL_BUFFERS fix.");
                if (global.addLog) global.addLog("SYSTEM ERROR: ChromaDB unreachable.");
            }
        });

    })
    .catch(err => {
        console.error("Failed to connect to MongoDB:", err.message);
        process.exit(1);
    });