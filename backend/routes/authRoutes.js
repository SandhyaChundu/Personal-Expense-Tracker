const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const SECRET = "mysecretkey";

// ================= SIGNUP =================
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = new User({ name, email, password });
        await user.save();

        res.json({ message: "User registered successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// ================= LOGIN =================
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log("Login email:", email); // DEBUG

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "No user found" });
        }

        if (user.password !== password) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const token = jwt.sign(
            { id: user._id },
            SECRET,
            { expiresIn: "1d" }
        );

        res.json({ token });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;