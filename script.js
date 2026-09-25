// USERS
let users = JSON.parse(localStorage.getItem("users")) || [];

// Always make sure Admin account exists
if (!users.some(x => x.user === "admin")) {
    users.unshift({
        user: "admin",
        pass: "admin123",
        role: "admin"
    });
    localStorage.setItem("users", JSON.stringify(users));
}

// EXPENSES
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

let currentUser = "";

// SHOW MODULE
function show(id) {
    document.querySelectorAll(".container > div").forEach(x =>
        x.classList.add("hide")
    );

    document.getElementById(id).classList.remove("hide");
}

// SIGNUP
function signup() {

    let u = document.getElementById("signUser").value.trim();
    let p = document.getElementById("signPass").value.trim();

    if (!u || !p) {
        document.getElementById("signMsg").innerText =
            "Enter all details";
        return;
    }

    if (users.some(x => x.user === u)) {
        document.getElementById("signMsg").innerText =
            "User already exists";
        return;
    }

    users.push({
        user: u,
        pass: p,
        role: "user"
    });

    localStorage.setItem("users", JSON.stringify(users));

    document.getElementById("signMsg").innerText =
        "Signup successful!";

    document.getElementById("signUser").value = "";
    document.getElementById("signPass").value = "";
}

// LOGIN
function login() {

    let u = document.getElementById("loginUser").value.trim();
    let p = document.getElementById("loginPass").value.trim();

    let found = users.find(x =>
        x.user === u && x.pass === p
    );

    if (!found) {
        document.getElementById("loginMsg").innerText =
            "Invalid username or password";
        return;
    }

    currentUser = u;

    document.getElementById("loginMsg").innerText = "";

    if (found.role === "admin") {
        show("admin");
        loadAdmin();
    } else {
        show("user");
        loadExpenses();
    }
}

// ADD EXPENSE
function addExpense() {

    let d = document.getElementById("desc").value.trim();
    let a = Number(document.getElementById("amount").value);
    let n = Number(document.getElementById("people").value);

    if (!d || !a || !n || n <= 0) {
        document.getElementById("result").innerText =
            "Enter valid details";
        return;
    }

    let share = (a / n).toFixed(2);

    expenses.push({
        user: currentUser,
        desc: d,
        amount: a,
        people: n,
        share: share
    });

    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    );

    document.getElementById("result").innerText =
        "Each person pays ₹" + share;

    document.getElementById("desc").value = "";
    document.getElementById("amount").value = "";
    document.getElementById("people").value = "";

    loadExpenses();
}

// USER EXPENSES
function loadExpenses() {

    let list = document.getElementById("expenseList");

    list.innerHTML = "";

    expenses
        .filter(x => x.user === currentUser)
        .forEach(x => {

            list.innerHTML += `
                <div>
                    <b>${x.desc}</b><br>
                    Amount: ₹${x.amount}<br>
                    People: ${x.people}<br>
                    Each Person: ₹${x.share}
                </div>
            `;
        });
}

// ADMIN DASHBOARD
function loadAdmin() {

    let userBox = document.getElementById("users");
    let expenseBox = document.getElementById("allExpenses");

    userBox.innerHTML = users.map(x =>
        `<div>${x.user} - ${x.role}</div>`
    ).join("");

    expenseBox.innerHTML = expenses.map((x, i) =>
        `
        <div>
            ${x.user} - ${x.desc} - ₹${x.amount}
            <button onclick="deleteExpense(${i})">
                Delete
            </button>
        </div>
        `
    ).join("");
}

// DELETE EXPENSE
function deleteExpense(i) {

    expenses.splice(i, 1);

    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    );

    loadAdmin();
}

// LOGOUT
function logout() {

    currentUser = "";

    document.getElementById("loginUser").value = "";
    document.getElementById("loginPass").value = "";
    document.getElementById("loginMsg").innerText = "";

    show("login");
}
