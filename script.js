(function () {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // floating particles
  const layer = document.getElementById("particles");
  if (layer) {
    for (let i = 0; i < 28; i++) {
      const p = document.createElement("div");
      p.className = "particle";
      const size = 2 + Math.random() * 4;
      p.style.width = size + "px";
      p.style.height = size + "px";
      p.style.left = Math.random() * 100 + "%";
      p.style.top = 60 + Math.random() * 40 + "%";
      p.style.animationDuration = 12 + Math.random() * 18 + "s";
      p.style.animationDelay = Math.random() * 10 + "s";
      if (Math.random() > 0.5) p.style.background = "rgba(34,211,238,.45)";
      layer.appendChild(p);
    }
  }

  // mobile nav
  const btn = document.getElementById("navBtn");
  const nav = document.getElementById("nav");
  if (btn && nav) {
    btn.addEventListener("click", () => {
      nav.classList.toggle("open");
    });
    nav.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => nav.classList.remove("open"))
    );
  }

  // active nav highlight
  const links = [...document.querySelectorAll("[data-nav]")];
  const sections = links
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  const onScroll = () => {
    const y = window.scrollY + 120;
    let current = sections[0];
    for (const s of sections) {
      if (s.offsetTop <= y) current = s;
    }
    links.forEach((a) => {
      a.classList.toggle("active", a.getAttribute("href") === "#" + current.id);
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
