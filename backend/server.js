const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes); // ✅ THIS WAS MISSING

// DB
mongoose.connect("mongodb://127.0.0.1:27017/expenseDB")
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// Server
app.listen(5002, () => {
    console.log("Server running on port 5002");
});