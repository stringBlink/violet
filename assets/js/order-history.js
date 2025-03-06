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

document.addEventListener("DOMContentLoaded", () => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      uid = user.uid;
      console.log("uid ", uid);
      const docRef = doc(db, "orders", uid);
      const docSnap = await getDoc(docRef);
      const data = docSnap.data();
      const orders = data.orders;
      let id, ordersTitle, pricePerItem, quantityPerItem ;

      for (let index = 0; index < data.orders.length; index++) {
        id = orders[index].id;
        ordersTitle = orders[index].ordersTitle;
        pricePerItem = orders[index].pricePerItem;
        quantityPerItem = orders[index].quantity;
        
        for (let index = 0; index < ordersTitle.length; index++) {
          const container = document.getElementById("container");

          container.innerHTML += `
                   <div class="item-holder">
            <div class="righ">
                <h3 id="product-title">اسم المنتج : ${ordersTitle[index]}</h3>
            </div>
                <h3 id="quantity">الكمية : ${quantityPerItem[index]}</h3>
                <h3 id="price">السعر للقطعة  : ${pricePerItem[index]}</h3>
                <h3 id="order-code">كود الاوردر : ${id}</h3>
        </div>
           `;
        }
      }
    }
  });
});
