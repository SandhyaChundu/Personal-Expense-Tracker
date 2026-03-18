const jwt = require("jsonwebtoken");

const SECRET = "mysecretkey";

module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        console.log("Auth Header:", authHeader); // DEBUG

        if (!authHeader) {
            return res.status(401).json({ message: "No token" });
        }

        const token = authHeader.split(" ")[1];

        const verified = jwt.verify(token, SECRET);

        req.user = verified; // ✅ MUST

        next();

    } catch (err) {
        console.error("Auth Error:", err);
        res.status(401).json({ message: "Invalid token" });
    }
};