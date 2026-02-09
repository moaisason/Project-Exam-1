import { getToken } from "./auth.js";

/* REMOVE ACCESS WITHOUT TOKEN */
if (!getToken()) {
    window.location.href = "/account/login.html";
}