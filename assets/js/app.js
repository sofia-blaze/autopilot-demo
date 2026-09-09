/* Shared helpers for the Autopilot demo. */

const AGENT = { name: "S. Iturbide", id: "SITURBIDE", ext: "40218" };

/* ---------- tiny DOM helpers ---------- */
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function el(tag, attrs = {}, ...kids) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === null || v === undefined || v === false) continue;
    if (k === "class") node.className = v;
    else if (k === "html") node.innerHTML = v;
    else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v);
  }
  for (const kid of kids.flat()) {
    if (kid === null || kid === undefined || kid === false) continue;
    node.append(kid instanceof Node ? kid : document.createTextNode(String(kid)));
  }
  return node;
}

/* Escape text destined for innerHTML. */
function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function param(name) { return new URLSearchParams(location.search).get(name); }

function findOrder(id) { return ORDERS.find(o => o.id === id) || null; }

/* Resolve a search term against several fields; returns matching orders. */
function searchOrders(field, term) {
  const t = String(term || "").trim().toLowerCase();
  if (!t) return [];
  const pick = {
    "Order Number": o => o.id,
    "Customer ID": o => o.customerId,
    "Document ID": o => o.docId,
    "Member Name": o => `${o.member.last}, ${o.member.first}`,
    "Phone Number": o => o.customer.phone.replace(/\D/g, "")
  }[field] || (o => o.id);
  const norm = field === "Phone Number" ? t.replace(/\D/g, "") : t;
  return ORDERS.filter(o => String(pick(o)).toLowerCase().includes(norm));
}

/* ---------- per-session edits (so the demo remembers your input) ---------- */
const Edits = {
  key: id => `autopilot:edits:${id}`,
  get(id) {
    try { return JSON.parse(sessionStorage.getItem(this.key(id))) || {}; }
    catch { return {}; }
  },
  merge(id, patch) {
    try {
      const next = Object.assign(this.get(id), patch);
      sessionStorage.setItem(this.key(id), JSON.stringify(next));
      return next;
    } catch { return patch; }
  },
  clear(id) { try { sessionStorage.removeItem(this.key(id)); } catch {} }
};

/* Extra line items added through the swap tool. */
const AddedItems = {
  key: id => `autopilot:items:${id}`,
  get(id) {
    try { return JSON.parse(sessionStorage.getItem(this.key(id))) || []; }
    catch { return []; }
  },
  add(id, item) {
    try {
      const list = this.get(id);
      list.push(item);
      sessionStorage.setItem(this.key(id), JSON.stringify(list));
      return list;
    } catch { return []; }
  }
};

/* ---------- chrome ---------- */
function fmtClock(totalSec) {
  const m = String(Math.floor(totalSec / 60)).padStart(2, "0");
  const s = String(totalSec % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function initials(name) {
  return name.replace(/[^A-Za-z. ]/g, "").split(/[. ]+/).filter(Boolean).slice(0, 2)
    .map(w => w[0].toUpperCase()).join("");
}

/* Renders the top bar, including the agent state control and its timer. */
function renderAppBar(mount) {
  const bar = el("div", { class: "appbar" },
    el("div", { class: "brand" }, "Autopilot", el("span", { class: "tag" }, "Demo")),
    el("div", { class: "spacer" }),
    el("span", { class: "timer", id: "stateTimer" }, "00:00"),
    (() => {
      const sel = el("select", { class: "state-select", id: "agentState", "aria-label": "Agent state" },
        el("option", {}, "Ready"),
        el("option", {}, "Not Ready"),
        el("option", {}, "Wrap-Up"));
      return sel;
    })(),
    el("div", { class: "agentbox" },
      el("div", { class: "who" }, el("b", {}, AGENT.name), el("span", {}, `${AGENT.id} · ext ${AGENT.ext}`)),
      el("div", { class: "avatar" }, initials(AGENT.name)))
  );
  mount.prepend(bar);

  const sel = $("#agentState", bar);
  const timer = $("#stateTimer", bar);
  let secs = 0;
  const paint = () => {
    sel.className = "state-select" +
      (sel.value === "Not Ready" ? " notready" : sel.value === "Wrap-Up" ? " wrap" : "");
  };
  sel.addEventListener("change", () => { secs = 0; timer.textContent = fmtClock(0); paint(); });
  setInterval(() => { secs += 1; timer.textContent = fmtClock(secs); }, 1000);
  paint();
}

/* Left-hand navigation, shared by every page. */
function renderSidebar(mount, active, order) {
  const link = (href, label) =>
    el("a", { href, class: active === label ? "active" : null }, label);

  const q = order ? `?order=${encodeURIComponent(order)}` : "";
  mount.append(
    el("div", { class: "user" }, AGENT.id),
    el("div", { class: "navgroup" },
      el("h4", {}, "Workspace"),
      link("index.html", "Order Queue"),
      link(`order.html${q}`, "Order Detail"),
      link(`document.html${q}`, "Document Viewer"),
      link(`swap.html${q}`, "Swap Tool")),
    el("div", { class: "navgroup" },
      el("h4", {}, "Helpful Links"),
      el("a", { href: "#", onclick: stub }, "Information Inquiry"),
      el("a", { href: "#", onclick: stub }, "Upload Image"),
      el("a", { href: "#", onclick: stub }, "Rx Update Wizard"),
      el("a", { href: "#", onclick: stub }, "Verification Desk")),
    el("div", { class: "navgroup" },
      el("h4", {}, "Build"),
      el("div", { class: "muted", style: "padding:2px 12px;font-size:11px" }, "Version 4.2.1180.7"))
  );
}

function stub(ev) {
  ev.preventDefault();
  toast("This link is inactive in the demo.");
}

/* Transient status message pinned under the page title. */
function toast(msg, kind = "") {
  let box = $("#toast");
  if (!box) {
    box = el("div", { id: "toast" });
    const c = $(".content");
    c.insertBefore(box, c.firstChild.nextSibling || null);
  }
  box.className = "notice " + kind;
  box.textContent = msg;
  box.scrollIntoView({ block: "nearest" });
  clearTimeout(box._t);
  box._t = setTimeout(() => box.remove(), 4200);
}

/* Builds the page skeleton and returns the content element. */
function layout(activeNav, order) {
  const body = document.body;
  const shell = el("div", { class: "shell" });
  const side = el("nav", { class: "sidebar" });
  const content = el("main", { class: "content" });
  shell.append(side, content);
  body.append(shell);
  renderAppBar(body);
  renderSidebar(side, activeNav, order);
  return content;
}

function tabs(orderId, active) {
  const q = `?order=${encodeURIComponent(orderId)}`;
  const mk = (href, label) =>
    el("a", { href, class: label === active ? "active" : null }, label);
  return el("nav", { class: "tabs" },
    mk(`document.html${q}`, "Documents"),
    mk(`order.html${q}`, "Order"),
    mk(`swap.html${q}`, "Rx / Swap"));
}

function badge(text, kind) { return el("span", { class: `badge ${kind || "grey"}` }, text); }

/* Shown when a page is opened without a valid ?order= value. */
function notFound(content, msg) {
  content.append(
    el("h2", { class: "page-title" }, "Order not found"),
    el("div", { class: "notice" }, msg || "No order was selected."),
    el("a", { class: "btn primary", href: "index.html" }, "Back to Order Queue"));
}
