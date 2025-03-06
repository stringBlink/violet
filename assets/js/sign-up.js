
import { auth } from "./firebase-config.js";
import {  createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js"
import {db} from "./firebase-config.js";


document.addEventListener("DOMContentLoaded", () => {
  const submit = document.getElementById("submit");
  
  submit.addEventListener("click", (e) => { 
    e.preventDefault();
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
          const user = userCredential.user
          setDoc(doc(db, "users", user.uid), {
          name: username,
          role : "user",
        });
        window.location.href = "/index.html"
      })
      .catch((error) => {
        console.log("Error:", error.message);
        if(error.message.includes("Firebase: Error (auth/email-already-in-use)"))
          document.getElementById('invalid-credintial').innerHTML = "E-mail Already in Use" 
        else if (error.message.includes("Firebase: Error (auth/invalid-email)."))  
          document.getElementById('invalid-credintial').innerHTML = "Please Enter a Valid E-mail" 

      });
  });
});
