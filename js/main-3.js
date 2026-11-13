/* =========================================================
   Wrapz N Fryz — Option 3 interactions ("Corporate, but funny")
   ========================================================= */
(() => {
  "use strict";
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const C = "images/clipart/";
  const ORDER = "https://order.wrapznfryz.com/home";

  /* ---------- Toast ---------- */
  const toast = $("#toast"); let tt;
  const say = m => { toast.textContent = m; toast.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove("show"), 2800); };

  /* ---------- Nav ---------- */
  const nav = $("#nav"), burger = $("#burger");
  burger.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    burger.setAttribute("aria-expanded", String(open));
  });
  $$("#navLinks a").forEach(a => a.addEventListener("click", () => { nav.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); }));
  addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 40), { passive: true });

  /* ---------- Fake stock ticker (always ends up, obviously) ---------- */
  const tick = $("#tick"); let val = 4.2;
  setInterval(() => {
    val = Math.max(.4, val + (Math.random() - .42) * .8);
    const up = Math.random() > .25;
    tick.textContent = (up ? "▲ " : "▼ ") + val.toFixed(2) + "%";
    tick.classList.toggle("down", !up);
  }, 2200);

  /* ---------- Count-up numbers ---------- */
  function countUp(el) {
    const target = parseFloat(el.dataset.count), suf = el.dataset.suffix || "";
    const dec = (el.dataset.count.split(".")[1] || "").length;
    if (reduce) { el.textContent = target.toFixed(dec) + suf; return; }
    const t0 = performance.now(), dur = 1400;
    (function step(t) {
      const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * e).toFixed(dec) + suf;
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }

  /* ---------- Catalogue ---------- */
  const T = { y: "#FEF6D6", r: "#FEE4E2", b: "#E1ECFA" };
  const LINES = {
    wraps: [
      ["Classic Veggie", "lettuce.svg", T.b, true, "Crunchy veg, zero drama", 1, "Very low"],
      ["Butter Garlic Mushroom", "mushrooms.svg", T.y, true, "Mushrooms with a finishing-school education", 1, "Low"],
      ["Crispy Paneer", "wraps-duo.svg", T.r, true, "Paneer, but crunchy", 2, "Moderate (addictive)"],
      ["Cheesy Paneer", "cheese.svg", T.y, true, "Paneer × cheese synergy", 2, "Moderate (stretchy)"],
      ["Crispy Chicken", "wrap-bite-hand.svg", T.b, false, "Audible crunch at 3 metres", 2, "Moderate"],
      ["Chilli Chicken", "chilli.svg", T.r, false, "Spice levels may trigger phone calls to mom", 4, "High (spicy)"],
      ["Smoky Tandoori Chicken", "tomato.svg", T.y, false, "Smells like a barbecue, tastes like a hug", 3, "Elevated (cravings)"],
      ["Cheesy Mexican Chicken", "onions.svg", T.b, false, "International exposure, cheesy returns", 3, "Elevated"],
      ["Fully Loaded Chicken", "wrap-in-hand.svg", T.r, false, "Everything. Literally everything.", 5, "Extreme (food coma)"]
    ],
    fryz: [
      ["Salted Fryz", "fries-box.svg", T.y, true, "Hand-cut, double-fried, correctly salted", 2, "Moderate (sharing disputes)"],
      ["Cheesy Loaded Fryz", "loaded-fries.svg", T.r, true, "Fryz under a cheese blanket", 4, "High (no survivors)"],
      ["Plain Fryz", "fries-and-sticks.svg", T.b, true, "For purists. Respect.", 1, "Low"]
    ],
    more: [
      ["UFO Wraps", "ufo.svg", T.b, null, "Sealed, toasted, classified", 3, "Unknown (classified)"],
      ["Thick Shakes", "shake.svg", T.y, true, "Straw-stands-up certified", 2, "Brain freeze"],
      ["Mojitos", "mojito.svg", T.b, true, "Mint compliance, fizz enabled", 1, "Very low"],
      ["Desserts", "dessert.svg", T.r, true, "Second-stomach activation", 3, "Elevated (sweet)"]
    ]
  };
  const prefix = { wraps: "WRP", fryz: "FRZ", more: "UFO" };
  const body = $("#catBody");
  function renderLine(line) {
    body.innerHTML = LINES[line].map(([name, img, bg, veg, feat, risk, label], k) => {
      const chip = veg === null ? `<span class="chip chip--na">Varies</span>` : veg ? `<span class="chip chip--veg">● Veg</span>` : `<span class="chip chip--non">● Non-veg</span>`;
      const bars = [1, 2, 3, 4, 5].map(n => `<i class="${n <= risk ? "on" : ""}"></i>`).join("");
      return `<tr style="animation-delay:${k * 40}ms">
        <td><div class="prod"><span class="prod__img" style="background:${bg}"><img src="${C}${img}" alt=""></span><div><b>${name}</b><small>${line === "wraps" ? "Wrap" : line === "fryz" ? "Fryz" : "Specialty"}</small></div></div></td>
        <td class="sku">${prefix[line]}-${String(k + 1).padStart(3, "0")}</td>
        <td>${chip}</td>
        <td>${feat}</td>
        <td><span class="risk" aria-hidden="true">${bars}</span><span class="risk-label">${label}</span></td>
        <td><a class="add" href="${ORDER}" target="_blank" rel="noopener">Order →</a></td>
      </tr>`;
    }).join("");
  }
  $$(".seg__btn").forEach(b => b.addEventListener("click", () => {
    $$(".seg__btn").forEach(x => x.classList.toggle("is-on", x === b));
    renderLine(b.dataset.line);
  }));
  renderLine("wraps");

  /* ---------- Hunger chart (joke data) ---------- */
  const chart = $("#chart");
  // hours 8..24 ; hunger index peaks at 16 (4 pm), smaller bumps at lunch & late night
  const hours = Array.from({ length: 17 }, (_, i) => 8 + i);
  const index = h => Math.round(28 + 50 * Math.exp(-((h - 16) ** 2) / 4) + 30 * Math.exp(-((h - 13) ** 2) / 2.5) + 22 * Math.exp(-((h - 23) ** 2) / 3) + (h - 8) * 0.8);
  const vals = hours.map(index), max = Math.max(...vals);
  const label = h => (h % 12 || 12) + (h < 12 || h === 24 ? " AM" : " PM");
  const comments = { 13: "lunch: fine", 16: "PEAK. Order immediately.", 23: "the 11 pm itch", 8: "barely awake" };
  chart.innerHTML = hours.map((h, i) => `<div class="bar" data-h="${vals[i] / max * 100}"><span class="tip">${label(h)} · ${vals[i]}${comments[h] ? " · " + comments[h] : ""}</span></div>`).join("");
  function drawChart() {
    const now = new Date().getHours();
    $$(".bar", chart).forEach((b, i) => {
      b.style.height = b.dataset.h + "%";
      b.classList.toggle("now", hours[i] === now || (now < 8 && hours[i] === 24));
    });
    if (!$(".peak-flag", chart)) {
      const k = hours.indexOf(16), flag = document.createElement("span");
      flag.className = "peak-flag"; flag.textContent = "↓ 4 PM: peak hunger";
      flag.style.left = ((k + .5) / hours.length * 100) + "%";
      flag.style.top = (100 - vals[k] / max * 100) + "%";
      chart.appendChild(flag);
    }
  }

  /* ---------- ROI calculator ---------- */
  let team = 6;
  const teamOut = $("#teamSize"), meeting = $("#meeting"), vegTeam = $("#vegTeam"), alloc = $("#alloc");
  function calc() {
    const m = +meeting.value;
    const wraps = Math.ceil(team * (m === 3 ? 1.5 : 1));
    const fryz = Math.ceil(team / (m === 1 ? 3 : 2));
    const drinks = m === 1 ? 0 : team;
    const desserts = m === 3 ? Math.ceil(team / 2) : 0;
    const wrapName = vegTeam.checked ? "Crispy / Cheesy Paneer wraps" : "Assorted wraps (veg + chicken)";
    const rows = [[wraps, "wrap-in-hand.svg", wrapName], [fryz, "loaded-fries.svg", "Fryz (loaded, obviously)"]];
    if (drinks) rows.push([drinks, "shake.svg", "Thick shakes / mojitos"]);
    if (desserts) rows.push([desserts, "dessert.svg", "Desserts (emotional support)"]);
    alloc.innerHTML = rows.map(([n, img, t]) => `<li><img src="${C}${img}" alt=""><b>${n}</b><span>${t}</span></li>`).join("");
    $("#morale").textContent = "+" + Math.min(999, Math.round(team * 12 * m + 17)) + "%";
    $("#meetings").textContent = m === 1 ? "1 (this one)" : m === 2 ? "Most" : "All of them";
  }
  $$(".stepper button").forEach(b => b.addEventListener("click", () => {
    team = Math.max(1, Math.min(99, team + +b.dataset.step));
    teamOut.textContent = team;
    if (team === 1) say("Party of one. Respect. Self-care is a business priority.");
    if (team === 50) say("50 people? That's not a meeting, that's a festival.");
    calc();
  }));
  meeting.addEventListener("change", () => { if (meeting.value === "3") say("Quarterly planning detected. Desserts auto-added for morale."); calc(); });
  vegTeam.addEventListener("change", calc);
  calc();

  /* ---------- Cookie (wrap) banner ---------- */
  const cookie = $("#cookie"), no = $("#cookieNo");
  let dismissed = false;
  try { dismissed = sessionStorage.getItem("wnf-wraps") === "1"; } catch (e) {}
  if (!dismissed) setTimeout(() => cookie.classList.add("show"), 1800);
  const close = msg => { cookie.classList.remove("show"); say(msg); try { sessionStorage.setItem("wnf-wraps", "1"); } catch (e) {} };
  $("#cookieYes").addEventListener("click", () => close("Excellent decision. Legal has approved your hunger. ✅"));
  let dodges = 0;
  const dodge = () => {
    if (dodges >= 3) return;
    dodges++;
    no.style.transform = `translate(${(Math.random() * 120 - 60)}px, ${-(Math.random() * 40 + 10)}px)`;
    no.textContent = ["Nope, try again", "Still no", "Fine, click me"][dodges - 1];
    cookie.classList.add("runaway");
  };
  no.addEventListener("mouseenter", dodge);
  no.addEventListener("click", () => {
    if (dodges < 3 && matchMedia("(pointer: fine)").matches) { dodge(); return; }
    close("Declined. You'll still get hungry though. That's just biology.");
  });

  /* ---------- Reveal + triggers ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    el.classList.add("in");
    $$("[data-count]", el).forEach(countUp);
    if (el.matches("[data-count]")) countUp(el);
    if (el.id === "chart") drawChart();
    io.unobserve(el);
  }), { threshold: .2 });
  $$(".reveal").forEach(el => io.observe(el));
  $$(".dash__kpis").forEach(el => io.observe(el));
  io.observe(chart);

  $("#year").textContent = new Date().getFullYear();
})();
