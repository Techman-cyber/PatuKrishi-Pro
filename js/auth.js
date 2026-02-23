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

function setAuthMode(mode) {
  authMode = mode;

  const titleEl = document.getElementById("authTitle");
  const nameEl = document.getElementById("authName");

  if (!titleEl || !nameEl) return;

  titleEl.textContent = authMode === "login" ? "Login" : "Signup";
  nameEl.style.display = authMode === "signup" ? "block" : "none";
}

function toggleAuthMode() {
  const nextMode = authMode === "login" ? "signup" : "login";
  setAuthMode(nextMode);
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
      setAuthMode("login");
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

// Hero shortcuts
window.openHeroLogin = function () {
  setAuthMode("login");
  openModal("authModal");
};

window.openHeroSignup = function () {
  setAuthMode("signup");
  openModal("authModal");
};
