import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js';
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDEd9hxnIEs-flsbcjcrkV6AGsFEFK74Bs",
  authDomain: "violet-store.firebaseapp.com",
  databaseURL: "https://violet-store-default-rtdb.firebaseio.com",
  projectId: "violet-store",
  storageBucket: "violet-store.firebasestorage.app",
  messagingSenderId: "161702643857",
  appId: "1:161702643857:web:f2e4ba4d28598a9c025730",
  measurementId: "G-X2NFHM84BC",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();

document.addEventListener('DOMContentLoaded', () => {
  const forgotPasswordForm = document.getElementById('forgot-pass-form');
  const submit = document.getElementById('submit');

  forgotPasswordForm.addEventListener('submit', (e) => { 
    e.preventDefault();
    const email = document.getElementById('email').value;
    
    sendPasswordResetEmail(auth, email)
      .then(() => {
        document.getElementById('is-email-sent').innerText = 'Email sent successfully';
        document.getElementById('is-email-sent').style.color = 'green';
      
    })
      .catch((error) => {
        document.getElementById('is-email-sent').innerText = 'Email is Not Registered';
      });
  });
});
