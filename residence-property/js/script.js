const navId = document.getElementById("nav_menu");
const toggleBtnId = document.getElementById("toggle_btn");
const closeBtnId = document.getElementById("close_btn");

// === SHOW MENU === //
toggleBtnId.addEventListener("click", () => {
  navId.classList.add("show");
});

// === HIDE MENU === //
closeBtnId.addEventListener("click", () => {
  navId.classList.remove("show");
});

AOS.init();

// LOGO
gsap.from(".logo", {
  opacity: 0,
  y: -10,
  delay: 1,
  duration: 0.5,
});

// nav menu
gsap.from(".nav_menu .nav_menu_item", {
  opacity: 0,
  y: -10,
  delay: 1,
  duration: 0.5,
  stagger: 0.3,
});

// toggle btn
gsap.from(".toggle_btn", {
  opacity: 0,
  y: -10,
  delay: 1,
  duration: 0.5,
});

// main heading
gsap.from(".main-heading", {
  opacity: 0,
  y: 20,
  delay: 2,
  duration: 0.5,
});

// btn
gsap.from(".btn_wrapper", {
  opacity: 0,
  y: 20,
  delay: 1.8,
  duration: 0.5,
});

gsap.from(".team_img_wrapper img", {
  opacity: 0,
  y: 20,
  delay: 1.8,
  duration: 0.5,
});

gsap.from(".info-text", {
  opacity: 0,
  y: 20,
  delay: 1.8,
  duration: 0.5,
});

gsap.from(".fasilitas", {
  opacity: 0,
  y: 20,
  delay: 1.8,
  duration: 0.5,
});
