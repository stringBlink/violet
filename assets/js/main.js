import { auth } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import {
  doc,
  getDoc,
  setDoc,
  getDocs,
  collection,
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { db } from "./firebase-config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

//check if signed in func
document.addEventListener("DOMContentLoaded", () => {
  const loggedIn = document.getElementById("logged-in");
  const loggedOut = document.getElementById("logged-out");

  onAuthStateChanged(auth, (user) => {
    if (user) {
      const myAcc = document.getElementById("my-account");
      myAcc.innerHTML += `                
                <div class="log-out-dropdown" >  
                    <a href="pages/order-history.html" style = "color:black">مشترياتي</a>
                    <a href="pages/cart.html" style = "color:black">العربة</a>
                    <a href="#"id="log-out-button">تسجيل خروج</a>
               </div>
`;
;
      setTimeout(() => {
        const logOut = document.getElementById("log-out-button");
        const loggedIn = document.getElementById("logged-in");
        const loggedOut = document.getElementById("logged-out");
  
          if (loggedIn) loggedIn.style.display = "flex";
          if (loggedOut) loggedOut.style.display = "none"; // FIXXXXXXXXXXXXXXX LATER
        if (logOut) {
          logOut.addEventListener("click", (event) => {
            event.preventDefault();
            signOut(auth)
              .then(() => {
                window.location.href = "/index.html";
              })
              .catch((error) => {
                console.error("Error during sign-out:", error);
              });
          });
        } else {
          console.error("Logout button not found");
        }
      }, 100);


    
    } 
    
    else {
      const myAcc = document.getElementById("my-account");
      myAcc.innerHTML += `
            <div class="log-out-dropdown">       
      <a href="/pages/log-in.html" style="color: green;">تسجيل دخول</a>
      <a href="/pages/sign-up.html" style="color: green;">انشاء حساب</a>
      </div>`;



      if (loggedIn) loggedIn.style.display = "none";
      if (loggedOut) loggedOut.style.display = "flex";
    }
  });
});

// Offers Show Func
document.addEventListener("DOMContentLoaded", async () => {
  const querySnapshot = await getDocs(collection(db, "offer"));
  querySnapshot.forEach((doc) => {
    let data = doc.data();
    let title = data.title;
    let price = data.price;
    let imgURL = data.imageURL;
    console.log(doc.id, " => ", doc.data());
    const offersContainer = document.getElementById("add-cont");
    offersContainer.innerHTML += `
            <div class="product" data-price = "${price}">
            <img src="${imgURL}" alt="" class="product-image" id="image">
            <h3 id="title">${title}</h3>
            <p id="price">السعر :  ${price} جنيه</p>
            <button class="add-to-cart"  >Add to Cart</button>                    
            </div>
        `;
  });
});

//funcition to redirect to add to cart
document.addEventListener("click", async (event) => {
  if (event.target.classList.contains("add-to-cart")) {
    try {
      // Get the current user
      const user = auth.currentUser;
      if (!user) {
        window.location.href = "/pages/log-in.html";
        return;
      }

      const uid = user.uid; // User ID

      // Get the closest product container
      const product = event.target.closest(".product");
      if (!product) {
        console.error("Product not found.");
        return;
      }

      // Get product details
      let titleElement = product.querySelector("h3");
      let priceElement = product.dataset.price;

      if (!titleElement || !priceElement) {
        console.error("Missing product details.");
        return;
      }

      let title = titleElement.textContent;
      let price = parseFloat(priceElement);

      // Firestore reference
      const cartRef = doc(db, "carts", uid);
      let cart = [];

      // Fetch existing cart
      const cartSnap = await getDoc(cartRef);
      if (cartSnap.exists()) {
        cart = cartSnap.data().items;
      }

      // Add item to cart
      cart.push({ title, price, quantity: 1 });

      // Update Firestore
      await setDoc(cartRef, { items: cart });

      // Redirect to cart page
      window.location.href = "/pages/cart.html";
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Something went wrong. Please try again.");
    }
  }
});

// toggle menu funcition
document.addEventListener("DOMContentLoaded", () => {
  const menuIcon = document.getElementById("menuIcon");
  const closeIcon = document.getElementById("closeIcon");
  const menuOverlay = document.getElementById("menuOverlay");

  menuIcon.addEventListener("click", () => {
    menuOverlay.classList.add("active");
  });

  closeIcon.addEventListener("click", () => {
    menuOverlay.classList.remove("active");
  });
});

//scrolling animation funcition
document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".section");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    },
    { threshold: 0.2 }
  );

  sections.forEach((section) => observer.observe(section));
});
