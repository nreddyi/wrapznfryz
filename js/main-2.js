/* =========================================================
   Wrapz N Fryz — Option 2 interactions
   ========================================================= */
(() => {
  "use strict";
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const C = "images/clipart/";
  const ORDER = "https://order.wrapznfryz.com/home";
  const rand = a => a[Math.floor(Math.random() * a.length)];

  /* ---------- Toast ---------- */
  const toast = $("#toast"); let tt;
  const say = m => { toast.textContent = m; toast.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove("show"), 2600); };

  /* ---------- Nav hide on scroll ---------- */
  const nav = $("#nav"); let lastY = 0;
  addEventListener("scroll", () => { const y = scrollY; nav.classList.toggle("is-hidden", y > lastY && y > 400); lastY = y; }, { passive: true });

  /* ---------- Cursor fry (mouse only) ---------- */
  const cf = $("#cursorFry");
  if (matchMedia("(pointer: fine)").matches && !reduce) {
    let mx = -100, my = -100, x = -100, y = -100, px = 0;
    addEventListener("mousemove", e => { mx = e.clientX; my = e.clientY; document.body.classList.add("has-cursor"); });
    document.addEventListener("mouseleave", () => document.body.classList.remove("has-cursor"));
    (function loop() {
      x += (mx - x) * .14; y += (my - y) * .14;
      const tilt = Math.max(-25, Math.min(25, (x - px) * 2)); px = x;
      cf.style.transform = `translate(${x + 14}px, ${y + 14}px) rotate(${tilt}deg)`;
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- Hero: sticker slap ---------- */
  const slapZone = $("#slapZone");
  const slapArt = ["star.svg", "thumbs-up.svg", "dip-red.svg", "cheese.svg", "chilli.svg", "tomato.svg", "fries-box.svg", "ok-hand.svg", "thumbs-peace.svg", "onion-ring.svg"];
  let slaps = 0;
  slapZone.addEventListener("click", e => {
    if (e.target.closest("a, button")) return;
    const r = slapZone.getBoundingClientRect();
    const s = document.createElement("img");
    s.src = C + rand(slapArt); s.alt = ""; s.className = "slap";
    s.style.left = (e.clientX - r.left - 37) + "px";
    s.style.top = (e.clientY - r.top - 37) + "px";
    s.style.setProperty("--rot", (Math.random() * 50 - 25) + "deg");
    slapZone.appendChild(s);
    slaps++;
    const lines = { 5: "Okay Picasso 🎨", 12: "You're decorating our website. Bold.", 25: "This is art now. We can't remove it.", 40: "Please. Just order a wrap. 🥲" };
    if (lines[slaps]) say(lines[slaps]);
    if ($$(".slap", slapZone).length > 45) $(".slap", slapZone).remove();
  });

  /* ---------- Hero: snack-o-clock ---------- */
  const clock = $("#clock"), verdict = $("#clockVerdict");
  function tick() {
    const d = new Date(), h = d.getHours();
    clock.textContent = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    let v;
    if (h < 6) v = "Midnight snack hours. No judgement, only wraps.";
    else if (h < 11) v = "Too early for fryz? Never heard of her.";
    else if (h < 15) v = "Lunch o'clock. Your desk deserves a wrap.";
    else if (h < 18) v = "Peak 4 pm hunger. Scientifically wrap time.";
    else if (h < 22) v = "Dinner? Snack? Both? Correct answer: both.";
    else v = "Late night fryz hit different. Just saying.";
    verdict.textContent = v;
  }
  tick(); setInterval(tick, 15000);

  /* ---------- Menu + receipt ---------- */
  const T = { blue: "#D6E4F8", yellow: "#FDF0C2", red: "#FDD4D1" };
  const DISHES = {
    wraps: [
      { n: "Classic Veggie", v: true, i: "lettuce.svg", bg: T.blue, d: "The OG. Crunchy veg, zero drama." },
      { n: "Butter Garlic Mushroom", v: true, i: "mushrooms.svg", bg: T.yellow, d: "Mushrooms that went to finishing school." },
      { n: "Crispy Paneer", v: true, i: "wraps-duo.svg", bg: T.red, d: "Paneer, but make it crunchy." },
      { n: "Cheesy Paneer", v: true, i: "cheese.svg", bg: T.yellow, d: "Paneer + cheese. A love story." },
      { n: "Crispy Chicken", v: false, i: "wrap-bite-hand.svg", bg: T.blue, d: "Crunch you can hear from the next table." },
      { n: "Chilli Chicken", v: false, i: "chilli.svg", bg: T.red, d: "Spicy enough to make you call your mom." },
      { n: "Smoky Tandoori Chicken", v: false, i: "tomato.svg", bg: T.yellow, d: "Smells like a barbecue. Tastes like a hug." },
      { n: "Cheesy Mexican Chicken", v: false, i: "onions.svg", bg: T.blue, d: "Went to Mexico. Came back cheesy." },
      { n: "Fully Loaded Chicken", v: false, i: "wrap-in-hand.svg", bg: T.red, d: "Everything. Literally everything." }
    ],
    fryz: [
      { n: "Salted Fryz", v: true, i: "fries-box.svg", bg: T.yellow, d: "Hand-cut, double-fried, salted just right." },
      { n: "Cheesy Loaded Fryz", v: true, i: "loaded-fries.svg", bg: T.red, d: "Fryz wearing a cheese blanket." },
      { n: "Plain Fryz", v: true, i: "fries-and-sticks.svg", bg: T.blue, d: "For purists. We respect you." }
    ],
    more: [
      { n: "UFO Wraps", v: null, i: "ufo.svg", bg: T.blue, d: "Sealed, toasted, out of this world." },
      { n: "Thick Shakes", v: true, i: "shake.svg", bg: T.yellow, d: "Straw stands up on its own. That's the test." },
      { n: "Mojitos", v: true, i: "mojito.svg", bg: T.blue, d: "Fizzy, minty, slightly smug." },
      { n: "Desserts", v: true, i: "dessert.svg", bg: T.red, d: "The second stomach is real. Science." }
    ]
  };
  const dishesEl = $("#dishes");
  function renderDishes(cat) {
    dishesEl.innerHTML = DISHES[cat].map((x, k) => `
      <li class="dish" data-name="${x.n}" style="animation-delay:${k * 50}ms" tabindex="0" role="button" aria-label="Add ${x.n}">
        <div class="dish__img" style="background:${x.bg}"><img src="${C}${x.i}" alt=""></div>
        <div><h3>${x.n} ${x.v === null ? "" : `<span class="dot ${x.v ? "dot--veg" : "dot--non"}" title="${x.v ? "Veg" : "Non-veg"}"></span>`}</h3><p>${x.d}</p></div>
        <span class="dish__add" aria-hidden="true">+</span>
      </li>`).join("");
  }
  $$(".tab").forEach(t => t.addEventListener("click", () => {
    $$(".tab").forEach(x => x.classList.toggle("is-on", x === t));
    renderDishes(t.dataset.cat);
  }));
  renderDishes("wraps");

  const rItems = $("#rItems"), rNap = $("#rNapkins"), rHappy = $("#rHappy"), paper = $("#receipt-paper");
  const order = new Map();
  $("#receiptDate").textContent = new Date().toLocaleString([], { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  const sideNotes = ["+ extra napkins", "+ 1 happy dance", "+ sauce on shirt (free)", "+ 0 regrets", "+ envy from friends"];

  function renderReceipt() {
    if (!order.size) {
      rItems.innerHTML = `<li class="r-empty">Nothing yet. Your stomach is filing a complaint.</li>`;
      rNap.textContent = "x0"; rHappy.textContent = "0%"; return;
    }
    let count = 0, html = "";
    order.forEach((q, n) => { count += q; html += `<li><span>${q} × ${n}</span><span>♥</span></li>`; });
    html += `<li><span class="small">${sideNotes[count % sideNotes.length]}</span><span>FREE</span></li>`;
    rItems.innerHTML = html;
    rNap.textContent = "x" + count * 3;
    rHappy.textContent = Math.min(100, count * 23) + (count * 23 > 100 ? "% (capped, legally)" : "%");
  }
  function addDish(li) {
    const n = li.dataset.name;
    order.set(n, (order.get(n) || 0) + 1);
    li.classList.remove("bump"); void li.offsetWidth; li.classList.add("bump");
    renderReceipt();
    const total = [...order.values()].reduce((a, b) => a + b, 0);
    if (total === 5) say("Five items. Feeding a family or just yourself? (We support both.)");
    if (total === 10) say("Ten?! You're a legend. Now order for real 👀");
  }
  dishesEl.addEventListener("click", e => { const li = e.target.closest(".dish"); if (li) addDish(li); });
  dishesEl.addEventListener("keydown", e => { if ((e.key === "Enter" || e.key === " ") && e.target.matches(".dish")) { e.preventDefault(); addDish(e.target); } });
  $("#rClear").addEventListener("click", () => {
    if (!order.size) { say("It's already empty. Like my fridge."); return; }
    paper.classList.add("tear");
    setTimeout(() => { order.clear(); renderReceipt(); paper.classList.remove("tear"); say("Receipt destroyed. Feelings remain."); }, reduce ? 0 : 500);
  });

  /* ---------- Fortune fry ---------- */
  const FORTUNES = [
    "You will drop sauce on your shirt today. It will be worth it.",
    "A wrap is in your near future. Possibly in the next 20 minutes.",
    "Someone will ask for 'just one fry'. They are lying.",
    "Your lucky number is two. As in, two wraps.",
    "Trust your gut. Your gut says: loaded fryz.",
    "Great things come to those who wait. Fryz come to those who order.",
    "You will make a new friend today. Their name is Cheesy Paneer.",
    "Avoid big decisions today. Except which dip. That one matters.",
    "The stars align for a thick shake. Do not fight the stars.",
    "Your diet starts tomorrow. As it has every day since 2019.",
    "A mysterious UFO will appear before you. Eat it.",
    "You are the main character. Main characters get extra fryz."
  ];
  const box = $("#fortuneBox"), slip = $("#fortuneSlip"), fCount = $("#fortuneCount");
  let fortunes = 0, lastF = -1;
  box.addEventListener("click", () => {
    let k; do { k = Math.floor(Math.random() * FORTUNES.length); } while (k === lastF); lastF = k;
    fortunes++;
    box.classList.remove("shake"); void box.offsetWidth; box.classList.add("shake");
    slip.innerHTML = `<span>${FORTUNES[k]}</span>`;
    slip.style.setProperty("--n", fortunes);
    slip.classList.remove("pop"); void slip.offsetWidth; slip.classList.add("pop");
    fCount.textContent = `Fortunes told today: ${fortunes}` + (fortunes >= 8 ? " (you're addicted)" : "");
    if (!reduce) for (let i = 0; i < 6; i++) {
      const f = document.createElement("span"); f.className = "flying-fry";
      f.style.setProperty("--fx", (Math.random() * 360 - 180) + "px");
      f.style.setProperty("--fy", (-120 - Math.random() * 140) + "px");
      f.style.setProperty("--fr", (Math.random() * 400 - 200) + "deg");
      box.parentElement.appendChild(f);
      f.addEventListener("animationend", () => f.remove());
    }
  });

  /* ---------- Horizontal story scroll (desktop) ---------- */
  const story = $("#story"), track = $("#storyTrack");
  function storyScroll() {
    if (innerWidth <= 1000 || reduce) { track.style.transform = ""; return; }
    const r = story.getBoundingClientRect();
    const max = story.offsetHeight - innerHeight;
    const p = Math.min(1, Math.max(0, -r.top / max));
    const dist = track.scrollWidth - (innerWidth - track.getBoundingClientRect().left) + 60;
    track.style.transform = `translateX(${-p * Math.max(0, dist)}px)`;
  }
  addEventListener("scroll", storyScroll, { passive: true });
  addEventListener("resize", storyScroll);
  storyScroll();

  /* ---------- Quiz ---------- */
  const QUIZ = [
    { q: "It's Friday night. You are…", a: [["🛋️", "Horizontal on the couch", "c"], ["🎉", "Out with the whole gang", "f"], ["🌶️", "Doing something reckless", "s"], ["📚", "Pretending to be productive", "v"]] },
    { q: "Pick a texture. Don't overthink it.", a: [["🥨", "Crunchy, obviously", "f"], ["🧀", "Gooey and melty", "c"], ["🔥", "Smoky and charred", "s"], ["🥬", "Fresh and crisp", "v"]] },
    { q: "Your group chat calls you…", a: [["😇", "The reliable one", "v"], ["🤪", "The chaotic one", "s"], ["🫶", "The one who shares food", "f"], ["😴", "The one who never replies", "c"]] }
  ];
  const RESULTS = {
    c: { img: "cheese.svg", t: "Cheesy Paneer", d: "Soft on the outside, softer on the inside. You are comfort in wrap form and everyone secretly wants to be you." },
    f: { img: "loaded-fries.svg", t: "Cheesy Loaded Fryz", d: "Made for sharing, impossible to share. You're the life of every table and you always leave crumbs (of joy)." },
    s: { img: "chilli.svg", t: "Chilli Chicken", d: "Spicy, bold, a little dramatic. People can't handle you, and honestly? Their loss." },
    v: { img: "lettuce.svg", t: "Classic Veggie", d: "Fresh, dependable, quietly iconic. You're the friend who remembers birthdays. We love you." }
  };
  const quizCard = $("#quizCard");
  let step = 0, score = {};
  function renderQuiz() {
    if (step >= QUIZ.length) {
      const win = Object.entries(score).sort((a, b) => b[1] - a[1])[0][0];
      const r = RESULTS[win];
      quizCard.innerHTML = `
        <div class="q-result">
          <img src="${C}${r.img}" alt="">
          <p class="mono">You are…</p>
          <h3><em>${r.t}</em></h3>
          <p>${r.d}</p>
          <div class="row" style="justify-content:center">
            <a class="pill pill--blue" href="${ORDER}" target="_blank" rel="noopener">Order your spirit food ↗</a>
            <button class="pill pill--ghost" id="qAgain">Retake (we won't tell)</button>
          </div>
        </div>`;
      $("#qAgain").addEventListener("click", () => { step = 0; score = {}; renderQuiz(); });
      return;
    }
    const s = QUIZ[step];
    quizCard.innerHTML = `
      <div class="q-progress">${QUIZ.map((_, k) => `<i class="${k <= step ? "on" : ""}"></i>`).join("")}</div>
      <div class="q-step">
        <p class="mono small">Question ${step + 1} of ${QUIZ.length}</p>
        <h3>${s.q}</h3>
        <div class="q-opts">${s.a.map(([e, t, k]) => `<button class="q-opt" data-k="${k}"><span>${e}</span>${t}</button>`).join("")}</div>
      </div>`;
    $$(".q-opt", quizCard).forEach(b => b.addEventListener("click", () => {
      score[b.dataset.k] = (score[b.dataset.k] || 0) + 1; step++; renderQuiz();
    }));
  }
  renderQuiz();

  /* ---------- Reveal ---------- */
  $$(".sec__head, .fortune__card, .quiz__card, .vtile, .receipt-wrap").forEach(el => el.classList.add("reveal"));
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 });
  $$(".reveal").forEach(el => io.observe(el));

  /* ---------- Misc ---------- */
  $("#year").textContent = new Date().getFullYear();
})();
