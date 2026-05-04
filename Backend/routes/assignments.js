

const express = require("express");
const fs = require("fs");
const path = require("path");

const { collections } = require("../config/db");
const { UPLOAD_DIR, ALLOWED_EXTS } = require("../config/config");
const { upload } = require("../middleware");

const router = express.Router();


function assignmentDir(courseName, assignmentName) {
    return path.join(UPLOAD_DIR, "courses", courseName, "assignments", assignmentName);
}

function studentSubmissionDir(student, course, assignment) {
    return path.join(UPLOAD_DIR, "students", student, course, "assignments", assignment);
}


// POST /api/assignments/admin/:course/create  (optional PDF)
router.post("/admin/:course/create", upload.single("pdf"), async (req, res) => {
    try {
        const courseName = req.params.course;
        const { name, description, due_date } = req.body;

        if (!name || !description || !due_date)
            return res.status(400).json({ error: "name, description and due_date are required" });

        const course = await collections.courses().findOne({ name: courseName });
        if (!course) return res.status(404).json({ error: "Course not found" });

        const dir = assignmentDir(courseName, name);
        fs.mkdirSync(dir, { recursive: true });

        let pdfPath = "";
        if (req.file) {
            pdfPath = path.join(dir, "assignment.pdf");
            fs.writeFileSync(pdfPath, req.file.buffer);
        }

        await collections.assignments().insertOne({
            coursename: courseName,
            assignmentname: name,
            description,
            duedate: due_date,
            pdfpath: pdfPath,
            submissions: [],
        });

        res.status(201).json({ message: "Assignment created successfully", pdf: pdfPath });
    } catch (err) {
        console.error("create-assignment:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET /api/assignments/course/:course  (student view)
router.get("/course/:course", async (req, res) => {
    try {
        const courseName = req.params.course;
        const assignments = await collections.assignments()
            .find({ coursename: { $regex: `^${courseName}$`, $options: "i" } })
            .toArray();
        res.json({ assignments });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET /api/assignments/  (summary, optional ?course=)
router.get("/", async (req, res) => {
    try {
        const filter = req.query.course ? { coursename: req.query.course } : {};
        const results = await collections.assignments()
            .find(filter, { projection: { assignmentname: 1, coursename: 1, duedate: 1 } })
            .toArray();

        const assignments = results.map(r => ({
            name: r.assignmentname,
            course: r.coursename,
            due_date: r.duedate,
        }));
        res.json({ count: assignments.length, assignments });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// POST /api/assignments/submit/:student/:course/:assignment  (file upload)
router.post("/submit/:student/:course/:assignment", upload.single("file"), async (req, res) => {
    try {
        const { student, course, assignment } = req.params;
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        const ext = path.extname(req.file.originalname).toLowerCase();
        if (!ALLOWED_EXTS.includes(ext))
            return res.status(400).json({ error: `Invalid file type. Allowed: ${ALLOWED_EXTS.join(", ")}` });

        const dir = studentSubmissionDir(student, course, assignment);
        fs.mkdirSync(dir, { recursive: true });

        const filePath = path.join(dir, req.file.originalname);
        fs.writeFileSync(filePath, req.file.buffer);

        const filter = { coursename: course, assignmentname: assignment };
        const existing = await collections.assignments().findOne(filter);
        if (!existing) return res.status(404).json({ error: "Assignment not found" });

        await collections.assignments().updateOne(filter, {
            $push: { submissions: { student, filePath, grade: "Not Graded", feedback: "" } },
        });

        res.json({ message: "Assignment submitted successfully", file: req.file.originalname });
    } catch (err) {
        console.error("submit-assignment:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET /api/assignments/check/:student/:course/:assignment
router.get("/check/:student/:course/:assignment", async (req, res) => {
    try {
        const { student, course, assignment } = req.params;
        const doc = await collections.assignments().findOne({
            coursename: course, assignmentname: assignment,
        });
        if (!doc) return res.status(404).json({ error: "Assignment not found" });

        const sub = (doc.submissions || []).find(s => s.student === student);
        if (!sub) return res.json({ message: "Not Submitted" });
        res.json({ message: "Submitted", grade: sub.grade, feedback: sub.feedback });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET /api/assignments/admin/:course/:assignment/submissions
router.get("/admin/:course/:assignment/submissions", async (req, res) => {
    try {
        const { course, assignment } = req.params;
        const doc = await collections.assignments().findOne({
            coursename: course, assignmentname: assignment,
        });
        if (!doc) return res.status(404).json({ error: "Assignment not found" });
        res.json({ submissions: doc.submissions || [] });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// POST /api/assignments/admin/:course/:assignment/grade/:student
router.post("/admin/:course/:assignment/grade/:student", async (req, res) => {
    try {
        const { course, assignment, student } = req.params;
        const { grade, feedback } = req.body;

        await collections.assignments().updateOne(
            { coursename: course, assignmentname: assignment, "submissions.student": student },
            { $set: { "submissions.$.grade": grade, "submissions.$.feedback": feedback } }
        );

        res.json({ message: "Grade submitted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// DELETE /api/assignments/admin/:course/delete/:assignment
router.delete("/admin/:course/delete/:assignment", async (req, res) => {
    try {
        const { course, assignment } = req.params;

        const result = await collections.assignments().deleteOne({
            coursename: course, assignmentname: assignment,
        });
        if (result.deletedCount === 0)
            return res.status(404).json({ error: "Assignment not found" });

        // Remove course-level assignment folder
        const dir = assignmentDir(course, assignment);
        if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });

        // Remove all student submission folders for this assignment
        const students = await collections.users().find({}).toArray();
        for (const user of students) {
            const sDir = studentSubmissionDir(user.username, course, assignment);
            if (fs.existsSync(sDir)) fs.rmSync(sDir, { recursive: true, force: true });
        }

        res.json({ message: "Assignment and all student submissions deleted successfully" });
    } catch (err) {
        console.error("delete-assignment:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;