import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { getFirestore, doc, setDoc ,getDoc } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";
// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAU41PWjsFTNzbn2xwrULT4DQMtxzh1P8E",
  authDomain: "foodoria-22e7a.firebaseapp.com",
  projectId: "foodoria-22e7a",
  storageBucket: "foodoria-22e7a.firebasestorage.app",
  messagingSenderId: "731553454662",
  appId: "1:731553454662:web:cddc409c5f636bb63f0847"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);





// Signup function
function signUpFuction(email, password, role) {
  createUserWithEmailAndPassword(auth, email, password)
    .then( async(userCredential) => {
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: email,
        role: role,
      });
      console.log("Signup successful:", userCredential.user.email);
      window.location.href = "login.html"; // redirect after signup
    })
    .catch((error) => {
      console.log("Signup error:", error.message);
      alert(error.message);
    });
}

// Login function
 function loginFuction(email, password) {

  setPersistence(auth, browserLocalPersistence)
    .then(() => {
      return signInWithEmailAndPassword(auth, email, password);
    })
    .then(async (userCredential) => {

      const user = userCredential.user;
      const docSnap = await getDoc(doc(db, "users", user.uid));

      if (docSnap.exists()) {

        const role = docSnap.data().role;

        if (role === "user") {
          window.location.href = "ordernow.html";
        }
        else if (role === "vender") {
          window.location.href = "vender.html";   
        }
        else {
          alert("Role not found");
        }

      } else {
        alert("User data not found in database");
      }

      console.log("Login successful:", userCredential.user.email);

    })
    .catch((error) => {
      console.log("Login error:", error.message);
      alert(error.message);
    });

}

// getuserloggedin

function getUserLoggedIn() {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      // User not logged in → login page
      window.location.href = "login.html";
      return;
    }

    // User is logged in → role check & redirect if needed
    const docSnap = await getDoc(doc(db, "users", user.uid));
    if (!docSnap.exists()) return;

    const role = docSnap.data().role;
    if (role === "user" && !window.location.href.includes("ordernow.html")) {
      window.location.href = "ordernow.html";
    } 
    else if (role === "vendor" && !window.location.href.includes("vendor.html")) {
      window.location.href = "vendor.html";
    }
  });
}






function logout() {

  signOut(auth).then(() => {
    // Sign-out successful.

    window.location = "login.html";
  }).catch((error) => {
    // An error happened.
  });
}




function checkLoginAndRedirect() {

  onAuthStateChanged(auth, (user) => {

    if (user) {
      console.log("User logged in", user.email);
    }
    else {
      console.log("User NOT logged in");
    }

  });

}


export { signUpFuction, loginFuction, getUserLoggedIn, auth, logout, checkLoginAndRedirect };




