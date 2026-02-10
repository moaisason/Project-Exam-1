import { getToken } from "./auth.js";

/* CREATE A POST */
const API_BASE = "https://v2.api.noroff.dev";
const createForm = document.querySelector(".create-form");
const USERNAME = "Moa"

if (createForm) {
    createForm.addEventListener("submit", handleCreatePost);
}

async function handleCreatePost(e) {
    e.preventDefault();

    const token = getToken();

    /* Check for authorization */
    if (!token) {
        alert("You must be logged in.");
        window.location.href = "/account/login.html";
        return;
    }

    /* Store post in API */
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

/* GET POST FROM API */
async function fetchPosts() {
    try {
        const response = await fetch(
            `${API_BASE}/blog/posts/${USERNAME}?_sort=created&_order=desc`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error("Failed to fetch posts");
        }
        renderPosts(data.data);

    }   catch (error) {
        console.error(error);
    }
}

/* SHOW POST IN CAROUSEL */
function renderPosts(posts) {
    const container = document.querySelector(".carousel");

    if (!container) return;
    container.innerHTML = "<h2>Latest posts</h2>";
    posts.slice(0, 12).forEach(post => {
        const card = document.createElement("article");
        card.classList.add("post-card");

        card.innerHTML = `
        <img src="${post.media?.url || "/images/fallback.jpg"}"
            alt="${post.media?.alt || post.title}">
        <h3>${post.title}</h3>
        <p>${post.body?.slice(0, 80) || ""}...</p>
        `;
        container.appendChild(card);
    });
}

fetchPosts();