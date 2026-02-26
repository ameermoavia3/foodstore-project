import { auth, db } from "./firebase.js";
import { getDoc, doc, collection, query, where, onSnapshot, updateDoc } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

// Admin page guard + real-time pending vendors table
export function adminPageGuardWithTable() {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "login.html";
      return;
    }

    const docSnap = await getDoc(doc(db, "users", user.uid));
    if (!docSnap.exists()) {
      window.location.href = "login.html";
      return;
    }

    const role = docSnap.data().role;
    if (role !== "admin") {
      window.location.href = "login.html";
      return;
    }

    console.log("Admin authorized ✅");

    // Admin confirmed → setup real-time pending vendors table
    setupPendingVendorsTable();
  });
}

// Real-time pending vendors table
function setupPendingVendorsTable() {
  const pendingVendorsQuery = query(
    collection(db, "users"),
    where("role", "==", "vender"),
    where("isVerified", "==", false)
  );

  onSnapshot(pendingVendorsQuery, (snapshot) => {
    const tableBody = document.getElementById("pendingVendorsTableBody");
    tableBody.innerHTML = ""; // clear old rows

    snapshot.forEach((doc) => {
      const vender = doc.data();
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${vender.email}</td>
        <td>${vender.role}</td>
        <td>${new Date(vender.signupDate.seconds * 1000).toLocaleDateString()}</td>
        <td>${vender.isVerified ? "Verified" : "Pending"}</td>
        <td><button class="btn btn-success btn-sm verify-btn" data-id="${doc.id}">Verify</button></td>
      `;

      tableBody.appendChild(row);
    });

    // Attach click event for verify buttons
    document.querySelectorAll(".verify-btn").forEach((button) => {
      button.addEventListener("click", async () => {
        const id = button.getAttribute("data-id");
        await verifyVendor(id);
      });
    });
  });
}

// Verify vendor function
async function verifyVender(venderId) {
  const venderRef = doc(db, "users", venderId);
  await updateDoc(venderRef, { isVerified: true });
  console.log(`Vender ${venderId} verified! ✅`);
}