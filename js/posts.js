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

/* GET POSTS FROM API */
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

/* SHOW POSTS IN CAROUSEL */
function renderPosts(posts) {
    const track = document.querySelector(".carousel-track");

    if (!track) return;

    track.innerHTML = "";
    posts.slice(0, 12).forEach((post, index) => {
        const card = document.createElement("article");
        card.classList.add("post-card");

        if (index === 1) {
            card.classList.add("active");
        }

        card.innerHTML = `
        <a href="/post/index.html?id=${post.id}" class="post-link">
            <img src="${post.media?.url || "/images/fallback.jpg"}"
                alt="${post.media?.alt || post.title}">
            <div class="card-overlay">
                <h3>${post.title}</h3>
            </div>
        </a>
        `;
        track.appendChild(card);
    });
}

function getPostIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

/* GET POST FROM API */
async function fetchSinglePost() {
    const postId = getPostIdFromUrl();
    if (!postId) return;

    try {
        const response = await fetch(
            `${API_BASE}/blog/posts/${USERNAME}/${postId}`
        );
        const data = await response.json();

        if (!response.ok) {
            throw new Error("Failed to fetch post");
        }
        renderSinglePost(data.data);
    }   catch (error) {
        console.error(error);
    }
}

/* RENDER POST ON BLOG POST PAGE */
function renderSinglePost(post) {
    const container = document.querySelector(".blog-post");

    if (!container) return;

    /* Show controls only to owner */
    const token = getToken();
    const isOwner = post.author?.name === USERNAME && token;

    container.innerHTML = `
        <header class="post-header">
        <h1>${post.title}</h1>
        <img src="${post.media?.url || "/images/fallback.jpg"}"
            alt="${post.media?.alt || post.title}">
        </header>

        <section class="post-content">
            <p>${post.body}</p>
        </section>
        
        ${
            isOwner
            ?`
            <div class="post-controls">
                <a href="/post/edit.html?id=${post.id}" class="btn-edit">Edit</a>
            </div>
            `
            :""
        }
    `;
}

if (document.querySelector(".carousel")) {
    fetchPosts();
}

if (document.querySelector(".blog-post")) {
    fetchSinglePost();
}

/* CONNECT EDIT & DELETE-BUTTON */
const editForm = document.querySelector(".edit-form");
const deleteBtn = document.querySelector(".btn-delete");

if (editForm) {
    loadPostForEdit();
    editForm.addEventListener("submit", handleEditPost);
}

if (deleteBtn) {
    deleteBtn.addEventListener("click", () => {
        const postId = getPostIdFromUrl();
        if (!postId) return;

        if (confirm("Are you sure you want to delete this post?")) {
            deletePost(postId);
        }
    });
}

/* GET POST FROM API FOR EDITING */
async function loadPostForEdit() {
    const postId = getPostIdFromUrl();
    if (!postId) return;

    try {
        const response = await fetch(
            `${API_BASE}/blog/posts/${USERNAME}/${postId}`
        );
        const data =await response.json();
        const post = data.data;

        editForm.title.value = post.title;
        editForm.body.value = post.body;
        editForm["media-url"].value = post.media?.url || "";
        editForm["media-alt"].value = post.media?.alt || "";
  
    }   catch (error) {
        console.error(error);
    }
}

/* GET UPDATED POST AND RENDER */
async function handleEditPost(e) {
    e.preventDefault();
    const token = getToken();
    const postId = getPostIdFromUrl();

    /* Check for authorization */
    if (!token) {
        alert("You must be logged in.");
        window.location.href = "/account/login.html";
        return;
    }

    /* Store updated post on API*/
    const title = editForm.title.value.trim();
    const body = editForm.body.value.trim();
    const tags = editForm.tags.value 
            ? [editForm.tags.value.trim()]
            : [];
    const mediaUrl = editForm["media-url"].value.trim();
    const mediaAlt = editForm["media-alt"].value.trim();

    try {
        const response = await fetch(
           `${API_BASE}/blog/posts/${USERNAME}/${postId}`,
           {
            method: "PUT",
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
                : null
            })
           } 
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.errors?.[0]?.message || "Failed to update post"
            );
        }

        alert("Post updated");
        window.location.href = `/post/index.html?id=${postId}`;

    }   catch (error) {
        alert(error.message);
    }
}

/* DELETING ONE'S OWN POSTS */
async function deletePost(postId) {
    const token = getToken();

    /* Check for authorization */
    if (!token) {
        alert("You must be logged in.");
        window.location.href = "/account/login.html";
        return;
    }

    try {
        const response = await fetch(
            `${API_BASE}/blog/posts/${USERNAME}/${postId}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            throw new Error("Failed to delete post");
        }

        alert("Post deleted");
        window.location.href = "/index.html";

    }   catch (error) {
        alert(error.message);
    }
}