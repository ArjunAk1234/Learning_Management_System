/**
 * routes/courses.js
 * Handles: CRUD for courses, resource uploads, text notes, PDF download
 */

const express = require("express");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const { collections } = require("../config/db");
const { UPLOAD_DIR } = require("../config/config");
const { upload } = require("../middleware");

const router = express.Router();

function courseDir(courseName, ...sub) {
    return path.join(UPLOAD_DIR, "courses", courseName, ...sub);
}

// POST /api/courses/admin/create
router.post("/admin/create", async (req, res) => {
    try {
        const { name, resources, notes } = req.body;
        if (!name) return res.status(400).json({ error: "Course name is required" });

        await collections.courses().insertOne({
            name,
            resources: resources || [],
            notes: notes || [],
        });

        fs.mkdirSync(courseDir(name, "resources"), { recursive: true });
        res.status(201).json({ message: "Course created successfully" });
    } catch (err) {
        console.error("create-course:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET /api/courses/
router.get("/", async (req, res) => {
    try {
        const courses = await collections.courses().find({}).toArray();
        res.json(courses);
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET /api/courses/summary
router.get("/summary", async (req, res) => {
    try {
        const results = await collections.courses()
            .find({}, { projection: { name: 1 } })
            .toArray();
        const names = results.map(r => r.name).filter(Boolean);
        res.json({ count: names.length, names });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// POST /api/courses/admin/:course/resource  (file upload)
router.post("/admin/:course/resource", upload.single("file"), async (req, res) => {
    try {
        const courseName = req.params.course;
        const course = await collections.courses().findOne({ name: courseName });
        if (!course) return res.status(404).json({ error: "Course not found" });
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        const dir = courseDir(courseName, "resources");
        fs.mkdirSync(dir, { recursive: true });

        const fileName = req.file.originalname;
        fs.writeFileSync(path.join(dir, fileName), req.file.buffer);

        await collections.courses().updateOne(
            { name: courseName },
            { $push: { resources: fileName } }
        );
        res.status(201).json({ message: "Resource uploaded successfully", file: fileName });
    } catch (err) {
        console.error("upload-resource:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// POST /api/courses/admin/:course/note  (text note)
router.post("/admin/:course/note", async (req, res) => {
    try {
        const courseName = req.params.course;
        const course = await collections.courses().findOne({ name: courseName });
        if (!course) return res.status(404).json({ error: "Course not found" });

        const { name, content } = req.body;
        if (!name) return res.status(400).json({ error: "Note name is required" });

        const dir = courseDir(courseName, "notes");
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, `${name}.txt`), content || "");

        await collections.courses().updateOne(
            { name: courseName },
            { $push: { notes: `${name}.txt` } }
        );
        res.status(201).json({ message: "Note added successfully", note: `${name}.txt` });
    } catch (err) {
        console.error("upload-note:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET /api/courses/:course/resources
router.get("/:course/resources", async (req, res) => {
    try {
        const courseName = req.params.course;
        const course = await collections.courses().findOne({ name: courseName });
        if (!course) return res.status(404).json({ error: "Course not found" });

        const notesDir = courseDir(courseName, "notes");
        let notes = [];
        if (fs.existsSync(notesDir)) {
            notes = fs.readdirSync(notesDir).filter(f => f.endsWith(".txt"));
        }
        res.json({ resources: course.resources || [], notes });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET /api/courses/:course/resource/:resource  (download / inline)
router.get("/:course/resource/:resource", (req, res) => {
    const filePath = courseDir(req.params.course, "resources", req.params.resource);
    if (!fs.existsSync(filePath))
        return res.status(404).json({ error: "Resource not found" });

    const ext = path.extname(req.params.resource).toLowerCase();
    if (ext === ".html" || ext === ".htm") {
        res.setHeader("Content-Type", "text/html");
        res.setHeader("Content-Disposition", "inline");
    } else {
        res.setHeader("Content-Disposition", `attachment; filename="${req.params.resource}"`);
    }
    // res.sendFile(filePath);
    const path = require("path");
    res.sendFile(path.resolve(filePath)); // ✅ absolute path
});

// GET /api/courses/:course/notes/:note  (serve note as PDF)
router.get("/:course/notes/:note", (req, res) => {
    const notePath = courseDir(req.params.course, "notes", req.params.note);
    if (!fs.existsSync(notePath))
        return res.status(404).json({ error: "Note not found" });

    const content = fs.readFileSync(notePath, "utf8");
    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${req.params.note}.pdf"`);
    doc.pipe(res);
    doc.fontSize(12).text(content, { align: "left" });
    doc.end();
});

// DELETE /api/courses/admin/delete/:name
router.delete("/admin/delete/:name", async (req, res) => {
    try {
        const courseName = req.params.name;
        const result = await collections.courses().deleteOne({ name: courseName });
        if (result.deletedCount === 0)
            return res.status(404).json({ error: "Course not found" });

        await collections.assignments().deleteMany({ coursename: courseName });

        const dir = courseDir(courseName);
        if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });

        res.json({ message: "Course and all its data deleted successfully" });
    } catch (err) {
        console.error("delete-course:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;