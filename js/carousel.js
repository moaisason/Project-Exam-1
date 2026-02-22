let currentIndex = 1;

const track = document.querySelector(".carousel-track");
const viewport = document.querySelector(".carousel-viewport");
const prevBtn = document.querySelector(".carousel-btn.prev");
const nextBtn = document.querySelector(".carousel-btn.next");

function updateCarousel() {
    const cards = document.querySelectorAll(".post-card");
    if (!cards.length) return;

    cards.forEach(card => card.classList.remove("active"));

    if (cards[currentIndex]) {
    cards[currentIndex].classList.add("active");
    }
};

function centerCard(index, smooth = true) {
    const cards = document.querySelectorAll(".post-card");
    if (!cards.length) return;

    if (index < 0) index = cards.length - 1;
    if (index >= cards.length) index = 0;

    currentIndex = index;

    cards.forEach(card => card.classList.remove("active"));

    const activeCard = (cards[currentIndex])
    activeCard.classList.add("active");

    const viewportCenter = viewport.offsetWidth / 2;
    const cardCenter = activeCard.offsetLeft + activeCard.offsetWidth / 2;
    const scrollPosition = cardCenter - viewportCenter;

    viewport.scrollTo({
        left: scrollPosition,
        behavior: smooth ? "smooth" : "auto"
    });
}

/* Scroll by clicking buttons */
nextBtn?.addEventListener("click", () => {
    centerCard(currentIndex + 1);
});

prevBtn?.addEventListener("click", () => {
    centerCard(currentIndex - 1);
    
});


viewport?.addEventListener("scroll", () => {
    const cards = document.querySelectorAll(".post-card");
    if (!cards.length) return;

    const center = viewport.scrollLeft + viewport.offsetWidth / 2;

    let closestIndex = 0;
    let smallestDistance = Infinity;

    cards.forEach((card, index) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(center - cardCenter);

        if (distance < smallestDistance) {
            smallestDistance = distance;
            closestIndex = index;
        }
    });

    cards.forEach(card => card.classList.remove("active"));
    cards[closestIndex].classList.add("active");

    currentIndex = closestIndex;
});

window.addEventListener("load", () => {
    setTimeout(() => {
        centerCard(1, false);
    }, 150);
});

/*
let currentIndex = 1;
let isCloningDone = false;

const viewport = document.querySelector(".carousel-viewport");
const prevBtn = document.querySelector(".carousel-btn.prev");
const nextBtn = document.querySelector(".carousel-btn.next");

function getCards() {
    return document.querySelectorAll(".post-card");
}

/* Infinite loop scroll /
export function setupInfiniteLoop() {
    const track = document.querySelector(".carousel-track");
    const cards = getCards();

    if (!cards.length || isCloningDone) return;

    const firstClone = cards[0].cloneNode(true);
    const lastClone = cards[cards.length - 1].cloneNode(true);

    firstClone.classList.add("clone");
    lastClone.classList.add("clone");

    track.appendChild(firstClone);
    track.prepend(lastClone);

    isCloningDone = true;

    setTimeout(() => {
        centerCard(1, false);
    }, 150);
}

/* Center active card /
function centerCard(index, smooth = true) {
    const cards = getCards();
    if (!cards.length) return;

    currentIndex = index;

    cards.forEach(card => card.classList.remove("active"));

    const activeCard = (cards[currentIndex])
    activeCard.classList.add("active");

    const viewportCenter = viewport.offsetWidth / 2;
    const cardCenter = activeCard.offsetLeft + activeCard.offsetWidth / 2;
    const scrollPosition = cardCenter - viewportCenter;

    viewport.scrollTo({
        left: scrollPosition,
        behavior: smooth ? "smooth" : "auto"
    });
}

/* Scroll by clicking buttons /
nextBtn?.addEventListener("click", () => {
    centerCard(currentIndex + 1);
});

prevBtn?.addEventListener("click", () => {
    centerCard(currentIndex - 1);
    
});

/* Change active card on scroll /
viewport?.addEventListener("scroll", () => {
    const cards = getCards();
    if (!cards.length) return;

    const viewportCenter = viewport.scrollLeft + viewport.offsetWidth / 2;

    let closestIndex = 0;
    let smallestDistance = Infinity;

    cards.forEach((card, index) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(viewportCenter - cardCenter);

        if (distance < smallestDistance) {
            smallestDistance = distance;
            closestIndex = index;
        }
    });
    
    currentIndex = closestIndex;

    cards.forEach(card => card.classList.remove("active"));
    cards[currentIndex].classList.add("active");

    if (cards[currentIndex].classList.contains("clone") &&
        currentIndex === cards.length - 1) {

        setTimeout(() => {
            centerCard(1, false);
        }, 0);
    }

    if (cards[currentIndex].classList.contains("clone") &&
        currentIndex === 0) {

        setTimeout(() => {
            centerCard(cards.length - 2, false);
        }, 0);
    }
});
*/