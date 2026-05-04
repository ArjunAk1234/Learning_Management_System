const jwt = require("jsonwebtoken");
const multer = require("multer");
const { JWT_SECRET } = require("../config/config");


function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
}

function authMiddleware(req, res, next) {
    const authHeader = req.headers["authorization"] || "";
    if (!authHeader.startsWith("Bearer "))
        return res.status(401).json({ error: "Unauthorised: missing token" });

    try {
        const claims = verifyToken(authHeader.slice(7));
        req.email = claims.email;
        next();
    } catch {
        res.status(401).json({ error: "Unauthorised: invalid or expired token" });
    }
}

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

module.exports = { verifyToken, authMiddleware, upload };