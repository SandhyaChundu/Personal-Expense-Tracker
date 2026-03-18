const express = require("express");
const router = express.Router();
const Expense = require("../models/expense");
const authMiddleware = require("../middleware/authMiddleware");

// ================= GET EXPENSES =================
router.get("/", authMiddleware, async (req, res) => {
    try {
        const expenses = await Expense.find({ userId: req.user.id });
        res.json(expenses);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// ================= ADD EXPENSE =================
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { title, amount, category, date } = req.body;

        console.log("User:", req.user); // DEBUG
        console.log("Body:", req.body); // DEBUG

        const newExpense = new Expense({
            title,
            amount,
            category,
            date,
            userId: req.user.id
        });

        await newExpense.save();

        res.json(newExpense);

    } catch (err) {
        console.error("Add Expense Error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// ================= DELETE =================
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;