function scrollToGallery() {
  document.querySelector("#gallery").scrollIntoView({
    behavior: "smooth",
  });
}

// modal

function openModal(img) {
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImg");

  modal.style.display = "block";
  modalImg.src = img.src;
}

function closeModal() {
  document.getElementById("imageModal").style.display = "none";
}

// typing animation

const text = "Asyifa";

let i = 0;

function typing() {
  if (i < text.length) {
    document.querySelector(".typing").textContent += text.charAt(i);

    i++;

    setTimeout(typing, 120);
  }
}

typing();

// scroll animation

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
});

document.querySelectorAll(".scroll").forEach((el) => {
  observer.observe(el);
});

// navbar active + progress bar

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;

    if (pageYOffset >= sectionTop - 100) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");

    if (link.getAttribute("href") == "#" + current) {
      link.classList.add("active");
    }
  });

  // navbar shadow

  const navbar = document.querySelector(".navbar");

  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }

  // progress bar

  const winScroll =
    document.body.scrollTop || document.documentElement.scrollTop;
  const height =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;

  const scrolled = (winScroll / height) * 100;

  document.querySelector(".progress-bar").style.width = scrolled + "%";
});

const textArray = [
  "The Most Beautiful Girl In My Life",
  "My Favorite Person",
  "The Reason I Smile Every Day",
];

let index = 0;
let charIndex = 0;

function typeEffect() {
  const element = document.querySelector(".typing");

  if (charIndex < textArray[index].length) {
    element.textContent += textArray[index].charAt(charIndex);

    charIndex++;

    setTimeout(typeEffect, 80);
  } else {
    setTimeout(() => {
      element.textContent = "";
      charIndex = 0;
      index = (index + 1) % textArray.length;
      typeEffect();
    }, 2000);
  }
}

typeEffect();
