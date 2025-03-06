import { auth , db } from "./firebase-config.js";
import {
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  collection,
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

const handleUpload = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "productsImages");

  try {
    const response = await fetch("https://api.cloudinary.com/v1_1/dczgow9b0/image/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    return data.secure_url || null;
  } catch (error) {
    return null;
  }
};

const addProductForm = document.getElementById("add-product-form");
const addProductButton = document.getElementById("add-item-button");
const removeProductButton = document.getElementById("remove-item-button");
const removeProductForm = document.getElementById("remove-product-form");
const productImageInput = document.getElementById("productImage");

addProductForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!productImageInput.files.length) {
    alert("Please upload an image.");
    return;
  }
  const productImage = productImageInput.files[0];
  const imageUrl = await handleUpload(productImage);
  console.log('URL:', imageUrl);

  const productPrice = document.getElementById("product-price").value;
  const productName = document.getElementById("product-name").value;
  const productType = document.getElementById("product-type").value;

  try {
    await setDoc(doc(db, productType, productName), {
      title: productName,
      price: productPrice,
      imageURL: imageUrl, 
    });
    alert("Product added successfully!");
  } catch (error) {
    console.error("Error uploading file or saving data:", error);
  }
});

const toggleVisibility = (element) => {
  element.style.display = element.style.display === "none" ? "block" : "none";
};

addProductButton.addEventListener("click", (e) => {
  e.preventDefault();
  toggleVisibility(addProductForm);
});

removeProductButton.addEventListener("click", (e) => {
  e.preventDefault();
  toggleVisibility(removeProductForm);
});

removeProductForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const productRemoveName = document.getElementById("product-name-remove").value;
  const productType = document.getElementById("product-type-remove").value;
  await deleteDoc(doc(db, productType, productRemoveName));
  alert("Item Deleted");
});

document.addEventListener("DOMContentLoaded", async () => {
  const itemHolder = document.getElementById("item-holder");
  const querySnapshot = await getDocs(collection(db, "orders"));
  let todayOrders = [];
  let allOrders = [];
  const todayDate = new Date().toISOString().split("T")[0];
  
  querySnapshot.forEach((doc) => {
    let data = doc.data();
    let orders = data.orders;
    let username = data.userData.userName;
    let address = data.userData.address;
    let firstPhone = data.userData.firstPhone;
    let secondPhone = data.userData.secondPhone;

    orders.forEach((order) => {
      let { ordersTitle, quantity, pricePerItem, id, timestamp } = order;
      ordersTitle.forEach((title, i) => {
        let orderHTML = `
        <div class="order">
          <h4>اسم المنتج: ${title}</h4>
          <h4>الكمية: ${quantity[i]}</h4>
          <h4>السعر للواحدة: ${pricePerItem[i]}</h4>
          <h4>كود الاوردر: ${id}</h4>
          <h4>وقت الطلب: ${timestamp}</h4>
          <div class="opener" data-target="${title}"><i class="fa-solid fa-arrow-down"></i></div>
        </div>
        <div class="user-details hidden" id="${title}">
          <h2>البيانات</h2>
          <h4>الاسم: ${username}</h4>
          <h4>رقم الهاتف 1: ${firstPhone}</h4>
          <h4>رقم الهاتف 2: ${secondPhone}</h4>
          <h4>العنوان: ${address}</h4>
        </div>`;
        
        if (timestamp.split("T")[0] === todayDate) {
          todayOrders.push(orderHTML);
        }
        allOrders.push(orderHTML);
      });
    });
  });

  const renderOrders = (orders) => {
    itemHolder.innerHTML = "";
    orders.forEach(orderHTML => {
      itemHolder.innerHTML += orderHTML;
    });
  };

  renderOrders(allOrders);

  document.getElementById("todayCheck").addEventListener("change", function () {
    if (this.checked) {
      renderOrders(todayOrders);
    } else {
      renderOrders(allOrders);
    }
  });

  document.addEventListener("click", function (event) {
    let opener = event.target.closest(".opener");
    if (opener) {
      let targetId = opener.getAttribute("data-target");
      let detailsElement = document.getElementById(targetId);
      if (detailsElement) {
        detailsElement.classList.toggle("hidden");
      }
    }
  });
});
