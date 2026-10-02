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

  // Coding activity (WakaTime), synced into assets/data/waka-stats.json by a scheduled GitHub Action
  var activityCard = document.getElementById("activityCard");
  if (activityCard) {
    var activityTabs = document.getElementById("activityTabs");
    var statsData = null;
    var activeRange = "last_7_days";

    function renderRange(key) {
      if (!statsData || !statsData.ranges || !statsData.ranges[key]) return;
      var range = statsData.ranges[key];

      var rangeEl = document.getElementById("activityRange");
      var totalEl = document.getElementById("activityTotal");
      var updatedEl = document.getElementById("activityUpdated");
      var substatsEl = document.getElementById("activitySubstats");
      var langsEl = document.getElementById("activityLangs");

      if (rangeEl) rangeEl.textContent = range.label || key;
      if (totalEl) totalEl.textContent = range.total || "—";
      if (updatedEl && statsData.updated_at) {
        var d = new Date(statsData.updated_at);
        updatedEl.textContent = "Synced " + d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
      }

      if (substatsEl) {
        substatsEl.innerHTML = "";
        if (range.daily_average) {
          substatsEl.innerHTML +=
            '<div class="activity-substat"><span class="activity-substat-label">Daily Average</span>' +
            '<span class="activity-substat-value">' + range.daily_average + "</span></div>";
        }
        if (range.best_day && range.best_day.text) {
          substatsEl.innerHTML +=
            '<div class="activity-substat"><span class="activity-substat-label">Best Day</span>' +
            '<span class="activity-substat-value">' + range.best_day.text + "</span></div>";
        }
      }

      if (langsEl) {
        langsEl.innerHTML = "";
        (range.languages || []).forEach(function (lang) {
          var li = document.createElement("li");
          li.className = "lang-bar-row";
          li.innerHTML =
            '<div class="lang-bar-labels">' +
            '<span class="lang-bar-name">' + lang.name + "</span>" +
            '<span class="lang-bar-meta">' + lang.text + "</span>" +
            "</div>" +
            '<div class="lang-bar-track"><div class="lang-bar-fill" style="width:' + lang.percent + '%"></div></div>';
          langsEl.appendChild(li);
        });
      }

      activeRange = key;
    }

    if (activityTabs) {
      activityTabs.addEventListener("click", function (e) {
        var btn = e.target.closest(".activity-tab");
        if (!btn) return;
        var key = btn.getAttribute("data-range");
        activityTabs.querySelectorAll(".activity-tab").forEach(function (t) {
          t.classList.toggle("is-active", t === btn);
          t.setAttribute("aria-selected", t === btn ? "true" : "false");
        });
        renderRange(key);
      });
    }

    fetch("assets/data/waka-stats.json", { cache: "no-store" })
      .then(function (res) {
        if (!res.ok) throw new Error("stats unavailable");
        return res.json();
      })
      .then(function (data) {
        statsData = data;
        renderRange(activeRange);
        activityCard.setAttribute("data-state", "ready");
      })
      .catch(function () {
        activityCard.setAttribute("data-state", "error");
      });
  }

  // Scroll-reveal for sections
  var revealTargets = document.querySelectorAll(
    ".skill-card, .project-card, .timeline-item, .edu-card, .contact-card, .about-facts > div, .activity-card"
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
