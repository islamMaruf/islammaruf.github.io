(function () {
  "use strict";

  // Theme toggle with persistence
  var root = document.documentElement;
  var themeBtn = document.getElementById("themeToggle");
  var stored = null;
  try { stored = localStorage.getItem("theme"); } catch (e) {}
  if (stored === "dark" || stored === "light") {
    root.setAttribute("data-theme", stored);
  }

  function currentTheme() {
    if (root.getAttribute("data-theme") === "dark") return "dark";
    if (root.getAttribute("data-theme") === "light") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  }

  // Mobile nav toggle
  var navToggle = document.getElementById("navToggle");
  var navMenu = document.getElementById("navMenu");
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      var open = navMenu.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    navMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navMenu.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Footer year
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Years of professional experience, computed from career start (Skylark Soft Ltd, Feb 2019)
  var CAREER_START = new Date(2019, 1, 1);
  var now = new Date();
  var yearsExp = now.getFullYear() - CAREER_START.getFullYear();
  var monthDiff = now.getMonth() - CAREER_START.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < CAREER_START.getDate())) {
    yearsExp--;
  }
  document.querySelectorAll(".js-years-exp").forEach(function (el) {
    el.textContent = yearsExp + (el.getAttribute("data-suffix") || "");
  });

  // Scroll-reveal for sections
  var revealTargets = document.querySelectorAll(
    ".skill-card, .project-card, .timeline-item, .edu-card, .contact-card, .about-facts > div"
  );
  if ("IntersectionObserver" in window && revealTargets.length) {
    revealTargets.forEach(function (el) {
      el.style.opacity = "0";
      el.style.transform = "translateY(16px)";
      el.style.transition = "opacity .5s ease, transform .5s ease";
    });
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    revealTargets.forEach(function (el) { observer.observe(el); });
  }
})();
