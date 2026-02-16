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

nextBtn?.addEventListener("click", () => {
    const cards =document.querySelectorAll(".post-card");
    if (currentIndex < cards.length - 2) {
        currentIndex++;
        updateCarousel();
    }
});

prevBtn?.addEventListener("click", () => {
    if  (currentIndex > 1) {
    currentIndex--;
    updateCarousel();
    }
});

viewport?.addEventListener("scroll", () => {
    const cards = document.querySelectorAll(".post-card");
    const center = viewport.scrollLeft + viewport.offsetWidth / 2;

    let closest = 0;
    let minDistance = Infinity;

    cards.forEach((card, index) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(center - cardCenter);

        if (distance < minDistance) {
            minDistance = distance;
            closest = index;
        }
    });

    currentIndex = closest;
    updateCarousel();
});