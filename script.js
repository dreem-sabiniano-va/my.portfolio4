(() => {
  "use strict";
  const C = window.PORTFOLIO_CONTENT;
  if (!C) return;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.add("js");

  const esc = (s) => String(s).replace(/[&<>"]/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m]));
  const get = (o, p) => p.split(".").reduce((a, k) => (a == null ? a : a[k]), o);

  /* ---------- line-art icons (24px grid) ---------- */
  const ICONS = {
    folder: "M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
    mail: "M3 6h18v12H3z M3 7l9 7 9-7",
    calendar: "M4 6h16v14H4z M4 10h16 M8 3v4 M16 3v4",
    box: "M12 3l8 4v10l-8 4-8-4V7z M4 7l8 4 8-4 M12 11v10",
    layout: "M4 4h16v16H4z M4 9h16 M9 9v11",
    tasks: "M5 6l2 2 3-3 M5 14l2 2 3-3 M13 7h7 M13 15h7",
    table: "M4 5h16v14H4z M4 10h16 M4 15h16 M10 5v14",
    search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z M21 21l-5-5",
    check: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M8 12l3 3 5-6",
    chart: "M4 20V4 M4 20h16 M8 16v-5 M13 16V8 M18 16v-3"
  };
  const icon = (n) => `<svg class="ic" viewBox="0 0 24 24" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="${ICONS[n] || ICONS.check}"/></svg>`;
  const SPARKLE = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 2c.6 5 2.4 7.4 8 10-5.6 2.6-7.4 5-8 10-.6-5-2.4-7.4-8-10 5.6-2.6 7.4-5 8-10z"/></svg>';
  const FLOWER = '<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" aria-hidden="true" focusable="false"><g transform="translate(50 50)">' +
    [0, 72, 144, 216, 288].map((a) => `<ellipse cx="0" cy="-22" rx="9" ry="20" transform="rotate(${a})"/>`).join("") +
    '<circle r="5"/></g><path d="M50 74c0 12-6 18-14 24"/></svg>';
  const DIVIDER = '<svg viewBox="0 0 1000 28" preserveAspectRatio="none" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M2 15c60-9 90 8 150 0s90-9 150-1 90 8 150 0 90-8 140 0"/><path d="M548 15c50 8 90-8 140 0s90 9 150 1 90-8 160 0"/><path fill="currentColor" stroke="none" d="M500 3c.6 5.5 2.6 8 8 11-5.4 3-7.4 5.5-8 11-.6-5.5-2.6-8-8-11 5.4-3 7.4-5.500 8-11z"/></svg>';

  /* ---------- links and placeholders ---------- */
  const calendly = C.links.calendly;
  const calendlyReady = !/^\[/.test(calendly);
  const resolve = (path) => (path === "links.calendly" ? (calendlyReady ? calendly : "#contact") : get(C, path));

  $$("[data-c]").forEach((el) => { const v = get(C, el.dataset.c); if (v != null) el.textContent = v; });
  $$("[data-href]").forEach((el) => {
    const h = resolve(el.dataset.href);
    el.href = h;
    if (/^https?:/.test(h)) { el.target = "_blank"; el.rel = "noopener"; }
  });
  $$("[data-sp]").forEach((el) => { el.innerHTML = SPARKLE; });
  $$("[data-flower]").forEach((el) => { el.innerHTML = FLOWER; });
  $$(".divider").forEach((el) => { el.innerHTML = DIVIDER; });
  document.title = `${C.name} | ${C.role}`;

  const heroImg = $("#heroImg");
  heroImg.src = C.photos.hero;
  heroImg.alt = C.photos.heroAlt;
  const a = C.availability;
  const availLine = `${a.status} · ${a.hours} (${a.place})`;
  $("#availText").textContent = availLine;
  $("#availText2").textContent = availLine;

  /* ---------- nav ---------- */
  const nav = $("#nav");
  const toggle = $("#navToggle");
  nav.innerHTML = C.nav.map((n) => `<a href="${esc(n.href)}">${esc(n.label)}</a>`).join("");
  const setNav = (open) => {
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };
  toggle.addEventListener("click", () => setNav(!nav.classList.contains("open")));
  nav.addEventListener("click", (e) => { if (e.target.closest("a")) setNav(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && nav.classList.contains("open")) { setNav(false); toggle.focus(); } });

  /* ---------- helpers for staggered reveal ---------- */
  const stagger = (html, i) => `<li class="reveal" style="--d:${i * 70}ms">${html}</li>`;

  /* ---------- hero chips + quick facts ---------- */
  $("#heroChips").innerHTML = C.hero.chips.map((c, i) => stagger(`<span class="chip">${icon(c.icon)}${esc(c.label)}</span>`, i)).join("");
  const L = C.facts.labels;
  $("#facts").innerHTML = [
    [C.services.items.length, L.services],
    [C.projects.items.length, L.projects],
    [C.facts.toolkit, L.toolkit]
  ].map(([n, l], i) => `<div class="fact reveal" style="--d:${i * 70}ms"><strong>${esc(n)}</strong><span>${esc(l)}</span></div>`).join("");
  $$(".fact strong")[2].style.fontSize = "clamp(.95rem, 2.6vw, 1.35rem)";

  /* ---------- services ---------- */
  $("#serviceGrid").innerHTML = C.services.items.map((s, i) => stagger(
    `<article class="card service"><span class="ico">${icon(s.icon)}</span><h3>${esc(s.title)}</h3><p>${esc(s.description)}</p><div class="tags">${s.tags.slice(0, 3).map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div></article>`, i)).join("");

  /* ---------- "Do you need a VA?" test ---------- */
  const T = C.test;
  const list = $("#testList");
  const result = $("#testResult");
  const cta = $("#testCta");
  list.innerHTML = T.items.map((p, i) => `<li><label class="pick"><input type="checkbox" value="${i}"><span>${esc(p.text)}</span></label></li>`).join("");
  $("#testReset").textContent = T.reset;
  const updateTest = () => {
    const sel = $$("input:checked", list).map((i) => +i.value);
    if (!sel.length) {
      result.innerHTML = `<p class="count">0<small>${esc(T.resultLabel)}</small></p><p>${esc(T.empty)}</p>`;
      cta.textContent = T.ctaEmpty;
      cta.setAttribute("aria-disabled", "true");
      cta.href = "#test";
      return;
    }
    const svcs = [...new Set(sel.map((i) => T.items[i].service))];
    result.innerHTML = `<p class="count">${sel.length}<small>${esc(T.resultLabel)}</small></p><p class="helps">${esc(T.helps)}</p><div class="tags">${svcs.map((s) => `<span class="chip">${icon(C.services.items[s].icon)}${esc(C.services.items[s].title)}</span>`).join("")}</div>`;
    const body = `${T.bodyIntro}\n${sel.map((i) => `- ${T.items[i].text}`).join("\n")}\n\n${T.bodyOutro}`;
    cta.href = `${C.links.emailCompose}&su=${encodeURIComponent(T.subject)}&body=${encodeURIComponent(body)}`;
    cta.target = "_blank";
    cta.rel = "noopener";
    cta.textContent = T.cta;
    cta.removeAttribute("aria-disabled");
  };
  list.addEventListener("change", updateTest);
  cta.addEventListener("click", (e) => { if (cta.getAttribute("aria-disabled") === "true") e.preventDefault(); });
  $("#testReset").addEventListener("click", () => { $$("input", list).forEach((i) => (i.checked = false)); updateTest(); $("input", list).focus(); });
  updateTest();

  /* ---------- how I work ---------- */
  $("#steps").innerHTML = C.how.steps.map((s, i) => stagger(`<div class="step"><span class="ico">${icon(s.icon)}</span><div><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div></div>`, i)).join("");

  /* ---------- tools ---------- */
  const toolChip = (t) => `<span class="chip"><i aria-hidden="true">${esc(t[0])}</i>${esc(t)}</span>`;
  $("#toolGrid").innerHTML = C.tools.categories.map((c, i) => stagger(`<article class="card tool-cat"><h3>${esc(c.name)}</h3><div class="tags">${c.items.map(toolChip).join("")}</div></article>`, i)).join("");
  const all = C.tools.categories.flatMap((c) => c.items).map(toolChip).join("");
  $("#marquee").innerHTML = `<div class="marquee-track"><div class="group">${all}</div><div class="group" aria-hidden="true">${all}</div></div>`;

  /* ---------- projects with live previews ---------- */
  const P = C.projects;
  $("#projectGrid").innerHTML = P.items.map((p, i) => stagger(
    `<article class="card proj"><div class="thumb" data-src="${esc(p.preview || "")}" data-type="${esc(p.previewType || "web")}"><img src="${esc(p.poster)}" alt="${esc(p.alt)}" loading="lazy"></div><div class="proj-body"><div class="proj-meta"><span class="tag">${esc(p.category)}</span></div><h3>${esc(p.title)}</h3><p>${esc(p.description)}</p><span class="pill">${esc(p.sample ? P.sampleLabel : p.status)}</span><details class="case-study"><summary>Problem · Findings · Result</summary><dl><dt>Problem</dt><dd>${esc(p.problem || p.description)}</dd><dt>Findings</dt><dd>${esc(p.findings || `The sample focuses on ${p.category.toLowerCase()} and the organizing needs described above.`)}</dd><dt>Result</dt><dd>${esc(p.result || p.description)}</dd></dl></details><a class="project-link" href="${esc(p.url)}" target="_blank" rel="noopener">View project <span aria-hidden="true">↗</span></a></div></article>`, i)).join("");

  const loadPreview = (thumb) => {
    const src = thumb.dataset.src;
    if (!src || thumb.querySelector("iframe")) return;
    if (thumb.dataset.type === "pdf" && navigator.pdfViewerEnabled === false) return; /* phones can't inline PDFs: keep the poster */
    const f = document.createElement("iframe");
    f.tabIndex = -1;
    f.title = "";
    f.setAttribute("aria-hidden", "true");
    f.referrerPolicy = "no-referrer";
    if (thumb.dataset.type !== "pdf") f.setAttribute("sandbox", "allow-scripts allow-same-origin");
    const giveUp = () => f.remove(); /* poster image stays visible underneath */
    const timer = setTimeout(giveUp, 4000);
    f.addEventListener("load", () => { clearTimeout(timer); f.classList.add("live"); });
    f.addEventListener("error", () => { clearTimeout(timer); giveUp(); });
    f.src = src;
    thumb.appendChild(f);
  };
  const scaleThumbs = () => $$(".thumb").forEach((t) => t.style.setProperty("--s", t.clientWidth / 1200));
  scaleThumbs();
  addEventListener("resize", scaleThumbs);
  if ("IntersectionObserver" in window) {
    const po = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { po.unobserve(e.target); loadPreview(e.target); } }), { rootMargin: "200px" });
    $$(".thumb").forEach((t) => po.observe(t));
  } else {
    $$(".thumb").forEach(loadPreview);
  }

  /* ---------- FAQ ---------- */
  const fill = (s) => s.replace("{hours}", a.hours).replace("{availability}", a.status);
  $("#faqList").innerHTML = C.faq.items.map((f) => `<details class="reveal"><summary>${esc(f.q)}</summary><p>${esc(fill(f.a))}</p></details>`).join("");

  /* ---------- contact ---------- */
  const K = C.contact;
  const copyBtn = $("#copyEmail");
  copyBtn.textContent = K.copy;
  const emailLink = $("#emailLink"); emailLink.href = C.links.emailCompose; emailLink.textContent = K.emailLabel;
  const li = $("#liLink"); li.href = C.links.linkedin; li.textContent = K.linkedin;
  const oj = $("#ojLink"); oj.href = C.links.onlinejobs; oj.textContent = K.onlinejobs;
  const done = () => { $("#copyStatus").textContent = K.copied; copyBtn.textContent = K.copied; setTimeout(() => { copyBtn.textContent = K.copy; $("#copyStatus").textContent = ""; }, 2000); };
  copyBtn.addEventListener("click", () => {
    const fallback = () => { const t = document.createElement("textarea"); t.value = C.email; document.body.appendChild(t); t.select(); try { document.execCommand("copy"); done(); } catch (e) { /* ignore */ } t.remove(); };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(C.email).then(done, fallback); else fallback();
  });

  /* ---------- scroll reveal ---------- */
  const reveals = $$(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("in"));
  } else {
    const ro = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); ro.unobserve(e.target); } }), { threshold: .12 });
    reveals.forEach((el) => ro.observe(el));
  }

  /* ---------- subtle hero parallax ---------- */
  const px = $("#parallax");
  if (!reduce && px) {
    let ticking = false;
    addEventListener("scroll", () => {
      if (ticking || scrollY > 900) return;
      ticking = true;
      requestAnimationFrame(() => { px.style.transform = `translateY(${Math.min(scrollY * 0.06, 36)}px)`; ticking = false; });
    }, { passive: true });
  }
})();
