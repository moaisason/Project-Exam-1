import { getToken } from "./auth.js";

const API_BASE = "https://v2.api.noroff.dev";
const createForm = document.querySelector(".create-form");
const USERNAME = "Moa"

if (createForm) {
    createForm.addEventListener("submit", handleCreatePost);
}

async function handleCreatePost(e) {
    e.preventDefault();

    const token = getToken();

    if (!token) {
        alert("You must be logged in.");
        window.location.href = "/account/login.html";
        return;
    }

    const title = createForm.title.value.trim();
    const body = createForm.body.value.trim();
    const tags = createForm.tags.value 
            ? [createForm.tags.value.trim()]
            : [];
    const mediaUrl = createForm["media-url"].value.trim();
    const mediaAlt = createForm["media-alt"].value.trim();

    try {
        const response = await fetch(
           `${API_BASE}/blog/posts/${USERNAME}`,
           {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                title,
                body,
                tags,
                media: mediaUrl
                ? {
                    url: mediaUrl,
                    alt: mediaAlt || "Post image"
                }
                : undefined
            })
           } 
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.errors?.[0]?.message || "Failed to create post"
            );
        }

        alert("Post created");
        window.location.href = "/index.html";

    }   catch (error) {
        alert(error.message);
    }
}