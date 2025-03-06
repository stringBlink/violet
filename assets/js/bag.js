import { auth, db } from "./firebase-config.js";
import {
  doc,
  collection,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
let uid = null;
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

//check if signed in func
document.addEventListener("DOMContentLoaded", () => {
    
    onAuthStateChanged(auth,  (user) => {
      if (user) {
        const rightSideNav = document.getElementById('right-side-nav')
        rightSideNav.innerHTML += `
                        <div class="cart-dropdown" dir = "rtl">
                <a href="cart.html" id="cart-icon">
                    <i class="fa-solid fa-cart-shopping" style="font-size: 20px;"></i>
                </a>
                <div class="cart-dropdown-content" id="cart-dropdown">
                    <ul id="cart-items"></ul>
                    <div class="cart-buttons">
                        <button id="clear-cart">Clear Cart</button>
                        <button id="checkout-cart">Checkout</button>
                    </div>
                </div>
            </div>
        `
         uid = user.uid;

      } else {
        console.log("No user is signed in.");
        
      }
    });
    
  });
  


//get bags funcition
document.addEventListener("DOMContentLoaded", async () => {

    const querySnapshot = await getDocs(collection(db, "bag"));
    querySnapshot.forEach((doc) => {
        let data = doc.data();
        let title = data.title;
        let price = data.price;
        let image = data.imageURL
        console.log(doc.id, " => ", doc.data());
        const bagContainer = document.getElementById("bags-cont");
        bagContainer.innerHTML += `
            <div class="product" id="product-div" data-price="${price}">
            <div> <img src="${image}" alt="" class = "product-image"></div>
            <h3 id="title">${title}</h3>
            <p id="price" style = "font-weight : 600;">Price: $${price}</p>
            <button class="add-to-cart" id="cart-icon">Add to Cart</button>
        </div>
        `

    });
    addCartEventListeners();


});
// sorting func

document.getElementById("sortPrice").addEventListener("change", function () {
    let products = Array.from(document.querySelectorAll(".product"));
    let container = document.getElementById("bags-cont");
    
    // Get sorting order (asc = Low to High, desc = High to Low)
    let order = this.value;

    products.sort((a, b) => {
        let priceA = parseFloat(a.getAttribute("data-price"));
        let priceB = parseFloat(b.getAttribute("data-price"));
        return order === "asc" ? priceA - priceB : priceB - priceA;
    });

    // Re-append sorted products to the container
    container.innerHTML = "";
    products.forEach(product => container.appendChild(product));
});



// Add to Cart Functionality
function addCartEventListeners() {
    document.querySelectorAll(".add-to-cart").forEach((button) => {
        button.addEventListener("click", async (event) => {
            
            let product = event.target.closest(".product");
            
            if (!product) return;

            let titleElement = product.querySelector("h3");
            let priceElement = product.getAttribute("data-price");


            if (!titleElement || !priceElement) {
                console.error("Title or price not found in product element:", product);
                return;
            }

            let title = titleElement.textContent;
            let price = parseFloat(priceElement);
            let imgElement = product.closest("div").querySelector("img");
            let imgSrc = imgElement ? imgElement.src : null;
           

            
            let cartRef = doc(db, "carts", uid); // Firestore reference
            let cart = [];

            try {
                // Get the latest cart from Firestore
                let cartSnap = await getDoc(cartRef);
                if (cartSnap.exists()) {
                    cart = cartSnap.data().items;
                }

                // Update local cart
                let existingItem = cart.find((item) => item.title === title);
                if (existingItem) {
                    existingItem.quantity++;
                } else {
                    cart.push({ title, price, quantity: 1 , imgSrc });
                }

                // Save updated cart to Firestore
                await setDoc(cartRef, { items: cart });

                // ✅ Update UI *after* Firestore updates
                await updateCartUI();

                console.log("Cart updated in Firestore and UI!");
            } catch (error) {
                console.error("Error updating Firestore:", error);
            }
        });
    });
}


// Function to update the cart dropdown UI
async function updateCartUI() {
    let cartDropdown = document.getElementById("cart-items");
    if (!cartDropdown || !uid) return;

    try {
        let cartDoc = doc(db, "carts", uid);
        const docSnap = await getDoc(cartDoc); // FIXED VARIABLE NAME

        let cart = docSnap.exists() ? docSnap.data().items : []; // FIXED SYNTAX

        cartDropdown.innerHTML = "";
        if (cart.length === 0) {
            cartDropdown.innerHTML = "<li>Your cart is empty</li>";
            return;
        }

        cart.forEach((item) => {
            let li = document.createElement("li");
            li.textContent = `${item.title} - $${item.price} (x${item.quantity})`;
            cartDropdown.appendChild(li);
        });
    } catch (error) {
        console.error("Error fetching cart data:", error);
    }
}

// Function to clear the cart
document.addEventListener("click", async (event) => {
    if (event.target.id === "clear-cart") {
        localStorage.removeItem("cart");
        await deleteDoc(doc(db, "carts", uid)); // FIXED SYNTAX
        await updateCartUI();
    }
});

// Function to handle checkout
document.addEventListener("click", async (event) => {
    if (event.target.id === "checkout-cart") {
        let cartRef = doc(db, "carts", uid);
        
        try {
            let cartSnap = await getDoc(cartRef);
            let cart = cartSnap.exists() ? cartSnap.data().items : [];

            if (cart.length === 0) {
                alert("Your cart is empty.");
                return;
            }


            // Update UI
            await updateCartUI();

            // Redirect to checkout page
            window.location.href = "cart.html";
        } catch (error) {
            console.error("Error fetching cart from Firestore:", error);
        }
    }
});

// Update cart UI on page load
document.addEventListener("DOMContentLoaded", async () => {
    await updateCartUI(); // ADDED ASYNC TO ENSURE UI UPDATES
});



