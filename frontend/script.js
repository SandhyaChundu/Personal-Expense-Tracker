const API = "http://localhost:5002/api/expenses";
const AUTH_API = "http://localhost:5002/api/auth";

let token = localStorage.getItem("token");
let allExpenses = [];
let chart;

// Toggle UI
function showLogin() {
    document.getElementById("loginBox").style.display = "block";
    document.getElementById("signupBox").style.display = "none";
}

function showSignup() {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("signupBox").style.display = "block";
}

// Signup
async function signup() {
    const res = await fetch(AUTH_API + "/signup", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            name: document.getElementById("signupName").value,
            email: document.getElementById("signupEmail").value,
            password: document.getElementById("signupPassword").value
        })
    });

    const data = await res.json();

    if (!res.ok) {
        alert(data.message);
        return;
    }

    alert("Signup successful");
    showLogin();
}

// Login
async function login() {
    const res = await fetch(AUTH_API + "/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            email: document.getElementById("loginEmail").value,
            password: document.getElementById("loginPassword").value
        })
    });

    const data = await res.json();

    if (!res.ok) {
        alert(data.message);
        return;
    }

    localStorage.setItem("token", data.token);
    token = data.token;

    document.querySelector(".auth-box").style.display = "none";
    document.getElementById("app").style.display = "block";

    loadExpenses();
}

// Logout
function logout() {
    localStorage.removeItem("token");
    location.reload();
}

// Load Expenses
async function loadExpenses() {
    const res = await fetch(API, {
        headers: { "Authorization": "Bearer " + token }
    });

    const data = await res.json();
    allExpenses = data;

    renderExpenses(data);
    renderChart(data);
}

// Render Cards
function renderExpenses(data) {
    const list = document.getElementById("expenseList");
    const totalEl = document.getElementById("total");

    list.innerHTML = "";
    let total = 0;

    data.forEach(exp => {
        total += Number(exp.amount);

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <h3>${exp.title}</h3>
            <p>₹${exp.amount}</p>
            <p>${exp.category}</p>
            <p>${exp.date}</p>
            <button onclick="deleteExpense('${exp._id}')">Delete</button>
        `;

        list.appendChild(card);
    });

    totalEl.innerText = total;
}

// Add Expense
async function addExpense() {
    const expense = {
        title: document.getElementById("title").value,
        amount: document.getElementById("amount").value,
        category: document.getElementById("category").value,
        date: document.getElementById("date").value
    };

    const res = await fetch(API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(expense)
    });

    if (!res.ok) {
        alert("Error adding expense");
        return;
    }

    loadExpenses();
}

// Delete
async function deleteExpense(id) {
    await fetch(API + "/" + id, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + token }
    });

    loadExpenses();
}

// Filters
function applyFilters() {
    const category = document.getElementById("filterCategory").value.toLowerCase();
    const date = document.getElementById("filterDate").value;

    let filtered = allExpenses.filter(exp => {
        return (
            (!category || exp.category.toLowerCase().includes(category)) &&
            (!date || exp.date === date)
        );
    });

    renderExpenses(filtered);
    renderChart(filtered);
}

// Chart
function renderChart(data) {
    const ctx = document.getElementById("expenseChart");

    const map = {};
    data.forEach(exp => {
        map[exp.category] = (map[exp.category] || 0) + Number(exp.amount);
    });

    const labels = Object.keys(map);
    const values = Object.values(map);

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: labels,
            datasets: [{
                data: values
            }]
        }
    });
}

// Dark mode
function toggleDarkMode() {
    document.body.classList.toggle("dark");
}

// Auto login
if (token) {
    document.querySelector(".auth-box").style.display = "none";
    document.getElementById("app").style.display = "block";
    loadExpenses();
}