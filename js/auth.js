console.log("auth.js LOADED");

/* =========================
   Firebase Session Listener
========================= */
firebaseAuth.onAuthStateChanged(user => {
  const authButton = document.getElementById("authButton");

  if (!authButton) return;

  if (user) {
    authButton.textContent = `👤 ${user.displayName || "Farmer"} (Logout)`;
  } else {
    authButton.textContent = "Login";
  }
});

/* =========================
   Auth Modal Controls
========================= */
let authMode = "login"; // login | signup

function toggleAuthMode() {
  authMode = authMode === "login" ? "signup" : "login";

  document.getElementById("authTitle").textContent =
    authMode === "login" ? "Login" : "Signup";

  document.getElementById("authName").style.display =
    authMode === "signup" ? "block" : "none";
}

/* =========================
   Submit Login / Signup
========================= */
function submitAuth() {
  const email = document.getElementById("authEmail").value;
  const password = document.getElementById("authPassword").value;
  const name = document.getElementById("authName").value;

  if (!email || !password) {
    alert("Missing credentials");
    return;
  }

  if (authMode === "signup") {
    firebaseAuth
      .createUserWithEmailAndPassword(email, password)
      .then(cred => cred.user.updateProfile({ displayName: name }))
      .then(() => closeModal("authModal"))
      .catch(err => alert(err.message));
  } else {
    firebaseAuth
      .signInWithEmailAndPassword(email, password)
      .then(() => closeModal("authModal"))
      .catch(err => alert(err.message));
  }
}

/* =========================
   Navbar UI Update
========================= */
const authButton = document.getElementById("authButton");
const preferencesButton = document.getElementById("preferencesButton");

if (authButton) {
  authButton.addEventListener("click", (e) => {
    e.preventDefault();

    if (firebaseAuth.currentUser) {
      firebaseAuth.signOut();
    } else {
      openModal("authModal");
    }
  });
}

if (preferencesButton) {
  preferencesButton.addEventListener("click", (e) => {
    e.preventDefault();
    openPreferences();
  });
}
