import { loginFuction } from "./firebase.js";

const form = document.getElementById("loginForm");

form.addEventListener("submit", (e) => {

  e.preventDefault();   // page reload stop

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  console.log("Login values:", email, password);

  loginFuction(email, password);

});




