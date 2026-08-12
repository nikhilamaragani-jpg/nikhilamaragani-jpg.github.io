(function () {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // floating particles
  const layer = document.getElementById("particles");
  if (layer) {
    for (let i = 0; i < 36; i++) {
      const p = document.createElement("div");
      p.className = "particle";
      const size = 2 + Math.random() * 4;
      p.style.width = size + "px";
      p.style.height = size + "px";
      p.style.left = Math.random() * 100 + "%";
      p.style.top = 55 + Math.random() * 45 + "%";
      p.style.animationDuration = 12 + Math.random() * 18 + "s";
      p.style.animationDelay = Math.random() * 10 + "s";
      if (Math.random() > 0.5) p.style.background = "rgba(34,211,238,.45)";
      if (Math.random() > 0.8) p.style.background = "rgba(16,185,129,.4)";
      layer.appendChild(p);
    }
  }

  // typing effect
  const typeEl = document.getElementById("typeTarget");
  if (typeEl) {
    const phrases = ["Portfolio", "Applied AI", "ML Systems", "Upskilling", "Clean Demos"];
    let pi = 0;
    let ci = 0;
    let deleting = false;
    const tick = () => {
      const word = phrases[pi];
      if (!deleting) {
        ci++;
        typeEl.textContent = word.slice(0, ci);
        if (ci === word.length) {
          deleting = true;
          setTimeout(tick, 1600);
          return;
        }
      } else {
        ci--;
        typeEl.textContent = word.slice(0, ci);
        if (ci === 0) {
          deleting = false;
          pi = (pi + 1) % phrases.length;
        }
      }
      setTimeout(tick, deleting ? 45 : 90);
    };
    setTimeout(tick, 800);
  }

  // mobile nav
  const btn = document.getElementById("navBtn");
  const nav = document.getElementById("nav");
  if (btn && nav) {
    btn.addEventListener("click", () => nav.classList.toggle("open"));
    nav.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => nav.classList.remove("open"))
    );
  }

  // active nav
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

  // scroll reveal
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("in"));
  }

  // interactive terminal
  const termBody = document.getElementById("termBody");
  const termForm = document.getElementById("termForm");
  const termInput = document.getElementById("termInput");

  const write = (html) => {
    if (!termBody) return;
    const div = document.createElement("div");
    div.className = "term-line";
    div.innerHTML = html;
    termBody.appendChild(div);
    termBody.scrollTop = termBody.scrollHeight;
  };

  const commands = {
    help: () =>
      write(
        '<span class="ok">commands:</span> help · about · education · skills · projects · training · contact · github · portfolio · clear'
      ),
    about: () =>
      write(
        "Amaragani Nikhil Sai — B.Tech CSE · Graduated 2026 · CGPA 6.9 · Applied AI & ML · student upskilling in public."
      ),
    education: () =>
      write(
        "SIIET (JNTUH) · B.Tech CSE · Graduated 2026 · CGPA 6.9 · Roll 22X31A0513 · Intermediate 784 · SSC 9.3"
      ),
    skills: () =>
      write(
        "Python · SQL · scikit-learn · NLP/RAG · FastAPI · Docker · Pandas · Power BI · Git"
      ),
    projects: () =>
      write(
        "1) Smart Tourism Chatbot (major) · 2) Fake Account Detection · 3) Blockchain Notarization+eID · 4) ID Detection & Penalty"
      ),
    training: () =>
      write(
        "Agrasta AI Intern (2m) · Agrasta Industrial AI (2m) · Conscience Technologies mentoring · Power BI / Python-AI workshops"
      ),
    contact: () =>
      write(
        'Email: <span class="cmd">nikhilamaragani@gmail.com</span> · Phone: +91 93913 33050 · Hyderabad'
      ),
    github: () =>
      write(
        '<a class="cmd" href="https://github.com/nikhilamaragani-jpg" target="_blank" rel="noopener">github.com/nikhilamaragani-jpg</a>'
      ),
    portfolio: () =>
      write(
        '<a class="cmd" href="https://nikhilamaragani-jpg.github.io/" target="_blank" rel="noopener">nikhilamaragani-jpg.github.io</a>'
      ),
    whoami: () => write("nikhil · builder · applied-ai"),
    clear: () => {
      if (termBody) termBody.innerHTML = "";
    },
  };

  if (termForm && termInput) {
    termForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const raw = termInput.value.trim();
      if (!raw) return;
      write(`<span class="cmd">$ ${raw}</span>`);
      const key = raw.toLowerCase().split(/\s+/)[0];
      if (commands[key]) commands[key]();
      else
        write(
          `<span class="err">command not found:</span> ${key} — type <span class="cmd">help</span>`
        );
      termInput.value = "";
    });
  }
})();
