const params = new URLSearchParams(window.location.search);

const overlay = document.getElementById("overlay");
const panel = document.getElementById("panel");
const header = document.getElementById("header");
const titleEl = document.getElementById("title");
const kickerEl = document.getElementById("kicker");
const listEl = document.getElementById("list");

// Config
const dock = (params.get("dock") || "tr").toLowerCase(); // tr|tl|br|bl
const activeIndex = Math.max(0, parseInt(params.get("active") || "0", 10)); // 0 = nenhum
const speed = Math.max(0.4, Math.min(2.0, parseFloat(params.get("speed") || "1"))); // 0.4..2

// Cor (hex sem #) ex: accent=FFB020
const accentHex = (params.get("accent") || "").trim().replace("#", "");
if (/^[0-9a-fA-F]{6}$/.test(accentHex)) {
  panel.style.setProperty("--accent", `#${accentHex}`);
}

// Tempos
const t = Math.round(900 / speed);
panel.style.setProperty("--t", `${t}ms`);

// Dock class
overlay.classList.remove("tl","tr","bl","br");
overlay.classList.add(dock);

// Header opcional (se não houver title/kicker, não aparece)
const title = (params.get("title") || "").trim();
const kicker = (params.get("kicker") || "").trim();

titleEl.textContent = title ? decodeURIComponent(title) : "";
kickerEl.textContent = kicker ? decodeURIComponent(kicker) : "";

if (!title && !kicker) header.classList.add("hide");

// Itens item1..item10 (só os preenchidos)
const items = [];
for (let i = 1; i <= 10; i++) {
  const v = params.get(`item${i}`);
  if (v && decodeURIComponent(v).trim()) items.push(decodeURIComponent(v).trim());
}

// fallback para não ficar “vazio” se alguém abrir sem params
if (!items.length) {
  items.push("Introdução", "Manifesto", "Os Líderes", "Matrioska", "O caminho");
}

// Render
listEl.innerHTML = "";
items.forEach((txt, idx) => {
  const li = document.createElement("li");
  li.className = "item";
  if (activeIndex > 0 && idx + 1 === activeIndex) li.classList.add("active");

  const badge = document.createElement("div");
  badge.className = "badge";
  badge.textContent = String(idx + 1);

  const text = document.createElement("div");
  text.className = "text";
  text.textContent = txt;

  li.appendChild(badge);
  li.appendChild(text);
  listEl.appendChild(li);

  // stagger entrada
  li.style.transitionDelay = `${120 + idx * 70}ms`;
});

// Entrada
requestAnimationFrame(() => panel.classList.add("ready"));
