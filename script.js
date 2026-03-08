// background music — play saat user klik tombol Enter

const bgMusic = document.getElementById("bgMusic");

function enterSite() {
  // Play musik langsung dalam gesture ini (sah oleh browser)
  bgMusic.play().catch((err) => {
    console.warn("Music play failed:", err);
  });

  // Fade out & sembunyikan overlay
  const overlay = document.getElementById("introOverlay");
  overlay.classList.add("overlay-hide");
  setTimeout(() => { overlay.style.display = "none"; }, 800);
}

// lyrics diimport dari lyrics.js


const lyricEl = document.getElementById("currentLyric");
let lastIndex = -1;

bgMusic.addEventListener("timeupdate", () => {
  const t = bgMusic.currentTime;

  // Cari baris lirik yang aktif saat ini
  let activeIndex = -1;
  for (let i = lyrics.length - 1; i >= 0; i--) {
    if (t >= lyrics[i].time) {
      activeIndex = i;
      break;
    }
  }

  if (activeIndex === lastIndex) return;
  lastIndex = activeIndex;

  const text = activeIndex >= 0 ? lyrics[activeIndex].text : "";

  // Fade out → ganti teks → fade in
  lyricEl.classList.remove("lyric-visible");
  lyricEl.classList.add("lyric-hidden");

  setTimeout(() => {
    lyricEl.textContent = text;
    lyricEl.classList.remove("lyric-hidden");
    lyricEl.classList.add("lyric-visible");
  }, 350);
});


function scrollToGallery() {
  document.querySelector("#gallery").scrollIntoView({
    behavior: "smooth",
  });
}

// modal

const galleryImgs = Array.from(document.querySelectorAll(".gallery-grid img"));
let currentImgIndex = 0;

function openModal(img) {
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImg");

  currentImgIndex = galleryImgs.indexOf(img);
  modal.style.display = "flex";
  modalImg.src = img.src;
}

function changeModal(direction) {
  currentImgIndex = (currentImgIndex + direction + galleryImgs.length) % galleryImgs.length;
  document.getElementById("modalImg").src = galleryImgs[currentImgIndex].src;
}

function closeModal() {
  document.getElementById("imageModal").style.display = "none";
}

// keyboard navigation
document.addEventListener("keydown", (e) => {
  const modal = document.getElementById("imageModal");
  if (modal.style.display !== "none" && modal.style.display !== "") {
    if (e.key === "ArrowRight") changeModal(1);
    if (e.key === "ArrowLeft") changeModal(-1);
    if (e.key === "Escape") closeModal();
  }
});



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


// hamburger bubble menu

const hamburger = document.querySelector(".hamburger")
const navMenu = document.querySelector(".nav-menu")

hamburger.addEventListener("click", () => {

hamburger.classList.toggle("active")
navMenu.classList.toggle("active")

})

document.querySelectorAll(".nav-link").forEach(link => {

link.addEventListener("click", () => {

hamburger.classList.remove("active")
navMenu.classList.remove("active")

})

})
// close modal when clicking outside image

const modal = document.getElementById("imageModal");

modal.addEventListener("click", function (e) {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});
