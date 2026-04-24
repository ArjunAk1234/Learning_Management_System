
const express = require("express");
const { collections } = require("../config/db");

const router = express.Router();

// POST /api/quiz/admin/create
router.post("/admin/create", async (req, res) => {
    try {
        const { title, questions, startTime, endTime } = req.body;
        if (!title) return res.status(400).json({ error: "title is required" });

        const start = new Date(startTime);
        const end = new Date(endTime);
        if (isNaN(start) || isNaN(end))
            return res.status(400).json({ error: "Invalid startTime or endTime" });

        await collections.quiz().insertOne({
            id: title,
            title,
            questions: questions || [],
            startTime: start,
            endTime: end,
        });

        res.json({ message: "Quiz created successfully" });
    } catch (err) {
        console.error("create-quiz:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// POST /api/quiz/admin/publish/:quizId  — activate a quiz for all students
router.post("/admin/publish/:quizId", async (req, res) => {
    try {
        const { quizId } = req.params;
        const { durationHours = 24 } = req.body;

        const now = new Date();
        const end = new Date(now.getTime() + durationHours * 60 * 60 * 1000);

        const result = await collections.quiz().updateOne(
            { id: quizId },
            { $set: { startTime: now, endTime: end, publishedAt: now } }
        );

        if (result.matchedCount === 0)
            return res.status(404).json({ error: "Quiz not found" });

        res.json({
            message: `Quiz published! Active from now until ${end.toLocaleString()}`,
            quizId,
            startTime: now,
            endTime: end
        });
    } catch (err) {
        console.error("publish-quiz:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET /api/quiz/admin/all
router.get("/admin/all", async (req, res) => {
    try {
        const quizzes = await collections.quiz().find({}).toArray();
        res.json(quizzes);
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET /api/quiz/admin/submissions  (all quiz submissions)
router.get("/admin/submissions", async (req, res) => {
    try {
        const docs = await collections.submissions().find({}).toArray();
        res.json(docs);
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET /api/quiz/admin/submissions/:quizid
router.get("/admin/submissions/:quizid", async (req, res) => {
    try {
        const doc = await collections.submissions().findOne({ quizId: req.params.quizid });
        if (!doc) return res.status(404).json({ error: "No submissions for this quiz" });
        res.json({ quizId: doc.quizId, submissions: doc.submissions || [] });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET /api/quiz/admin/progress/:email  (all quizzes progress for one student)
router.get("/admin/progress/:email", async (req, res) => {
    try {
        const email = req.params.email;
        const quizzes = await collections.quiz().find({}).toArray();
        const progress = [];

        for (const quiz of quizzes) {
            const doc = await collections.submissions().findOne({ quizId: quiz.id });
            if (!doc) {
                progress.push({ quizId: quiz.id, title: quiz.title, status: "missed", score: 0, submittedAt: null });
                continue;
            }
            const sub = (doc.submissions || []).find(s => s.studentId === email);
            if (sub) {
                progress.push({ quizId: quiz.id, title: quiz.title, status: "submitted", score: sub.score, submittedAt: sub.submitted_at });
            } else {
                progress.push({ quizId: quiz.id, title: quiz.title, status: "missed", score: 0, submittedAt: null });
            }
        }

        res.json(progress);
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});


// GET /api/quiz/active
router.get("/active", async (req, res) => {
    try {
        const now = new Date();
        const quizzes = await collections.quiz().find({
            startTime: { $lte: now },
            endTime: { $gte: now },
        }).toArray();
        res.json(quizzes);
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET /api/quiz/check/:quizId/:studentEmail
router.get("/check/:quizId/:studentEmail", async (req, res) => {
    try {
        const doc = await collections.submissions().findOne({ quizId: req.params.quizId });
        if (!doc) return res.json({ submitted: false });
        const found = (doc.submissions || []).some(s => s.studentId === req.params.studentEmail);
        res.json({ submitted: found });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// POST /api/quiz/submit
router.post("/submit", async (req, res) => {
    try {
        const { quizId, studentId, answers } = req.body;
        if (!quizId || !studentId || !answers)
            return res.status(400).json({ error: "quizId, studentId and answers are required" });

        const user = await collections.users().findOne({ email: studentId });
        if (!user) return res.status(404).json({ error: "Student not found" });
        if (user.role === "admin") return res.status(403).json({ error: "Admins cannot submit quizzes" });

        const quiz = await collections.quiz().findOne({ id: quizId });
        if (!quiz) return res.status(404).json({ error: "Quiz not found" });

        // Check for duplicate submission
        const existingDoc = await collections.submissions().findOne({ quizId });
        if (existingDoc) {
            const alreadySubmitted = (existingDoc.submissions || []).some(s => s.studentId === studentId);
            if (alreadySubmitted)
                return res.status(400).json({ error: "You have already submitted this quiz" });
        }

        // Auto-grade
        let score = 0;
        for (let idx = 0; idx < quiz.questions.length; idx++) {
            const q = quiz.questions[idx];
            const selectedIdx = answers[`q${idx}`];
            if (selectedIdx >= 0 && selectedIdx < q.options.length) {
                if (q.options[selectedIdx] === q.answer) score++;
            }
        }

        const submission = {
            quizId, studentId,
            studentname: user.username,
            answers,
            score,
            submitted_at: new Date(),
        };

        await collections.submissions().updateOne(
            { quizId },
            { $push: { submissions: submission } },
            { upsert: true }
        );

        res.json({ message: "Quiz submitted successfully", score });
    } catch (err) {
        console.error("submit-quiz:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET /api/quiz/results/:email/:quizId
router.get("/results/:email/:quizId", async (req, res) => {
    try {
        const { email, quizId } = req.params;

        const doc = await collections.submissions().findOne({ quizId });
        if (!doc) return res.status(404).json({ error: "No submissions found for this quiz" });

        const sub = (doc.submissions || []).find(s => s.studentId === email);
        if (!sub) return res.json({ message: "No submission found", submitted: false });

        const quiz = await collections.quiz().findOne({ id: quizId });
        if (!quiz) return res.status(500).json({ error: "Quiz data not found" });

        const questionsWithAnswers = quiz.questions.map((q, idx) => {
            const userAnswerIdx = sub.answers[`q${idx}`];
            const selectedOption = (userAnswerIdx >= 0 && userAnswerIdx < q.options.length)
                ? q.options[userAnswerIdx] : "";
            return {
                question: q.question,
                userAnswer: selectedOption,
                correctAnswer: q.answer,
                isCorrect: selectedOption === q.answer,
            };
        });

        res.json({
            quizId,
            score: sub.score,
            submittedtime: sub.submitted_at,
            answers: questionsWithAnswers,
            submitted: true,
        });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;