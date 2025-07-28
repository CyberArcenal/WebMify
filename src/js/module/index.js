const themeToggle = document.getElementById("theme-toggle");
const html = document.documentElement;

// Check for saved theme preference
const currentTheme = localStorage.getItem("theme");
if (currentTheme === "dark") {
  html.classList.add("dark");
} else if (currentTheme === "light") {
  html.classList.remove("dark");
} else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
  html.classList.add("dark");
}

// Toggle theme on button click
themeToggle.addEventListener("click", () => {
  html.classList.toggle("dark");
  localStorage.setItem(
    "theme",
    html.classList.contains("dark") ? "dark" : "light"
  );
});

// Mobile Menu Toggle
const mobileMenuButton = document.getElementById("mobile-menu-button");
const mobileMenu = document.getElementById("mobile-menu");

mobileMenuButton.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

// Close mobile menu when clicking outside
document.addEventListener("click", (e) => {
  if (!mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
    mobileMenu.classList.add("hidden");
  }
});

// Close mobile menu when clicking a link
const mobileLinks = mobileMenu.querySelectorAll("a");
mobileLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.add("hidden");
  });
});

// Highlight active navigation link
function highlightActiveLink() {
  const path = window.location.hash.split("/")[0] || "#index";
  const navLinks = document.querySelectorAll("nav a");

  navLinks.forEach((link) => {
    const linkPath = link.getAttribute("href").split("/")[0];
    if (linkPath === path) {
      link.classList.add("router-link-active");
    } else {
      link.classList.remove("router-link-active");
    }
  });
}

// Initial highlight
highlightActiveLink();

// Highlight on hash change
window.addEventListener("hashchange", highlightActiveLink);
