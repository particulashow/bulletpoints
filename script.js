const params = new URLSearchParams(window.location.search);

const overlay = document.getElementById("overlay");
const panel = document.getElementById("panel");
const titleEl = document.getElementById("title");
const kickerEl = document.getElementById("kicker");
const listEl = document.getElementById("list");

const title = params.get("title") || "Agenda";
const kicker = params.get("kicker") || "PONTOS DA LIVE";
const mode = (params.get("mode") || "auto").toLowerCase(); // auto | full | dock
const dock = (params.get("dock") || "tr").toLowerCase();   // tr|tl|br|bl
const hold = Math.max(0, parseFloat(params.get("hold") || "3")); // segundos antes de fazer dock (no auto)
const speed = Math.max(0.4, Math.min(2.0, parseFloat(params.get("speed") || "1"))); // 0.4..2
const activeIndex = Math.max(1, parseInt(params.get("active") || "1", 10)); // item ativo

// Tempos
const t = Math.round(900 / speed);
panel.style.setProperty("--t", `${t}ms`);

titleEl.textContent = decodeURIComponent(title);
kickerEl.textContent = decodeURIComponent(kicker);

// Lê itens item1..item10
const items = [];
for (let i = 1; i <= 10; i++) {
  const v = params.get(`item${i}`);
  if (v && decodeURIComponent(v).trim()) items.push(decodeURIComponent(v).trim());
}

if (!items.length) {
  items.push("Introdução", "Manifesto", "Os Líderes", "Matrioska", "O caminho");
}

// Render
listEl.innerHTML = "";
items.forEach((txt, idx) => {
  const li = document.createElement("li");
  li.className = "item";
  if (idx + 1 === activeIndex) li.classList.add("active");

  const badge = document.createElement("div");
  badge.className = "badge";
  badge.textContent = String(idx + 1);

  const text = document.createElement("div");
  text.className = "text";
  text.textContent = txt;

  li.appendChild(badge);
  li.appendChild(text);
  listEl.appendChild(li);

  // stagger (entrada)
  li.style.transitionDelay = `${120 + idx * 80}ms`;
});

// Entrada
requestAnimationFrame(() => panel.classList.add("ready"));

// Dock control
function setDock(on){
  overlay.classList.toggle("dock", on);
  overlay.classList.remove("tl","tr","bl","br");
  overlay.classList.add(dock);
}

if (mode === "dock") {
  setDock(true);
} else if (mode === "full") {
  setDock(false);
} else {
  // auto: full -> dock depois de X segundos
  setDock(false);
  if (hold > 0) {
    setTimeout(() => setDock(true), hold * 1000);
  }
}
