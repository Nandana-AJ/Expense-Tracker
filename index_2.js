// script.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase, ref, push, update } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword ,signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

const appsettings = {
    databaseURL: "https://expense-tracker-1e6e6-default-rtdb.firebaseio.com/"
};

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

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();

document.addEventListener("DOMContentLoaded", (e) => {
    const signupButton = document.getElementById("signup_button");

    signupButton.addEventListener("click", (e) => {
        var email = document.getElementById("email").value;
        var password = document.getElementById("password").value;

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                alert('User created');
            })
            .catch((error) => {
                const errorMessage = error.message;
                alert(errorMessage);
            });

        });
});

document.addEventListener("DOMContentLoaded", (e) => {
    const loginButton = document.getElementById("login_button");

    loginButton.addEventListener("click", (e) => {
        var email = document.getElementById("email").value;
        var password = document.getElementById("password").value;
        var username = document.getElementById("username").value;
            
        localStorage.setItem('username',username);
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                alert('Logged in');
                window.location.href = "main.html";
            })
            .catch((error) => {
                const errorMessage = error.message;
                alert(errorMessage);
            });
    });
});


