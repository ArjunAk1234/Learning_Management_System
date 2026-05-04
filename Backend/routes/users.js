
const express = require("express");
const fs = require("fs");
const path = require("path");

const { collections } = require("../config/db");
const { UPLOAD_DIR } = require("../config/config");
const { upload } = require("../middleware");

const router = express.Router();

function sanitizeEmail(email) {
    return email
        .toLowerCase()
        .replace(/@/g, "_at_")
        .replace(/\./g, "_dot_")
        .replace(/[^a-zA-Z0-9_]+/g, "_");
}



// POST /api/users/add-details  (multipart)
router.post("/add-details", upload.single("photo"), async (req, res) => {
    try {
        const {
            email, full_name, age, address, phone,
            father_name, mother_name, parent_contact,
            school_name, grade,
        } = req.body;

        if (!email) return res.status(400).json({ error: "Email is required" });
        if (!req.file) return res.status(400).json({ error: "Profile photo is required" });

        const userFolder = path.join(UPLOAD_DIR, sanitizeEmail(email));
        fs.mkdirSync(userFolder, { recursive: true });

        const photoPath = path.join(userFolder, "photo.jpg");
        fs.writeFileSync(photoPath, req.file.buffer);

        await collections.details().insertOne({
            email, full_name, age, address, phone,
            father_name, mother_name, parent_contact,
            school_name, grade,
            photo_path: photoPath,
        });

        res.json({ message: "User details added successfully!", photo: photoPath });
    } catch (err) {
        console.error("add-details:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// POST /api/users/update-details  (multipart)
router.post("/update-details", upload.single("photo"), async (req, res) => {
    try {
        const {
            email, full_name, age, address, phone,
            father_name, mother_name, parent_contact,
            school_name, grade,
        } = req.body;

        if (!email) return res.status(400).json({ error: "Email is required" });

        const updateData = {
            full_name, age, address, phone,
            father_name, mother_name, parent_contact,
            school_name, grade,
        };

        if (req.file) {
            const userFolder = path.join(UPLOAD_DIR, sanitizeEmail(email));
            fs.mkdirSync(userFolder, { recursive: true });
            const photoPath = path.join(userFolder, "photo.jpg");
            fs.writeFileSync(photoPath, req.file.buffer);
            updateData.photo_path = photoPath;
        }

        const result = await collections.details().updateOne(
            { email },
            { $set: updateData },
            { upsert: true }
        );

        const message = result.upsertedCount > 0
            ? "User details created successfully!"
            : "User details updated successfully!";

        const resp = { message, matched: result.matchedCount, upserted: result.upsertedCount };
        if (updateData.photo_path) resp.photo = updateData.photo_path;
        res.json(resp);
    } catch (err) {
        console.error("update-details:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET /api/users/details/:email
router.get("/details/:email", async (req, res) => {
    try {
        const email = decodeURIComponent(req.params.email);
        const details = await collections.details().findOne({
            email: { $regex: `^${email}$`, $options: "i" },
        });
        if (!details) return res.status(404).json({ error: "User details not found" });
        res.json({ details });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET /api/users/students  (all student details records)
router.get("/students", async (req, res) => {
    try {
        const students = await collections.details().find({}).toArray();
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// PUT /api/users/verify-payment/:email
router.put("/verify-payment/:email", async (req, res) => {
    try {
        const result = await collections.details().updateOne(
            { email: req.params.email },
            { $set: { payment_status: "Verified" } }
        );
        if (result.modifiedCount === 0)
            return res.status(404).json({ error: "User not found or already verified" });
        res.json({ message: "Payment status updated to Verified" });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;