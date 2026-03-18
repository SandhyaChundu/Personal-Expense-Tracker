const Expense = require("../models/expense");

// Create Expense
exports.createExpense = async (req, res) => {
    try {
        console.log("Incoming data:", req.body); 
        const expense = new Expense(req.body);
        const saved = await expense.save();
        res.json(saved);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

// Get All Expenses
exports.getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find().sort({ date: -1 });
        res.json(expenses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete Expense
exports.deleteExpense = async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};