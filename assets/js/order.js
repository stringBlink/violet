import { auth, db } from "./firebase-config.js";
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    arrayUnion,
    collection
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
    const orderForm = document.getElementById("orderForm");
    if (!orderForm) {
        console.error("Order form not found.");
        return;
    }

    let currentUser = null;

    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("User is authenticated:", user.uid);
            currentUser = user;
        } else {
            console.log("No user is signed in.");
            currentUser = null;
        }
    });

    orderForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!currentUser) {
            alert("You must be logged in to place an order.");
            return;
        }

        const name = document.getElementById("name")?.value.trim();
        const stPhone = document.getElementById("phone-1")?.value.trim();
        const ndPhone = document.getElementById("phone-2")?.value.trim();
        const address = document.getElementById("address")?.value.trim();

        if (!name || !stPhone || !ndPhone || !address) {
            alert("All fields are required.");
            return;
        }

        try {
            const userDocRef = doc(db, "orders", currentUser.uid); 
            const userDocSnap = await getDoc(userDocRef);

            // Generate an id 
            const newOrderId = doc(collection(db, "orders")).id;
            const orderCode = document.getElementById('order-code');
            orderCode.innerHTML += `${newOrderId}`
            // get the order details
            let ordersTitle = []
            let ordersQuantity = []
            let pricePerItem = []
                const docRef = doc(db, "carts", currentUser.uid);
                const docSnap = await getDoc(docRef);
                const data = docSnap.data()
                for (let index = 0; index < data.items.length; index++) {
                    let orderTitle = data.items[index].title
                    let price = data.items[index].price
                    let quantity = data.items[index].quantity
                    ordersTitle.push(orderTitle)
                    ordersQuantity.push(quantity)
                    pricePerItem.push(price)
                }
            // Create the new order object
            const today = new Date()
            const formattedDate = today.toISOString().split('T')[0];

            const newOrder = {
                id: newOrderId, 
                timestamp: formattedDate,
                quantity : ordersQuantity,
                ordersTitle :  ordersTitle,
                pricePerItem : pricePerItem
            };
            const userData = {
                userName: name,
                firstPhone: stPhone,
                secondPhone: ndPhone,
                address: address,
            }
            if (userDocSnap.exists()) {
                
                // Update existing document: Add the new order to the orders array
                await updateDoc(userDocRef, {
                    orders: arrayUnion(newOrder),
                    userData : userData
                });
            } else {
                // If the user has no document, create one with the first order
                await setDoc(userDocRef, {
                    orders: [newOrder],
                    userData : userData

                });
            }

            document.getElementById("order").style.display = "none"
            document.getElementById("order-submitted").style.display = "block"
            
            console.log("sdds" , newOrderId)
            
            orderForm.reset();
        } catch (error) {
            console.error("Error placing order:", error);
            alert("Failed to place order. Please try again.");
        }
    });
});
