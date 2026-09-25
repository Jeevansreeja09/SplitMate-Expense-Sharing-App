let users = JSON.parse(localStorage.getItem("users")) || [
    {user:"admin", pass:"admin123", role:"admin"}
];

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let currentUser = "";

function show(id) {
    document.querySelectorAll(".container > div").forEach(x =>
        x.classList.add("hide")
    );
    document.getElementById(id).classList.remove("hide");
}

// SIGNUP
function signup() {
    let u = signUser.value;
    let p = signPass.value;

    if (!u || !p) {
        signMsg.innerText = "Enter all details";
        return;
    }

    if (users.some(x => x.user === u)) {
        signMsg.innerText = "User already exists";
        return;
    }

    users.push({user:u, pass:p, role:"user"});
    localStorage.setItem("users", JSON.stringify(users));

    signMsg.innerText = "Signup successful!";
}

// LOGIN
function login() {
    let u = loginUser.value;
    let p = loginPass.value;

    let found = users.find(x => x.user === u && x.pass === p);

    if (!found) {
        loginMsg.innerText = "Invalid username or password";
        return;
    }

    currentUser = u;

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
    let d = desc.value;
    let a = Number(amount.value);
    let n = Number(people.value);

    if (!d || !a || !n) {
        result.innerText = "Enter all details";
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

    localStorage.setItem("expenses", JSON.stringify(expenses));

    result.innerText = "Each person pays ₹" + share;

    desc.value = "";
    amount.value = "";
    people.value = "";

    loadExpenses();
}

// USER EXPENSES
function loadExpenses() {
    expenseList.innerHTML = "";

    expenses
    .filter(x => x.user === currentUser)
    .forEach((x, i) => {
        expenseList.innerHTML += `
            <div>
                <b>${x.desc}</b><br>
                Amount: ₹${x.amount}<br>
                Each Person: ₹${x.share}
            </div>
        `;
    });
}

// ADMIN DASHBOARD
function loadAdmin() {

    users.innerHTML = usersList = "";

    users.innerHTML = usersList =
        users.map(x => `<div>${x.user} - ${x.role}</div>`).join("");

    allExpenses.innerHTML =
        expenses.map((x, i) => `
            <div>
                ${x.user} - ${x.desc} - ₹${x.amount}
                <button onclick="deleteExpense(${i})">Delete</button>
            </div>
        `).join("");
}

// DELETE EXPENSE
function deleteExpense(i) {
    expenses.splice(i, 1);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    loadAdmin();
}

// LOGOUT
function logout() {
    currentUser = "";
    show("login");
}