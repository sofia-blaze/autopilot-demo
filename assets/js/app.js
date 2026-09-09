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

/* ---------- free-text dates ----------
   Dates are typed by hand, so accept the formats an agent is likely to
   use: 09/30/2026, 9-30-26, 2026-09-30. Returns a Date, or null if the
   text is not a real calendar date (02/31/2026 is rejected). */
function makeDate(y, mo, d) {
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  const dt = new Date(y, mo - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== mo - 1 || dt.getDate() !== d) return null;
  dt.setHours(0, 0, 0, 0);
  return dt;
}

function parseDate(text) {
  const t = String(text || "").trim();
  if (!t) return null;
  let m;
  if ((m = t.match(/^(\d{4})[\/\-.](\d{1,2})[\/\-.](\d{1,2})$/)))
    return makeDate(+m[1], +m[2], +m[3]);
  if ((m = t.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2}|\d{4})$/))) {
    let y = +m[3];
    if (y < 100) y += y < 70 ? 2000 : 1900;
    return makeDate(y, +m[1], +m[2]);
  }
  return null;
}

function fmtDate(dt) {
  if (!dt) return "";
  const p = n => String(n).padStart(2, "0");
  return `${p(dt.getMonth() + 1)}/${p(dt.getDate())}/${dt.getFullYear()}`;
}

function today() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

const DATE_HINT = "MM/DD/YYYY";

/* ---------- review state ----------
   Tracks progress through the multi-screen verification. Like Edits it
   is per-session only. */
const Review = {
  key: id => `autopilot:review:${id}`,
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

/* Effective prescriber: a swap overrides the one on file, which may be null. */
function effectivePrescriber(o) {
  const e = Edits.get(o.id);
  if (e.prescriberName) {
    return {
      name: e.prescriberName, clinic: e.prescriberClinic || "—",
      phone: e.prescriberPhone || "—", npi: e.prescriberNpi || "—"
    };
  }
  return o.prescriber;
}

function effectiveItems(o) { return o.items.concat(AddedItems.get(o.id)); }

function effectiveDates(o) {
  const e = Edits.get(o.id);
  return {
    lastExam: e.lastExam ?? o.lastExam,
    expires: e.expires ?? o.expires,
    issueDate: e.issueDate ?? o.issueDate
  };
}

/* The five stages an order must clear before it can be submitted.
   Stages already satisfied by the order data start out complete. */
function reviewSteps(o) {
  const e = Edits.get(o.id);
  const r = Review.get(o.id);
  const d = effectiveDates(o);
  return [
    { key: "dates", label: "Enter prescription dates", where: "Order", page: `order.html?order=${o.id}`,
      done: !!(d.lastExam && d.expires && d.issueDate) },
    { key: "codes", label: "Select reason code and order options", where: "Order", page: `order.html?order=${o.id}`,
      done: !!(e.reasonCode && e.orderOptions) },
    { key: "document", label: "Review the linked document", where: "Document", page: `document.html?order=${o.id}`,
      done: !!r.docReviewed },
    { key: "prescriber", label: "Assign a prescriber", where: "Swap Tool", page: `swap.html?order=${o.id}`,
      done: !!effectivePrescriber(o) },
    { key: "items", label: "Add at least one Rx line item", where: "Swap Tool", page: `swap.html?order=${o.id}`,
      done: effectiveItems(o).length > 0 }
  ];
}

function isSubmitted(o) { return !!Review.get(o.id).submitted; }

/* Progress tracker shown at the top of every order screen. */
function checklistPanel(o, currentStepKey) {
  const steps = reviewSteps(o);
  const doneCount = steps.filter(s => s.done).length;
  const submitted = isSubmitted(o);

  const rows = steps.map((s, i) => {
    const isHere = s.key === currentStepKey;
    return el("tr", { class: isHere ? null : "clickable", onclick: isHere ? null : () => location.href = s.page },
      el("td", { class: "num", style: "width:32px" }, i + 1),
      el("td", {}, s.done ? badge("Done", "ok") : badge("Pending", "warn")),
      el("td", {}, s.label, isHere ? el("span", { class: "muted" }, "  \u2190 you are here") : null),
      el("td", { class: "muted" }, s.where));
  });

  const pct = Math.round((doneCount / steps.length) * 100);
  return el("section", { class: "panel" },
    el("header", {}, "Verification Progress",
      el("div", { class: "spacer" }),
      el("span", { style: "color:#c9d6ef;font-weight:400" },
        submitted ? "Submitted" : `${doneCount} of ${steps.length} complete (${pct}%)`)),
    el("div", { class: "body tight" },
      el("table", { class: "grid" }, el("tbody", {}, ...rows))));
}
