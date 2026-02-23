import { auth, logout, checkLoginAndRedirect } from './firebase.js';

document.addEventListener("DOMContentLoaded", () => {

  checkLoginAndRedirect(); // state check on page load

  const orderBtn = document.getElementById("orderBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  if (orderBtn) {
    orderBtn.addEventListener("click", () => {

      const user = auth.currentUser;

      if (user) {
        window.location.href = "ordernow.html";
      } else {
        window.location.href = "login.html";
      }

    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }

});