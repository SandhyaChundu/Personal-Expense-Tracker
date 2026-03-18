const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET = "mysecretkey";

// Signup
exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        res.json({ message: "User registered successfully" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        console.log("Login request body:", req.body); 
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        console.log("User found:", user); // ✅ DEBUG
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password match:", isMatch);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id },
            SECRET,
            { expiresIn: "1d" }
        );

        res.json({ token });

    } catch (err) {
         console.error("Login error:", err);
        res.status(500).json({ error: err.message });
    }
};