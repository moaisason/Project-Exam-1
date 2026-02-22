import { getToken, logout } from "./auth.js";
/* import { setupInfiniteLoop} from "./carousel.js"; */

const API_BASE = "https://v2.api.noroff.dev";

/* ERROR HELPER */
function showError(container, message) {
    if (!container) return;

    container.innerHTML = `
    <div class="error-message">
        <p>${message}</p>
        <a href="../index.html">Back to home</a>
    </div>
    `;

    console.error(message);
}

/* CREATE A POST */
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
        window.location.href = "../account/login.html";
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

        /* Error handling */
        if (response.status === 401) {
            logout();
            alert("Session expired. Please log in again.");
            return;
        }

        if (!response.ok) {
            throw new Error(
                data.errors?.[0]?.message || "Failed to create post"
            );
        }

        alert("Post created");
        window.location.href = "../index.html";

    }   catch (error) {
        alert(error.message);
    }
}

/* GET POSTS FROM API */
async function fetchPosts() {

    /* Show loading indicator */
    const track =document.querySelector(".carousel-track");
    if (track) {
        track.innerHTML = "<p class='loader'></p>";
    }

    try {
        const response = await fetch(
            `${API_BASE}/blog/posts/${USERNAME}?_sort=created&_order=desc`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error("Failed to fetch posts");
        }
        renderPosts(data.data);
        /* setupInfiniteLoop(); */
        renderAllPosts(data.data);

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
        <a href="post/index.html?id=${post.id}" class="post-link">
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

/* SHOW POSTS IN SEE ALL VIEW */
function renderAllPosts(posts) {
    const list = document.querySelector(".all-posts-list");

    if (!list) return;

    list.innerHTML = "";
    posts.forEach((post) => {
        const article = document.createElement("article");
        article.classList.add("see-all-card");

        article.innerHTML = `
        <a href="post/index.html?id=${post.id}" class="post-link">
            <img src="${post.media?.url || "/images/fallback.jpg"}"
                alt="${post.media?.alt || post.title}">
            <div class="card-overlay">
                <h3>${post.title}</h3>
                <p>${new Date(post.created).toLocaleDateString()}</p>
            </div>
        </a>
        `;
        list.appendChild(article);
    });
}

function getPostIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

/* GET POST FROM API */
async function fetchSinglePost() {
    const postId = getPostIdFromUrl();
    const container = document.querySelector(".blog-post");

    if (!container) return;
    
    /* Show loading indicator */
    container.innerHTML = `
        <div class="loader">
        </div>
    `;

    if (!postId) {
        if (container) {
            container.innerHTML = "<p>Post not found.</p>";
        }
        return;
    }

    try {
        const response = await fetch(
            `${API_BASE}/blog/posts/${USERNAME}/${postId}`
        );

        if (!response.ok) {
            showError(container, "Failed to fetch post");
            return;
        }

        const data = await response.json();
        renderSinglePost(data.data);
        
    }   catch (error) {
            if (container) {
                container.innerHTML = `
                <div class="post-not-found">
                    <h2>Post not found</h2>
                    <p>The post you are looking for does not exist.</p>
                        <a href="../index.html" class="btn-delete">Back to home</a>
                </div>
                `;
            }
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
        <p class="post-date">
            ${new Date(post.created).toLocaleDateString()}
        </p>
        <header class="post-header">
        <h1>${post.title}</h1>
        <img src="${post.media?.url || "/images/fallback.jpg"}"
            alt="${post.media?.alt || post.title}">
        </header>

        <section class="post-content">
            <p>${post.body}</p>
        </section>

        <footer class="post-actions">
                <p class="post-author">By ${post.author?.name || "Unknown"}</p>
                <button class="btn-share" aria-label="Share this post">
                    <img src="../icons/paper-plane.png" alt="" aria-hidden="true">
                </button>
                <button aria-label="Love this post">
                    <img src="../icons/heart.png" alt="" aria-hidden="true">
                </button>
            </footer>
        
        ${
            isOwner
            ?`
            <div class="post-controls">
                <a href="edit.html?id=${post.id}" class="btn-edit">Edit</a>
            </div>
            `
            :""
        }
    `;

    /* SHARE POST */
    const shareBtn = document.querySelector(".btn-share");

    if (shareBtn) {
        shareBtn.addEventListener("click", async () => {
            const shareUrl = window.location.href;

            if (navigator.share) {
                try {
                    await navigator.share({
                        title: document.title,
                        url: shareUrl
                    });
                } catch (error) {
                    console.error("Share cancelled", error);
                }
            } else {
                try {
                    await navigator.clipboard.writeText(shareUrl);
                    alert("Link copied to clipboard!");
                } catch (error) {
                    alert("Unable to share link.");
                }
            }
        });
    }
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
        window.location.href = "../account/login.html";
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

        /* Error handling */
        if (response.status === 401) {
            logout();
            alert("Session expired. Please log in again.");
            return;
        }

        if (!response.ok) {
            throw new Error(
                data.errors?.[0]?.message || "Failed to update post"
            );
        }

        alert("Post updated");
        window.location.href = `../post/index.html?id=${postId}`;

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
        window.location.href = "../account/login.html";
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

        /* Error handling */
        if (response.status === 401) {
            logout();
            alert("Session expired. Please log in again.");
            return;
        }
        
        if (!response.ok) {
            throw new Error("Failed to delete post");
        }

        alert("Post deleted");
        window.location.href = "../index.html";

    }   catch (error) {
        alert(error.message);
    }
}