// vendor.js
import { auth, db, logoutFuction } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { doc, onSnapshot } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

// DOM Elements
const addItems = document.getElementById("addItems");
const shopSetup = document.getElementById("ShopSetup");
const manageItems = document.getElementById("manageItems");
const orderView = document.getElementById("orderView");

const statusBadge = document.getElementById("statusBadge");
const venderName = document.getElementById("venderName");

// 1️⃣ Auth + Verification
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        // Not logged in → redirect to login page
        window.location.href = "login.html";
        return;
    }

    const docRef = doc(db, "users", user.uid);

    // Use onSnapshot to listen for live updates (like admin verification)
    onSnapshot(docRef, (docSnap) => {
        if (!docSnap.exists()) return;

        const data = docSnap.data();

        // Role check: only vendor allowed
        if (data.role !== "vender") {
            window.location.href = "login.html";
            return;
        }

        // Vendor Name display
        venderName.textContent = user.email;

        // Verification Badge
        if (data.isVerified) {
            statusBadge.textContent = "Verified";
            statusBadge.classList.add("bg-success");
            statusBadge.classList.remove("bg-danger");

            // Show dashboard if hidden
            document.getElementById("dashboard-section").classList.remove("d-none");
        } else {
            statusBadge.textContent = "Pending Approval";
            statusBadge.classList.add("bg-danger");
            statusBadge.classList.remove("bg-success");

            // Optional: hide dashboard until verified
            document.getElementById("dashboard-section").classList.add("d-none");
        }
    });
});

// 2️⃣ Section Toggle Logic

addItems.addEventListener("click", () => {
    document.getElementById("add-section").classList.remove("d-none");
    document.getElementById("manage-section").classList.add("d-none");
    document.getElementById("dashboard-section").classList.add("d-none");
    window.location.hash = "add";
});

manageItems.addEventListener("click", () => {
    document.getElementById("manage-section").classList.remove("d-none");
    document.getElementById("add-section").classList.add("d-none");
    document.getElementById("dashboard-section").classList.add("d-none");
    window.location.hash = "manage";
});

shopSetup.addEventListener("click", () => {
    document.getElementById("dashboard-section").classList.remove("d-none");
    document.getElementById("add-section").classList.add("d-none");
    document.getElementById("manage-section").classList.add("d-none");
    window.location.hash = "dashboard";
});                 










// vender logout 

document.addEventListener("DOMContentLoaded", () => {

    const logoutBtn = document.getElementById("venderLogout");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", logoutFuction);
  }

});