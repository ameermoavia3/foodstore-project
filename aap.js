import { signUpFuction } from "./firebase.js";

const form = document.getElementById("signupForm");

form.addEventListener("submit", (e) => {

  e.preventDefault();   // 🔥 page reload stop

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;

  console.log("Signup values:", email, password);

  signUpFuction(email, password, role);

});








