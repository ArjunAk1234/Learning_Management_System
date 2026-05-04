

const express = require("express");
const { collections } = require("../config/db");
const { authMiddleware } = require("../middleware");

const router = express.Router();

// POST /api/leaderboard/admin/addpoint/:username
router.post("/admin/addpoint/:username", async (req, res) => {
    try {
        await collections.leaderboard().updateOne(
            { username: req.params.username },
            { $inc: { points: 10 } }
        );
        res.json({ message: "10 points added" });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// POST /api/leaderboard/admin/removepoint/:username
router.post("/admin/removepoint/:username", async (req, res) => {
    try {
        await collections.leaderboard().updateOne(
            { username: req.params.username },
            { $inc: { points: -10 } }
        );
        res.json({ message: "10 points deducted" });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET /api/leaderboard/admin/all  (includes admins)
router.get("/admin/all", async (req, res) => {
    try {
        const leaderboard = await collections.leaderboard()
            .find({})
            .sort({ points: -1 })
            .toArray();
        res.json(leaderboard);
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET /api/leaderboard/admin/search/:username
router.get("/admin/search/:username", async (req, res) => {
    try {
        const student = await collections.leaderboard().findOne({ username: req.params.username });
        if (!student) return res.status(404).json({ error: "Student not found in leaderboard" });
        res.json(student);
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET /api/leaderboard/  (students only — excludes admins)
router.get("/", async (req, res) => {
    try {
        const pipeline = [
            { $lookup: { from: "users", localField: "username", foreignField: "username", as: "user_info" } },
            { $unwind: "$user_info" },
            { $match: { "user_info.role": { $ne: "admin" } } },
            { $sort: { points: -1 } },
            { $project: { user_info: 0 } },
        ];
        const leaderboard = await collections.leaderboard().aggregate(pipeline).toArray();
        res.json(leaderboard);
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET /api/leaderboard/me  (protected — returns own rank + stats)
router.get("/me", authMiddleware, async (req, res) => {
    try {
        const user = await collections.users().findOne({ email: req.email });
        if (!user) return res.status(401).json({ error: "User not found" });

        const username = user.username;
        let userStats = await collections.leaderboard().findOne({ username });

        if (!userStats) {
            userStats = { username, email: req.email, points: 0 };
            await collections.leaderboard().insertOne(userStats);
        }

        const totalUsers = await collections.leaderboard().countDocuments({});
        const sorted = await collections.leaderboard().find({}).sort({ points: -1 }).toArray();
        const rank = sorted.findIndex(s => s.username === username) + 1;

        res.json({ stats: userStats, rank, totalUsers });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET /api/leaderboard/quiz/:quizid  (quiz-specific leaderboard)
router.get("/quiz/:quizid", async (req, res) => {
    try {
        const doc = await collections.submissions().findOne({ quizId: req.params.quizid });
        if (!doc) return res.status(404).json({ error: "No submissions found for this quiz" });

        const sorted = [...(doc.submissions || [])].sort((a, b) => b.score - a.score);

        const leaderboard = await Promise.all(sorted.map(async (sub, idx) => {
            const user = await collections.users().findOne({ email: sub.studentId });
            return {
                rank: idx + 1,
                username: user ? user.username : sub.studentId,
                email: sub.studentId,
                score: sub.score,
                submittedAt: sub.submitted_at,
            };
        }));

        res.json(leaderboard);
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;