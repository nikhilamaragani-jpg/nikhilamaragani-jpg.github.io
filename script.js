(function () {
  "use strict";

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ========== 3D TECH BACKGROUND ==========
     Perspective grid floor + neural network nodes + floating tech bits.
     Creative / professional / tech — inspired by particle sites, unique scene. */
  (function initTech3D() {
    const canvas = document.getElementById("tech3d");
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let nodes = [];
    let symbols = [];
    let t = 0;
    let raf = 0;
    let mx = 0.5;
    let my = 0.5;

    const NODE_COUNT = reduceMotion ? 36 : 72;
    // Project + B.Tech tech vocabulary (AI, ML, coding)
    const SYM = [
      "AI", "ML", "NLP", "RAG", "F1", "API", "CLI",
      "FastAPI", "Docker", "sklearn", "Pandas", "Python",
      "SHA-256", "ledger", "hash", "audit", "rules",
      "chat", "intent", "vector", "train", "eval",
      "01", "10", "{}", "</>", "λ", "def", "import",
      "SQL", "Git", "DSA", "OOP", "DBMS"
    ];

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function seed() {
      nodes = [];
      for (let i = 0; i < NODE_COUNT; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h * 0.85,
          z: 0.3 + Math.random() * 0.7,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          r: 1.2 + Math.random() * 2.2,
          hue: Math.random() > 0.55 ? "violet" : Math.random() > 0.4 ? "cyan" : "green",
        });
      }
      symbols = [];
      const nSym = reduceMotion ? 12 : 28;
      for (let i = 0; i < nSym; i++) {
        symbols.push({
          x: Math.random() * w,
          y: Math.random() * h,
          s: SYM[(Math.random() * SYM.length) | 0],
          sp: 0.15 + Math.random() * 0.35,
          op: 0.08 + Math.random() * 0.12,
          size: 10 + Math.random() * 8,
        });
      }
    }

    function drawGrid() {
      // Perspective floor grid — 3D tech floor
      const horizon = h * 0.52;
      const vanishX = w * (0.5 + (mx - 0.5) * 0.08);
      const vanishY = horizon - 20;

      ctx.save();
      ctx.strokeStyle = "rgba(34,211,238,0.08)";
      ctx.lineWidth = 1;

      const rows = 14;
      for (let i = 0; i <= rows; i++) {
        const p = i / rows;
        const y = horizon + Math.pow(p, 1.6) * (h - horizon) * 1.05;
        const spread = 40 + p * w * 0.95;
        ctx.beginPath();
        ctx.moveTo(vanishX - spread, y);
        ctx.lineTo(vanishX + spread, y);
        ctx.stroke();
      }

      const cols = 18;
      for (let i = -cols; i <= cols; i++) {
        const edgeX = vanishX + i * (w / cols) * 1.3;
        ctx.beginPath();
        ctx.moveTo(vanishX, vanishY);
        ctx.lineTo(edgeX, h + 20);
        ctx.strokeStyle = i % 3 === 0 ? "rgba(167,139,250,0.1)" : "rgba(34,211,238,0.06)";
        ctx.stroke();
      }

      // horizon glow line
      const grad = ctx.createLinearGradient(0, horizon - 1, w, horizon + 1);
      grad.addColorStop(0, "rgba(167,139,250,0)");
      grad.addColorStop(0.5, "rgba(34,211,238,0.22)");
      grad.addColorStop(1, "rgba(167,139,250,0)");
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, horizon);
      ctx.lineTo(w, horizon);
      ctx.stroke();
      ctx.restore();
    }

    function colorFor(hue, a) {
      if (hue === "violet") return "rgba(167,139,250," + a + ")";
      if (hue === "green") return "rgba(16,185,129," + a + ")";
      return "rgba(34,211,238," + a + ")";
    }

    function drawNetwork() {
      // connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxD = 140 * ((a.z + b.z) / 2);
          if (dist < maxD) {
            const alpha = (1 - dist / maxD) * 0.22 * Math.min(a.z, b.z);
            ctx.strokeStyle = colorFor(a.hue, alpha);
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      // nodes
      for (const n of nodes) {
        const r = n.r * (0.7 + n.z);
        ctx.beginPath();
        ctx.fillStyle = colorFor(n.hue, 0.35 + n.z * 0.4);
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fill();
        // soft glow
        ctx.beginPath();
        ctx.fillStyle = colorFor(n.hue, 0.08);
        ctx.arc(n.x, n.y, r * 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function drawSymbols() {
      ctx.save();
      ctx.font = "500 12px 'JetBrains Mono', monospace";
      for (const s of symbols) {
        ctx.fillStyle = "rgba(148,163,184," + s.op + ")";
        ctx.font = "500 " + s.size + "px 'JetBrains Mono', monospace";
        ctx.fillText(s.s, s.x, s.y);
      }
      ctx.restore();
    }

    function drawHexRings() {
      // floating tech rings (3D-ish ellipses)
      ctx.save();
      for (let i = 0; i < 4; i++) {
        const cx = w * (0.18 + i * 0.22) + Math.sin(t * 0.0004 + i) * 36;
        const cy = h * (0.22 + (i % 2) * 0.14) + Math.cos(t * 0.0003 + i) * 24;
        const rx = 55 + i * 26;
        const ry = rx * 0.34;
        ctx.strokeStyle = i % 2 ? "rgba(167,139,250,0.14)" : "rgba(34,211,238,0.12)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, t * 0.00025 + i, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }

    function drawCircuitCorners() {
      ctx.save();
      ctx.strokeStyle = "rgba(34,211,238,0.12)";
      ctx.fillStyle = "rgba(167,139,250,0.35)";
      ctx.lineWidth = 1;
      const traces = [
        [[20, 80], [20, 40], [80, 40], [80, 20]],
        [[w - 20, 80], [w - 20, 40], [w - 80, 40], [w - 80, 20]],
        [[20, h - 80], [20, h - 40], [90, h - 40]],
        [[w - 20, h - 80], [w - 20, h - 40], [w - 90, h - 40]],
      ];
      for (const path of traces) {
        ctx.beginPath();
        ctx.moveTo(path[0][0], path[0][1]);
        for (let i = 1; i < path.length; i++) ctx.lineTo(path[i][0], path[i][1]);
        ctx.stroke();
        const last = path[path.length - 1];
        ctx.beginPath();
        ctx.arc(last[0], last[1], 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    function drawMatrixRain() {
      ctx.save();
      ctx.font = "11px 'JetBrains Mono', monospace";
      const cols = Math.floor(w / 48);
      for (let i = 0; i < cols; i++) {
        const x = 24 + i * 48;
        const phase = (t * 0.04 + i * 37) % (h + 200);
        const y = phase - 100;
        const bits = (i * 7 + ((t / 120) | 0)) % 2 === 0 ? "1" : "0";
        ctx.fillStyle = "rgba(34,211,238," + (0.04 + (i % 5) * 0.012) + ")";
        for (let k = 0; k < 8; k++) {
          ctx.fillText(bits, x, y + k * 16);
        }
      }
      ctx.restore();
    }

    function drawAIConstellation() {
      const cx = w * 0.78 + (mx - 0.5) * 20;
      const cy = h * 0.28 + (my - 0.5) * 12;
      const pts = [];
      const n = 10;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + t * 0.00015;
        const rr = 48 + 12 * Math.sin(t * 0.001 + i);
        pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.72]);
      }
      ctx.save();
      ctx.strokeStyle = "rgba(167,139,250,0.16)";
      ctx.lineWidth = 1;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          if ((i + j) % 3 !== 0) continue;
          ctx.beginPath();
          ctx.moveTo(pts[i][0], pts[i][1]);
          ctx.lineTo(pts[j][0], pts[j][1]);
          ctx.stroke();
        }
      }
      for (const p of pts) {
        ctx.beginPath();
        ctx.fillStyle = "rgba(34,211,238,0.45)";
        ctx.arc(p[0], p[1], 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = "rgba(167,139,250,0.35)";
      ctx.font = "600 11px 'JetBrains Mono', monospace";
      ctx.fillText("NEURAL.GRAPH", cx - 42, cy + 78);
      ctx.restore();
    }

    function step() {
      t += 16;
      ctx.clearRect(0, 0, w, h);

      // vignette base already in CSS; draw scene
      drawGrid();
      drawMatrixRain();
      drawCircuitCorners();
      drawHexRings();
      drawAIConstellation();
      drawSymbols();
      drawNetwork();

      if (!reduceMotion) {
        for (const n of nodes) {
          n.x += n.vx * n.z;
          n.y += n.vy * n.z;
          // gentle mouse parallax pull
          n.x += (mx - 0.5) * 0.08 * n.z;
          n.y += (my - 0.5) * 0.05 * n.z;
          if (n.x < -20) n.x = w + 20;
          if (n.x > w + 20) n.x = -20;
          if (n.y < -20) n.y = h * 0.9;
          if (n.y > h * 0.92) n.y = -20;
        }
        for (const s of symbols) {
          s.y -= s.sp;
          if (s.y < -20) {
            s.y = h + 20;
            s.x = Math.random() * w;
          }
        }
      }

      raf = requestAnimationFrame(step);
    }

    function onMove(e) {
      mx = e.clientX / w;
      my = e.clientY / h;
    }

    resize();
    seed();
    step();
    window.addEventListener("resize", () => {
      resize();
      seed();
    });
    if (!reduceMotion) {
      window.addEventListener("pointermove", onMove, { passive: true });
    }

    // pause when tab hidden
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        raf = requestAnimationFrame(step);
      }
    });
  })();

  /* ========== Floating particles (sister-style layer) ========== */
  const layer = document.getElementById("particles");
  if (layer && !reduceMotion) {
    const count = 28;
    for (let i = 0; i < count; i++) {
      const p = document.createElement("div");
      p.className = "particle";
      const size = 2 + Math.random() * 3.5;
      p.style.width = size + "px";
      p.style.height = size + "px";
      p.style.left = Math.random() * 100 + "%";
      p.style.top = 55 + Math.random() * 45 + "%";
      p.style.animationDuration = 14 + Math.random() * 18 + "s";
      p.style.animationDelay = Math.random() * 10 + "s";
      if (Math.random() > 0.5) p.style.background = "rgba(34,211,238,.4)";
      if (Math.random() > 0.85) p.style.background = "rgba(16,185,129,.35)";
      layer.appendChild(p);
    }
  }

  /* ========== Typing ========== */
  const typeEl = document.getElementById("typeTarget");
  if (typeEl && !reduceMotion) {
    const phrases = ["Data Analysis", "BI Analyst", "Python & SQL", "Power BI", "Clear Insights"];
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

  /* ========== Nav ========== */
  const btn = document.getElementById("navBtn");
  const nav = document.getElementById("nav");
  if (btn && nav) {
    btn.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        nav.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
      })
    );
  }

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
    if (!current) return;
    links.forEach((a) => {
      a.classList.toggle("active", a.getAttribute("href") === "#" + current.id);
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ========== Reveal ========== */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
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

  /* ========== Terminal ========== */
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
        "Amaragani Nikhil Sai — B.Tech CSE · Graduated 2026 · Entry-level Data Analyst / BI Analyst focus · Python · SQL · Power BI."
      ),
    education: () =>
      write(
        "SIIET (JNTUH) · B.Tech CSE · Graduated 2026 · CGPA 6.9 · Roll 22X31A0513 · Intermediate 784 · SSC Dilsukhnagar Public School · 9.3"
      ),
    skills: () =>
      write(
        "Python · SQL · Pandas · NumPy · Power BI · scikit-learn · NLP/RAG · Git"
      ),
    projects: () =>
      write(
        "Academic projects: Smart Tourism Chatbot · Fake Account Detection · Blockchain Notarization+eID · ID Detection & Penalty. Workshop analysis PDFs: Campfly Sales Analysis · Netflix Analysis."
      ),
    training: () =>
      write(
        "Agrasta Academy AI Intern (Oct–Dec 2024) · Agrasta AI industrial training · IBM Introduction to Data Analytics course 1 (completed Oct 3, 2026) · Office Master Power BI and Python workshop certificates · Summer of AI offer only."
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
    whoami: () => write("nikhil · aspiring data analyst · BI"),
    clear: () => {
      if (termBody) termBody.innerHTML = "";
    },
  };

  if (termForm && termInput) {
    termForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const raw = termInput.value.trim();
      if (!raw) return;
      const safe = raw.replace(/[<>&]/g, "");
      write('<span class="cmd">$ ' + safe + "</span>");
      const key = raw.toLowerCase().split(/\s+/)[0];
      if (commands[key]) commands[key]();
      else
        write(
          '<span class="err">command not found:</span> ' +
            safe +
            ' — type <span class="cmd">help</span>'
        );
      termInput.value = "";
    });
  }
})();
