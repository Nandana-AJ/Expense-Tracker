import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBGyUYjvjZXQ3Q-GY_xyT7coZHH0bMugyg",
    authDomain: "expense-tracker-1e6e6.firebaseapp.com",
    databaseURL: "https://expense-tracker-1e6e6-default-rtdb.firebaseio.com",
    projectId: "expense-tracker-1e6e6",
    storageBucket: "expense-tracker-1e6e6.appspot.com",
    messagingSenderId: "962146764874",
    appId: "1:962146764874:web:8fcc3f8e871faa335ffeb3",
    measurementId: "G-81VQMH93YX"
};
const REFERANCE = localStorage.getItem('username');
console.log(REFERANCE)
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const expensesRef = ref(database,REFERANCE);

let chart;
let currentView = 'monthly';

function groupByMonth(expenses, year) {
    const monthlyCashOut = Array.from({ length: 12 }, () => 0);
    const monthlyCashIn = Array.from({ length: 12 }, () => 0);

    expenses.forEach(expense => {
        const expenseDate = new Date(expense.date);
        if (expenseDate.getFullYear() === year) {
            const month = expenseDate.getMonth();
            if (expense.status === "out") {
                monthlyCashOut[month] += parseFloat(expense.amount);
            } else if (expense.status === "in") {
                monthlyCashIn[month] += parseFloat(expense.amount);
            }
        }
    });

    return { monthlyCashOut, monthlyCashIn };
}

function groupByWeek(expenses, year, month) {
    const weeklyCashOut = Array.from({ length: 4 }, () => 0);
    const weeklyCashIn = Array.from({ length: 4 }, () => 0);

    expenses.forEach(expense => {
        const expenseDate = new Date(expense.date);
        if (expenseDate.getFullYear() === year && expenseDate.getMonth() === month) {
            const week = Math.floor((expenseDate.getDate() - 1) / 7);
            if (expense.status === "out") {
                weeklyCashOut[week] += parseFloat(expense.amount);
            } else if (expense.status === "in") {
                weeklyCashIn[week] += parseFloat(expense.amount);
            }
        }
    });

    return { weeklyCashOut, weeklyCashIn };
}

function updateChart(data, labels, label) {
    if (chart) {
        chart.destroy();
    }
    const ctx = document.getElementById('expenseChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Cash Out Amount',
                    data: data.cashOut,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Cash In Amount',
                    data: data.cashIn,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function displayExpenses(year) {
    onValue(expensesRef, (snapshot) => {
        const expenses = [];
        snapshot.forEach((childSnapshot) => {
            const expense = childSnapshot.val();
            expenses.push(expense);
        });

        let data, labels;
        if (currentView === 'monthly') {
            const { monthlyCashOut, monthlyCashIn } = groupByMonth(expenses, year);
            data = { cashOut: monthlyCashOut, cashIn: monthlyCashIn };
            labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        } else {
            const month = parseInt(document.getElementById('monthSelect').value, 10);
            const { weeklyCashOut, weeklyCashIn } = groupByWeek(expenses, year, month);
            data = { cashOut: weeklyCashOut, cashIn: weeklyCashIn };
            labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        }

        updateChart(data, labels, currentView === 'monthly' ? 'Monthly' : 'Weekly');
    });
}

// Handle form submission
document.getElementById('yearForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const year = parseInt(document.getElementById('year').value, 10);
    displayExpenses(year);
});

// Handle monthly view button click
document.getElementById('monthlyView').addEventListener('click', () => {
    currentView = 'monthly';
    document.getElementById('monthSelectContainer').style.display = 'none';
    const year = parseInt(document.getElementById('year').value, 10);
    if (!isNaN(year)) {
        displayExpenses(year);
    }
});

// Handle weekly view button click
document.getElementById('weeklyView').addEventListener('click', () => {
    currentView = 'weekly';
    document.getElementById('monthSelectContainer').style.display = 'block';
    const year = parseInt(document.getElementById('year').value, 10);
    if (!isNaN(year)) {
        displayExpenses(year);
    }
});
