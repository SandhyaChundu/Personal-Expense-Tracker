const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
    title: String,
    amount: Number,
    category: String,
    date: String,
    userId: String
});

module.exports = mongoose.model("expense", expenseSchema);