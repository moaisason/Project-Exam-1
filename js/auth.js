const API_BASE = "https://v2.api.noroff.dev";

const registerForm = document.querySelector(".register-form");
const loginForm = document.querySelector(".login-form");

/* REGISTER AN ACCOUNT */
async function registerUser(name, email, password) {
    try {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.errors?.[0]?.message || "Register failed");
        }

        alert("Account created! Please log in.");
        window.location.href = "../account/login.html";

    }   catch (error) {
        alert(error.message);
    }  
}

/* LOGIN TO ACCOUNT */
async function loginUser(email, password) {
    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();
        console.log("LOGIN RESPONSE:", data);

        if (!response.ok) {
            throw new Error(data.errors?.[0]?.message || "Login failed");
        }

        saveToken(data.data.accessToken);
        window.location.href = "../index.html";

    }   catch (error) {
        alert(error.message);
    }  
}

/* STORE TOKENS */
function saveToken(token) {
    localStorage.setItem("accessToken", token);
}
export function getToken() {
    return localStorage.getItem("accessToken");
}
export function logout() {
    localStorage.removeItem("accessToken");
    window.location.href = "../index.html";
}

/* LISTEN DATA FORMS */
if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = registerForm.name.value.trim();
        const email = registerForm.email.value;
        const password = registerForm.password.value;

        registerUser(name, email, password);
    });
}

if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = loginForm.email.value;
        const password = loginForm.password.value;

        loginUser(email, password);
    });
}