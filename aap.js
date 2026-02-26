import { signUpFuction } from "./firebase.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signupForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const userName = document.getElementById("userName").value; // fixed
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    console.log("Signup values:", email, password, role);

    signUpFuction(userName, email, password, role);
  });
});








