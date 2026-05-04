
const express = require("express");
const { collections } = require("../config/db");
const { authMiddleware } = require("../middleware");

const router = express.Router();


// GET /api/dashboard/admin
// Returns overview stats: total students, courses, assignments, quizzes, recent activity
router.get("/admin", async (req, res) => {
    try {
        // Total students (non-admin users)
        const totalStudents = await collections.users().countDocuments({ role: "student" });

        // Total courses
        const totalCourses = await collections.courses().countDocuments({});

        // Total assignments
        const totalAssignments = await collections.assignments().countDocuments({});

        // Total quizzes
        const totalQuizzes = await collections.quiz().countDocuments({});

        // Active quizzes right now
        const now = new Date();
        const activeQuizzes = await collections.quiz().countDocuments({
            startTime: { $lte: now },
            endTime: { $gte: now },
        });

        // Submission count across all quizzes
        const submissionDocs = await collections.submissions().find({}).toArray();
        const totalQuizSubmissions = submissionDocs.reduce(
            (acc, doc) => acc + (doc.submissions?.length || 0), 0
        );

        // Assignment submission count (across all assignments)
        const assignmentDocs = await collections.assignments().find({}).toArray();
        const totalAssignmentSubmissions = assignmentDocs.reduce(
            (acc, doc) => acc + (doc.submissions?.length || 0), 0
        );

        // Unverified payments
        const pendingPayments = await collections.details().countDocuments({
            payment_status: { $ne: "Verified" },
        });

        // Top 5 leaderboard (students only)
        const topStudents = await collections.leaderboard().aggregate([
            { $lookup: { from: "users", localField: "username", foreignField: "username", as: "user_info" } },
            { $unwind: "$user_info" },
            { $match: { "user_info.role": "student" } },
            { $sort: { points: -1 } },
            { $limit: 5 },
            { $project: { user_info: 0 } },
        ]).toArray();

        // Recent 5 quiz submissions (any quiz)
        const recentSubmissions = [];
        for (const doc of submissionDocs) {
            for (const sub of (doc.submissions || [])) {
                recentSubmissions.push({
                    quizId: doc.quizId,
                    studentId: sub.studentId,
                    studentname: sub.studentname,
                    score: sub.score,
                    submittedAt: sub.submitted_at,
                });
            }
        }
        recentSubmissions.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
        const latestSubmissions = recentSubmissions.slice(0, 5);

        res.json({
            overview: {
                totalStudents,
                totalCourses,
                totalAssignments,
                totalQuizzes,
                activeQuizzes,
                totalQuizSubmissions,
                totalAssignmentSubmissions,
                pendingPayments,
            },
            topStudents,
            latestSubmissions,
        });
    } catch (err) {
        console.error("admin-dashboard:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET /api/dashboard/admin/course-stats
// Per-course breakdown: #assignments, #submissions, avg grade
router.get("/admin/course-stats", async (req, res) => {
    try {
        const courses = await collections.courses().find({}).toArray();
        const stats = [];

        for (const course of courses) {
            const assignments = await collections.assignments()
                .find({ coursename: course.name })
                .toArray();

            let totalSubmissions = 0;
            let gradedCount = 0;
            let gradedTotal = 0;

            for (const a of assignments) {
                const subs = a.submissions || [];
                totalSubmissions += subs.length;
                for (const s of subs) {
                    const g = parseFloat(s.grade);
                    if (!isNaN(g)) { gradedCount++; gradedTotal += g; }
                }
            }

            stats.push({
                course: course.name,
                totalAssignments: assignments.length,
                totalSubmissions,
                averageGrade: gradedCount > 0 ? (gradedTotal / gradedCount).toFixed(2) : "N/A",
            });
        }

        res.json(stats);
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// ─────────────────────────────────────────────
// Student dashboard  (protected)
// ─────────────────────────────────────────────

// GET /api/dashboard/student
// Returns the logged-in student's personal stats
router.get("/student", authMiddleware, async (req, res) => {
    try {
        const user = await collections.users().findOne({ email: req.email });
        if (!user) return res.status(404).json({ error: "User not found" });

        const username = user.username;
        const email = req.email;

        // Leaderboard stats + rank
        let leaderboardEntry = await collections.leaderboard().findOne({ username });
        if (!leaderboardEntry) {
            leaderboardEntry = { username, points: 0 };
        }
        const sorted = await collections.leaderboard().find({}).sort({ points: -1 }).toArray();
        const rank = sorted.findIndex(s => s.username === username) + 1;
        const total = sorted.length;

        // Quiz progress
        const allQuizzes = await collections.quiz().find({}).toArray();
        let quizSubmitted = 0;
        let quizMissed = 0;
        let quizTotalScore = 0;

        const quizProgress = [];
        for (const quiz of allQuizzes) {
            const doc = await collections.submissions().findOne({ quizId: quiz.id });
            const sub = doc ? (doc.submissions || []).find(s => s.studentId === email) : null;
            if (sub) {
                quizSubmitted++;
                quizTotalScore += sub.score;
                quizProgress.push({
                    quizId: quiz.id,
                    title: quiz.title,
                    status: "submitted",
                    score: sub.score,
                    total: quiz.questions.length,
                    submittedAt: sub.submitted_at,
                });
            } else {
                quizMissed++;
                quizProgress.push({
                    quizId: quiz.id,
                    title: quiz.title,
                    status: new Date(quiz.endTime) < new Date() ? "missed" : "pending",
                    score: 0,
                    total: quiz.questions.length,
                    submittedAt: null,
                });
            }
        }

        // Assignment submission stats (by student username)
        const allAssignments = await collections.assignments().find({}).toArray();
        let assignmentSubmitted = 0;
        let assignmentPending = 0;
        let gradedAssignments = [];

        for (const a of allAssignments) {
            const sub = (a.submissions || []).find(s => s.student === username);
            if (sub) {
                assignmentSubmitted++;
                if (sub.grade && sub.grade !== "Not Graded") {
                    gradedAssignments.push({
                        course: a.coursename,
                        assignment: a.assignmentname,
                        grade: sub.grade,
                        feedback: sub.feedback,
                    });
                }
            } else {
                assignmentPending++;
            }
        }

        // Active quizzes for this student (not yet submitted)
        const now = new Date();
        const activeQuizzes = await collections.quiz().find({
            startTime: { $lte: now },
            endTime: { $gte: now },
        }).toArray();

        const availableQuizzes = [];
        for (const q of activeQuizzes) {
            const doc = await collections.submissions().findOne({ quizId: q.id });
            const taken = doc ? (doc.submissions || []).some(s => s.studentId === email) : false;
            if (!taken) availableQuizzes.push({ id: q.id, title: q.title, endTime: q.endTime });
        }

        res.json({
            profile: {
                username,
                email,
                points: leaderboardEntry.points,
                rank,
                totalUsers: total,
            },
            quizStats: {
                submitted: quizSubmitted,
                missed: quizMissed,
                totalScore: quizTotalScore,
            },
            assignmentStats: {
                submitted: assignmentSubmitted,
                pending: assignmentPending,
            },
            gradedAssignments,
            quizProgress,
            availableQuizzes,
        });
    } catch (err) {
        console.error("student-dashboard:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;