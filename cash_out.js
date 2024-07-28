import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

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

const date = localStorage.getItem('message');
document.getElementById('messageDisplay').innerText = date;
let connector = "out"; // Use a different variable name instead of "in"
let new_date = date + ' ' + connector + ' ' + REFERANCE; 
console.log(new_date);


// Function to add expense to Firebase
function addExpense(item, amount) {
    push(expensesRef, {
        item: item,
        amount: amount,
        date: date,
        status:"out"
    });
}


// Function to display expenses
function displayExpenses(date) {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = ''; // Clear previous data

    const itemsDisplayed = new Set(); // Set to store displayed items
    let totalAmount_out= 0; // Variable to store the total amount

    onValue(expensesRef, (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const expense = childSnapshot.val();
            if (expense.date == date) {
              if(expense.status=="out"){
                if (!itemsDisplayed.has(expense.item)) {
                    itemsDisplayed.add(expense.item); // Add item to the set
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${expense.item}</td>
                        <td>${expense.amount}</td>
                        <td>${expense.date}</td>
                    `;
                    tableBody.appendChild(row);
                    totalAmount_out += parseFloat(expense.amount); // Add amount to total
                }
              }
            }
        });
        // Create a row for displaying the total amount
        const totalAmountInput = document.getElementById('total-amount');
        totalAmountInput.value = totalAmount_out;
        localStorage.setItem(new_date, totalAmount_out );
    });
}


// Handle form submission
document.getElementById('expenseForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const item = document.getElementById('item').value;
    const amount = parseFloat(document.getElementById('amount').value);
    addExpense(item, amount);
    document.getElementById('expenseForm').reset();
});

// Load and display expenses on page load
window.addEventListener('load', () => {
    displayExpenses(date);
});
