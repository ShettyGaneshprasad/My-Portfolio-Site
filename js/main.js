/* =========================================================
   Ganeshprasad Shetty — Portfolio 2026  ·  interactions
   Vanilla JS, no dependencies.
   ========================================================= */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Footer year ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Navbar: shrink + blur on scroll ---- */
  var nav = document.getElementById("nav");
  var progress = document.getElementById("scrollProgress");

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (nav) nav.classList.toggle("scrolled", y > 24);

    if (progress) {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      progress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Mobile menu ---- */
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");

  function closeMenu() {
    if (!links) return;
    links.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ---- Scroll-reveal ---- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    var revealIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, i) {
          if (entry.isIntersecting) {
            var el = entry.target;
            // light stagger for groups of siblings
            var delay = Math.min(i * 70, 210);
            setTimeout(function () { el.classList.add("in"); }, delay);
            revealIO.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach(function (el) { revealIO.observe(el); });
  }

  /* ---- Active nav link via scroll spy ---- */
  var sections = document.querySelectorAll("main section[id]");
  var navAnchors = links ? links.querySelectorAll('a[href^="#"]') : [];

  if (sections.length && navAnchors.length && "IntersectionObserver" in window) {
    var spyIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.getAttribute("id");
            navAnchors.forEach(function (a) {
              a.classList.toggle("active", a.getAttribute("href") === "#" + id);
            });
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach(function (s) { spyIO.observe(s); });
  }

  /* ---- Animated stat counters ---- */
  var counters = document.querySelectorAll(".stat-num[data-count]");
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduceMotion) { el.textContent = target + suffix; return; }
    var start = null;
    var dur = 1100;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if (counters.length && "IntersectionObserver" in window) {
    var countIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            countIO.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach(function (c) { countIO.observe(c); });
  } else {
    counters.forEach(function (c) {
      c.textContent = c.getAttribute("data-count") + (c.getAttribute("data-suffix") || "");
    });
  }

  /* ---- Hero role rotator ---- */
  var rotator = document.getElementById("roleRotator");
  if (rotator && !reduceMotion) {
    var roles = ["Data Engineer", "Azure & Spark Specialist", "ETL / ELT Architect", "Cloud Analytics Engineer"];
    var idx = 0, char = 0, deleting = false;

    function tick() {
      var word = roles[idx];
      char += deleting ? -1 : 1;
      rotator.textContent = word.substring(0, char);

      var wait = deleting ? 45 : 95;
      if (!deleting && char === word.length) { wait = 1700; deleting = true; }
      else if (deleting && char === 0) { deleting = false; idx = (idx + 1) % roles.length; wait = 350; }
      setTimeout(tick, wait);
    }
    setTimeout(tick, 1200);
  }
})();
