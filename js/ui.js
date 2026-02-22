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
        authLink.href = "/Project-Exam-1/post/create.html";
    }   else {
        authLink.textContent = "Log In";
        authLink.href = "/Project-Exam-1/account/login.html";
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

/* OPEN/CLOSE DROPDOWN-VIEWS */
/* Most popular view */
/* Categories view */
/* See all view */
const seeAllButton = document.querySelector(".click-down-views h2:nth-of-type(3) + button");
const seeAllView = document.querySelector(".see-all-view");
const closeViewBtn = document.querySelector(".btn-close-view");

seeAllButton?.addEventListener("click", () => {
    seeAllView.hidden = false;
    document.body.style.overflow = "";
});
closeViewBtn?.addEventListener("click", () => {
    seeAllView.hidden = true;
    document.body.style.overflow = "";
});
