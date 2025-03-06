import { auth, db } from "./firebase-config.js"
import {
  doc,
  collection,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
const itemsTotal = document.getElementById('items-total')
const lastTotal = document.getElementById('last-total')
let totalPrice = 0
let currentUser;
document.addEventListener("DOMContentLoaded",  () => {
  onAuthStateChanged(auth, async(user) => {
    if (user) {
      currentUser = user;
      const uid = user.uid;
      console.log("uid : ", uid);
      const dockRef = doc(db, "carts", uid);
      const dockSnap = await getDoc(dockRef);
      const data = dockSnap.data();
      const items = data.items;
      const cartContainer = document.getElementById('cart')
      for (let index = 0; index < items.length; index++) {
        // declaring values
        let price = items[index].price; 
        let quantity = items[index].quantity;
        let title = items[index].title;
        let imageURL = items[index].imgSrc;
        totalPrice += price*quantity
        // declaring values

        // ITEM SHOW
        cartContainer.innerHTML += `
        <div class="item-holder">
            <div class="left-side">
                <img src="${imageURL}" alt="" class="image" style="margin-right: 15px;">
                <h3>${title}</h3>
            </div>
            <div class="right-side">
                <h3 style="margin-right: 20px;">Quantity : ${quantity}</h3>
                <h3>Price : ${price}</h3>
            </div>
        </div>
        `
        // ITEM SHOW
        
        // TOTAL ITEMS 

      }
    }
    itemsTotal.innerHTML += totalPrice
    lastTotal.innerHTML += totalPrice + 40
  });
  const buyNow = document.getElementById('buy-now');
  buyNow.addEventListener('click' , async(e) => {
    window.location.href = "order.html"
  });
});
