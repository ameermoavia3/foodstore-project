import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";
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
function signUpFuction(name, email, password, role) {
  createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;

      const isVerified = role === "vender" ? false : true;

      await setDoc(doc(db, "users", user.uid), {
        name : name,
        email: email,
        role: role,
        isVerified: isVerified
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
        } else if(role === "admin") {
          window.location.href = "admin.html";
        }
        
        else if (role === "vender") {
          const isVerified = docSnap.data().isVerified;

          if (isVerified === true) {
            window.location.href = "vender.html";
          } else {
            alert("Your account is pending admin verification. Please wait.");
            auth.signOut();
          }
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

  
  console.log("Admin authorized");
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



function logoutFuction() {
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





function getUserDetails() {
  

const q = query(collection(db, "users"), where("state", "==", "CA"));
const unsubscribe = onSnapshot(q, (querySnapshot) => {
  const cities = [];
  querySnapshot.forEach((doc) => {
      cities.push(doc.data().name);
  });
  console.log("Current cities in CA: ", cities.join(", "));
});
}


export { signUpFuction, loginFuction, getUserLoggedIn, auth, logout, checkLoginAndRedirect, db, logoutFuction, getUserDetails};

