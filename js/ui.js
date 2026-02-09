import { getToken, logout } from "./auth.js";

/* OPEN AND CLOSE ASIDE WITH OVERLAY*/
const menuButton = document.querySelector('.btn-menu');
const closeButton = document.querySelector('.menu-panel .btn-close');
const menuPanel = document.querySelector('.menu-panel');
const overlay = document.querySelector('.menu-overlay');

function openMenu() {
/* Open aside when clicking btn.menu */
    menuPanel.classList.add('is-open');
    menuPanel.setAttribute('aria-hidden', 'false');
    overlay.classList.add('is-visible');
    overlay.setAttribute('aria-hidden', 'false');
}
function closeMenu() {
/* Close menu when clicking on btn-close */
    menuPanel.classList.remove('is-open');
    menuPanel.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('is-visible');
    overlay.setAttribute('aria-hidden', 'true');
}

menuButton.addEventListener('click', openMenu);
closeButton.addEventListener('click', closeMenu);
overlay.addEventListener('click', closeMenu);

/* Close aside by pressing escape-key */
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeMenu();
    }
});

/* CHANGE HEADER WHEN LOGGED IN & REDIRECT */
const authLink = document.querySelector(".nav-auth-link");
const logoutBtn = document.querySelector(".btn-logout");

const token = getToken();

if (authLink) {
    if (token) {
        authLink.textContent = "Create";
        authLink.href = "/post/create.html";
    }   else {
        authLink.textContent = "Log In";
        authLink.href = "/account/login.html";
    }
}

/* SHOW LOGOUT ONLY WHEN LOGGED IN */
if (logoutBtn) {
    if (!token) {
        logoutBtn.style.display = "none";
    }   else  {
        logoutBtn.addEventListener("click", logout);
    }
}