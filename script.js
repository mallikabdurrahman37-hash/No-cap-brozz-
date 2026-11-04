// ===== Yahan apne videos edit karo =====
// thumb: apni image ka path (jaise "images/v1.jpg") — khali chhodo to colourful art dikhega
// url: video ka asli link
const CHANNEL = "https://www.youtube.com/@no_cap_brozz/shorts";
const videos = [
  { title: "Invitation Gone Wrong", views: "29K views", tag: "Shorts", word: "OOPS", a: "#FF5F6D", b: "#FFC371", thumb: "", url: CHANNEL },
  { title: "Cycle wala scene",      views: "1.6K views", tag: "Shorts", word: "HAHA", a: "#36D1DC", b: "#5B86E5", thumb: "", url: CHANNEL },
  { title: "Heart Problem",         views: "Reel",       tag: "Reel",   word: "AWW",  a: "#B24592", b: "#F15F79", thumb: "", url: CHANNEL },
  { title: "Scooty pe timepass",    views: "Reel",       tag: "Reel",   word: "BRUH", a: "#F9D423", b: "#FF4E50", thumb: "", url: CHANNEL },
  { title: "Raste ka roast",        views: "Short",      tag: "Shorts", word: "ROAST",a: "#11998E", b: "#38EF7D", thumb: "", url: CHANNEL },
  { title: "Naya video jaldi aa raha hai", views: "Subscribe karo", tag: "Soon", word: "SOON", a: "#FFB300", b: "#1A1208", thumb: "", url: CHANNEL }
];

const $ = s => document.querySelector(s);
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- Opening animation ----------
const intro = $("#intro");
let finished = false;
function finish() {
  if (finished) return;
  finished = true;
  intro.classList.add("out");
  document.body.classList.remove("loading");
  document.body.classList.add("ready");
  setTimeout(() => intro.remove(), 1100);
}
if (reduce) finish();
else {
  const t0 = performance.now(), dur = 2200;
  const step = t => {
    if (finished) return;
    const p = Math.min((t - t0) / dur, 1);
    $("#pct").textContent = Math.round(p * 100);
    $("#barFill").style.width = p * 100 + "%";
    p < 1 ? requestAnimationFrame(step) : setTimeout(finish, 250);
  };
  requestAnimationFrame(step);
  intro.addEventListener("click", finish); // click karke skip
}

// ---------- Reel cards ----------
const rail = $("#rail");
videos.forEach(v => {
  const el = document.createElement("article");
  el.className = "reel";
  el.style.setProperty("--a", v.a);
  el.style.setProperty("--b", v.b);
  el.innerHTML = `<a target="_blank" rel="noopener">
    <div class="art"></div><span class="word"></span>
    <span class="tag"><i></i><span></span></span><span class="play"></span>
    <div class="cap"><h3></h3><span class="views"></span></div></a>`;
  const a = el.querySelector("a");
  a.href = v.url;
  a.setAttribute("aria-label", v.title);
  if (v.thumb) el.querySelector(".art").style.backgroundImage = `url("${v.thumb}")`;
  el.querySelector(".word").textContent = v.word;
  el.querySelector(".tag span").textContent = v.tag;
  el.querySelector("h3").textContent = v.title;
  el.querySelector(".views").textContent = v.views;

  // 3D tilt + glare
  a.addEventListener("pointermove", e => {
    if (e.pointerType === "touch") return;
    const r = a.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    a.style.setProperty("--ry", (x - .5) * 16 + "deg");
    a.style.setProperty("--rx", (.5 - y) * 16 + "deg");
    a.style.setProperty("--gx", x * 100 + "%");
    a.style.setProperty("--gy", y * 100 + "%");
  });
  a.addEventListener("pointerleave", () => { a.style.setProperty("--rx", "0deg"); a.style.setProperty("--ry", "0deg"); });
  rail.appendChild(el);
});

// Drag to scroll (mouse) + arrows
let down = false, sx = 0, sl = 0, moved = false;
rail.addEventListener("pointerdown", e => {
  if (e.pointerType !== "mouse") return;
  down = true; moved = false; sx = e.clientX; sl = rail.scrollLeft;
});
window.addEventListener("pointermove", e => {
  if (!down) return;
  const dx = e.clientX - sx;
  if (Math.abs(dx) > 5) { moved = true; rail.classList.add("drag"); }
  rail.scrollLeft = sl - dx;
});
window.addEventListener("pointerup", () => { down = false; rail.classList.remove("drag"); });
rail.addEventListener("click", e => { if (moved) { e.preventDefault(); moved = false; } }, true);
$("#prev").onclick = () => rail.scrollBy({ left: -260, behavior: "smooth" });
$("#next").onclick = () => rail.scrollBy({ left: 260, behavior: "smooth" });

// ---------- Ticker ----------
const words = ["NO CAP", "MEME", "ROAST", "FUN", "ENTERTAINMENT", "HASTE RAHO"];
$("#track").textContent = (words.join("  \u2022  ") + "  \u2022  ").repeat(6);

// ---------- Hero logo: tilt + click spin ----------
const stage = $("#stage"), logoBtn = $("#logoBtn");
$("#home").addEventListener("pointermove", e => {
  if (e.pointerType === "touch") return;
  const r = stage.getBoundingClientRect();
  const x = (e.clientX - (r.left + r.width / 2)) / innerWidth, y = (e.clientY - (r.top + r.height / 2)) / innerHeight;
  logoBtn.style.setProperty("--ry", x * 50 + "deg");
  logoBtn.style.setProperty("--rx", -y * 50 + "deg");
});
logoBtn.addEventListener("click", () => {
  logoBtn.classList.add("spin");
  setTimeout(() => logoBtn.classList.remove("spin"), 700);
});

// ---------- Reveal + counters ----------
const countUp = el => {
  const to = +el.dataset.to;
  if (reduce) { el.textContent = to; return; }
  const t0 = performance.now(), dur = 1400;
  const tick = t => {
    const p = Math.min((t - t0) / dur, 1);
    el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  io.unobserve(e.target);
  e.target.classList.add("in");
  e.target.querySelectorAll("[data-to]").forEach(countUp);
}), { threshold: 0.25 });
document.querySelectorAll(".rv").forEach(el => io.observe(el));

// ---------- Scroll progress bar ----------
addEventListener("scroll", () => {
  const h = document.documentElement;
  $("#progress").style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 + "%";
}, { passive: true });

// ---------- Hasi meter ----------
const box = document.querySelector(".laugh-box"), lc = $("#laughCount");
let laughs = 0;
const bursts = ["HAHA!", "LOL", "😂", "BRUH", "HEHE", "🤣"];
$("#laughBtn").addEventListener("click", e => {
  lc.textContent = ++laughs;
  const r = box.getBoundingClientRect();
  for (let i = 0; i < 4; i++) {
    const s = document.createElement("span");
    s.className = "haha";
    s.textContent = bursts[Math.floor(Math.random() * bursts.length)];
    s.style.left = e.clientX - r.left + (Math.random() * 60 - 30) + "px";
    s.style.top = e.clientY - r.top - 20 + "px";
    s.style.setProperty("--dx", Math.random() * 120 - 60 + "px");
    s.style.setProperty("--rot", Math.random() * 50 - 25 + "deg");
    box.appendChild(s);
    setTimeout(() => s.remove(), 1000);
  }
});

$("#year").textContent = new Date().getFullYear();
