import { auth } from "./firebase-config.js";
import {   signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {


  submit.addEventListener('click', (e) => { 
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const submit = document.getElementById('submit');
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        window.location.href = "/index.html";
        // ...
      })  
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        document.getElementById('invalid-credential').innerText = 'Invalid Credentials';
        // ..
      });
    
    });
});

