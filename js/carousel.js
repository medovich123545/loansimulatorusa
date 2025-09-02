document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".carousel-track");
  const slides = Array.from(track.children);
  const prevBtn = document.querySelector(".nav-left");
  const nextBtn = document.querySelector(".nav-right");
  const indicatorsContainer = document.querySelector(".carousel-indicators");
  const slideGap = 24;
  let slideWidth = slides[0].getBoundingClientRect().width + slideGap;

  // Clonage pour boucle infinie
  const firstClone = slides[0].cloneNode(true);
  const lastClone = slides[slides.length - 1].cloneNode(true);
  firstClone.id = "first-clone";
  lastClone.id = "last-clone";
  track.appendChild(firstClone);
  track.insertBefore(lastClone, track.firstChild);
  const allSlides = Array.from(track.children);
  let currentIndex = 1;

  // Position initiale
  track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;

  // Création des indicateurs
  const realSlidesCount = slides.length;
  for (let i = 0; i < realSlidesCount; i++) {
    const dot = document.createElement("button");
    dot.classList.add("indicator");
    if (i === 0) dot.classList.add("active");
    dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
    dot.addEventListener("click", () => {
      currentIndex = i + 1;
      updateCarousel();
    });
    indicatorsContainer.appendChild(dot);
  }
  const indicators = Array.from(indicatorsContainer.children);

  function updateCarousel(animate = true) {
    track.style.transition = animate ? "transform 0.4s ease-in-out" : "none";
    track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;

    // Mise à jour des indicateurs
    const realIdx = (currentIndex - 1 + realSlidesCount) % realSlidesCount;
    indicators.forEach((dot, idx) => dot.classList.toggle("active", idx === realIdx));
  }

  // Gestion boucle infinie
  track.addEventListener("transitionend", () => {
    if (allSlides[currentIndex].id === "first-clone") {
      track.style.transition = "none";
      currentIndex = 1;
      track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
    }
    if (allSlides[currentIndex].id === "last-clone") {
      track.style.transition = "none";
      currentIndex = realSlidesCount;
      track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
    }
  });

  // Flèches
  nextBtn.addEventListener("click", () => {
    currentIndex++;
    updateCarousel();
  });
  prevBtn.addEventListener("click", () => {
    currentIndex--;
    updateCarousel();
  });

  // Swipe tactile
  let startX = 0;
  track.addEventListener("pointerdown", e => startX = e.clientX);
  track.addEventListener("pointerup", e => {
    const diff = e.clientX - startX;
    if (diff > 50) prevBtn.click();
    else if (diff < -50) nextBtn.click();
  });

  // Ajustement au redimensionnement
  window.addEventListener("resize", () => {
    slideWidth = slides[0].getBoundingClientRect().width + slideGap;
    track.style.transition = "none";
    track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
  });
});
