/* =========================================================
   Wrapz N Fryz — interactions
   ========================================================= */
(() => {
  "use strict";

  const ORDER_URL = "https://order.wrapznfryz.com/home";
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Menu data ----------
     "photo" points at images/products/. If that file exists (run tools/get-photos.ps1
     or drop your own photos in), it replaces the cartoon automatically. */
  const C = "images/clipart/";
  const T = { blue: "#D6E4F8", yellow: "#FDF0C2", red: "#FDD4D1", cream: "#FFFFFF" };
  const MENU = [
    { cat: "wraps", name: "Classic Veggie", veg: true,  img: "lettuce.svg", photo: "classic-veggie.png",          bg: T.blue,   line: "The OG. Crunchy veg, zero drama.", tag: "starter pack" },
    { cat: "wraps", name: "Butter Garlic Mushroom", veg: true, img: "mushrooms.svg", photo: "butter-garlic-mushroom.png", bg: T.yellow, line: "Mushrooms that went to finishing school.", tag: "fancy-ish" },
    { cat: "wraps", name: "Crispy Paneer", veg: true,  img: "wraps-duo.svg", photo: "crispy-paneer.png",         bg: T.red,    line: "Paneer, but make it crunchy.", tag: "crowd fave" },
    { cat: "wraps", name: "Cheesy Paneer", veg: true,  img: "cheese.svg", photo: "cheesy-paneer.png",            bg: T.blue,   line: "Paneer + cheese. A love story.", tag: "extra cheesy" },
    { cat: "wraps", name: "Crispy Chicken", veg: false, img: "wrap-bite-hand.svg", photo: "crispy-chicken.png",  bg: T.yellow, line: "Crunch you can hear from the next table.", tag: "loud" },
    { cat: "wraps", name: "Chilli Chicken", veg: false, img: "chilli.svg", photo: "chilli-chicken.png",          bg: T.red,    line: "Spicy enough to make you call your mom.", tag: "🌶🌶🌶" },
    { cat: "wraps", name: "Smoky Tandoori Chicken", veg: false, img: "tomato.svg", photo: "smoky-tandoori-chicken.png", bg: T.yellow, line: "Smells like a barbecue. Tastes like a hug.", tag: "smoky af" },
    { cat: "wraps", name: "Cheesy Mexican Chicken", veg: false, img: "onions.svg", photo: "cheesy-mexican-chicken.png", bg: T.blue, line: "Took a vacation to Mexico, came back cheesy.", tag: "¡olé!" },
    { cat: "wraps", name: "Fully Loaded Chicken", veg: false, img: "wrap-in-hand.svg", photo: "fully-loaded-chicken.png", bg: T.red, line: "Everything. Literally everything.", tag: "boss level" },
    { cat: "fryz",  name: "Salted Fryz", veg: true,  img: "fries-box.svg", photo: "salted-fries.png",            bg: T.blue,   line: "Hand-cut, double-fried, salted just right.", tag: "classic" },
    { cat: "fryz",  name: "Cheesy Loaded Fryz", veg: true, img: "loaded-fries.svg", photo: "cheesy-loaded-fries.png", bg: T.yellow, line: "Fryz wearing a cheese blanket.", tag: "must try" },
    { cat: "fryz",  name: "Plain Fryz", veg: true,  img: "fries-and-sticks.svg", photo: "plain-fries.png",       bg: T.red,    line: "For purists. We respect you.", tag: "minimalist" },
    { cat: "ufo",   name: "UFO Wraps", veg: null,  img: "ufo.svg", photo: null,                                  bg: T.blue,   line: "Sealed, toasted, out of this world. Flavours on the order app.", tag: "abducts hunger" },
    { cat: "shakes", name: "Thick Shakes", veg: true, img: "shake.svg", photo: null,                             bg: T.yellow, line: "Blended right next to the fryer. Straw stands up solo.", tag: "brain freeze ok" },
    { cat: "mojitos", name: "Mojitos", veg: true, img: "mojito.svg", photo: null,                                bg: T.blue,   line: "Mint, lime, fizz. Cooler than Kukatpally in May.", tag: "chill pill" },
    { cat: "desserts", name: "Desserts", veg: true, img: "dessert.svg", photo: null,                             bg: T.red,    line: "The second stomach is real. Science.", tag: "treat yo self" }
  ];

  /* ---------- Nav: burger + hide on scroll ---------- */
  const nav = $("#nav"), burger = $("#burger"), links = $("#navLinks");
  burger.addEventListener("click", () => {
    const open = burger.getAttribute("aria-expanded") === "true";
    burger.setAttribute("aria-expanded", String(!open));
    links.classList.toggle("is-open", !open);
  });
  $$("a", links).forEach(a => a.addEventListener("click", () => {
    burger.setAttribute("aria-expanded", "false");
    links.classList.remove("is-open");
  }));
  let lastY = 0;
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    nav.classList.toggle("is-hidden", y > lastY && y > 300 && !links.classList.contains("is-open"));
    lastY = y;
  }, { passive: true });

  /* ---------- Toast ---------- */
  const toast = $("#toast");
  let toastTimer;
  function say(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
  }

  /* ---------- Menu render + filter ---------- */
  const grid = $("#menuGrid"), vegOnly = $("#vegOnly");
  let currentFilter = "all";

  function card(item, i) {
    const diet = item.veg === null ? "" :
      `<span class="diet ${item.veg ? "diet--veg" : "diet--non"}" title="${item.veg ? "Vegetarian" : "Non-vegetarian"}"></span>`;
    return `
      <article class="item" style="animation-delay:${i * 45}ms">
        <div class="item__img" style="background:${item.bg}">
          <img src="${C}${item.img}" alt="${item.name}" ${item.photo ? `data-photo="images/products/${item.photo}"` : ""} loading="lazy">
        </div>
        <div class="item__top"><h3>${item.name}</h3>${diet}</div>
        <p>${item.line}</p>
        <span class="item__tag">${item.tag}</span>
      </article>`;
  }

  function upgradePhotos() {
    $$("img[data-photo]", grid).forEach(img => {
      const test = new Image();
      test.onload = () => { img.src = test.src; img.classList.add("is-photo"); };
      test.src = img.dataset.photo;
    });
  }

  function renderMenu() {
    const list = MENU.filter(m =>
      (currentFilter === "all" || m.cat === currentFilter) &&
      (!vegOnly.checked || m.veg !== false));
    grid.innerHTML = list.length
      ? list.map(card).join("")
      : `<p class="menu__empty">Nothing here… yet. 🥲 Try another filter.</p>`;
    upgradePhotos();
  }

  function setFilter(f) {
    currentFilter = f;
    $$(".chip").forEach(c => c.classList.toggle("is-active", c.dataset.filter === f));
    renderMenu();
  }
  $$(".chip").forEach(c => c.addEventListener("click", () => setFilter(c.dataset.filter)));
  vegOnly.addEventListener("change", () => {
    renderMenu();
    if (vegOnly.checked) say("Veg mode ON 🌱 Paneer squad assemble!");
  });
  $$("[data-jump]").forEach(a => a.addEventListener("click", () => setFilter(a.dataset.jump)));
  renderMenu();

  /* ---------- Hero parallax + speech bubble ---------- */
  const art = $("#heroArt");
  if (art && !reduceMotion) {
    art.addEventListener("mousemove", e => {
      const r = art.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      $$(".mascot", art).forEach(m => {
        const d = +m.dataset.depth;
        m.style.transform = `translate(${x * d}px, ${y * d}px) rotate(${x * d / 4}deg)`;
      });
    });
    art.addEventListener("mouseleave", () => $$(".mascot", art).forEach(m => (m.style.transform = "")));
  }
  const lines = ["Pick me! 🙋", "Wraaaaap it up!", "Double fried 😎", "Good food, good mood", "Napkins? Never heard of them", "Hungry yet? 👀"];
  const speech = $("#speech");
  let li = 0;
  setInterval(() => {
    speech.style.opacity = 0;
    setTimeout(() => { li = (li + 1) % lines.length; speech.textContent = lines[li]; speech.style.opacity = 1; }, 300);
  }, 3000);

  /* ---------- Fry rain ---------- */
  function fryRain(count = 40) {
    if (reduceMotion) { say("🍟🍟🍟 (rain skipped — reduced motion)"); return; }
    const pics = ["fries-box.svg", "fries-box.svg", "wrap-in-hand.svg", "dip-red.svg", "cheese.svg", "star.svg", "dip-yellow.svg"];
    for (let i = 0; i < count; i++) {
      const f = document.createElement("img");
      f.className = "falling"; f.alt = "";
      f.src = C + pics[Math.floor(Math.random() * pics.length)];
      f.style.left = Math.random() * 100 + "vw";
      f.style.width = 36 + Math.random() * 44 + "px";
      f.style.animationDuration = 1.8 + Math.random() * 2 + "s";
      f.style.animationDelay = Math.random() * .8 + "s";
      f.style.setProperty("--r", (Math.random() * 720 - 360) + "deg");
      document.body.appendChild(f);
      f.addEventListener("animationend", () => f.remove());
    }
  }
  $("#fryRain").addEventListener("click", () => { fryRain(); say("It's raining fryz! Hallelujah 🍟"); });
  let fryClicks = 0;
  $("#friesMascot").addEventListener("click", () => {
    fryClicks++;
    fryRain(18);
    if (fryClicks === 3) say("Okay okay, you clearly need fryz. Order them already 😤");
  });

  /* ---------- Hunger-o-meter ---------- */
  const HUNGER = [
    { e: "🙂", t: "Just peckish", d: "A mojito and some plain fryz. Light, breezy, very main-character." },
    { e: "😋", t: "Snacky mode", d: "Salted fryz + a thick shake. Dip the fryz in the shake. Trust us." },
    { e: "🤤", t: "Certified hungry", d: "One wrap + one fryz. The classic duo. Like Ram & Shyam, but crunchier." },
    { e: "😤", t: "Hangry alert", d: "Fully Loaded Chicken (or Cheesy Paneer) + Cheesy Loaded Fryz. Don't talk to anyone until it's gone." },
    { e: "🦖", t: "FERAL", d: "Two wraps, loaded fryz, a shake AND dessert. We won't judge. We'll actually be impressed." }
  ];
  const range = $("#hungerRange"), hE = $("#hungerEmoji"), hT = $("#hungerTitle"), hD = $("#hungerText");
  range.addEventListener("input", () => {
    const h = HUNGER[range.value];
    hE.textContent = h.e; hT.textContent = h.t; hD.textContent = h.d;
    hE.classList.remove("bump"); void hE.offsetWidth; hE.classList.add("bump");
  });

  /* ---------- Wrap wheel ---------- */
  const wheelItems = MENU.filter(m => m.cat === "wraps").map(m => m.name);
  const colors = ["#0D5DBF", "#F8CB2D", "#F6271E", "#F9F8F3", "#0D5DBF", "#F8CB2D", "#F6271E", "#F9F8F3", "#0059AB"];
  const canvas = $("#wheelCanvas"), ctx = canvas.getContext("2d");
  const N = wheelItems.length, seg = 360 / N;

  function drawWheel() {
    const s = canvas.width, c = s / 2, r = c - 4;
    ctx.clearRect(0, 0, s, s);
    wheelItems.forEach((name, i) => {
      const a0 = (-90 + i * seg) * Math.PI / 180, a1 = (-90 + (i + 1) * seg) * Math.PI / 180;
      ctx.beginPath(); ctx.moveTo(c, c); ctx.arc(c, c, r, a0, a1); ctx.closePath();
      ctx.fillStyle = colors[i % colors.length]; ctx.fill();
      ctx.lineWidth = 4; ctx.strokeStyle = "#140D03"; ctx.stroke();
      ctx.save();
      ctx.translate(c, c); ctx.rotate((a0 + a1) / 2);
      ctx.textAlign = "right"; ctx.textBaseline = "middle";
      ctx.fillStyle = ["#F6271E", "#0D5DBF", "#0059AB"].includes(colors[i % colors.length]) ? "#fff" : "#140D03";
      ctx.font = "800 15px Rubik, 'DM Sans', sans-serif";
      const label = { "Butter Garlic Mushroom": "Butter Garlic", "Smoky Tandoori Chicken": "Smoky Tandoori",
        "Cheesy Mexican Chicken": "Cheesy Mexican", "Fully Loaded Chicken": "Fully Loaded" }[name] || name;
      ctx.fillText(label, r - 16, 0);
      ctx.restore();
    });
    ctx.beginPath(); ctx.arc(c, c, 34, 0, Math.PI * 2);
    ctx.fillStyle = "#F8CB2D"; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = "#140D03"; ctx.stroke();
    ctx.font = "900 15px Rubik, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillStyle = "#0059AB";
    ctx.fillText("WNF", c, c + 1);
  }
  drawWheel();
  if (document.fonts) document.fonts.ready.then(drawWheel);

  let rotation = 0, spinning = false;
  const spinBtn = $("#spinBtn"), result = $("#wheelResult");
  spinBtn.addEventListener("click", () => {
    if (spinning) return;
    spinning = true; spinBtn.disabled = true;
    result.textContent = "Spinning… 🥁";
    const pick = Math.floor(Math.random() * N);
    const target = (360 - (pick + .5) * seg) % 360;
    const current = ((rotation % 360) + 360) % 360;
    rotation += 360 * 5 + ((target - current + 360) % 360);
    canvas.style.transform = `rotate(${rotation}deg)`;
    const done = () => {
      spinning = false; spinBtn.disabled = false;
      result.innerHTML = `Fate says: <span>${wheelItems[pick]}</span>! <a href="${ORDER_URL}" target="_blank" rel="noopener">Order it →</a>`;
      confetti(spinBtn);
    };
    reduceMotion ? done() : setTimeout(done, 4300);
  });

  /* ---------- Confetti ---------- */
  function confetti(el) {
    if (reduceMotion) return;
    const r = el.getBoundingClientRect();
    for (let i = 0; i < 60; i++) {
      const p = document.createElement("span");
      p.className = "confetti";
      p.style.left = r.left + r.width / 2 + "px";
      p.style.top = r.top + r.height / 2 + "px";
      p.style.background = colors[i % colors.length];
      p.style.setProperty("--x", (Math.random() - .5) * 600 + "px");
      p.style.setProperty("--y", (Math.random() - .8) * 500 + "px");
      document.body.appendChild(p);
      p.addEventListener("animationend", () => p.remove());
    }
  }

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
  }, { threshold: .15 });
  $$(".reveal").forEach(el => io.observe(el));

  /* ---------- Gallery: drag to scroll ---------- */
  const track = $("#galleryTrack");
  if (track) {
    let down = false, sx = 0, sl = 0;
    track.addEventListener("pointerdown", e => { if (e.pointerType !== "mouse") return; down = true; sx = e.clientX; sl = track.scrollLeft; track.classList.add("is-dragging"); });
    window.addEventListener("pointermove", e => { if (down) track.scrollLeft = sl - (e.clientX - sx); });
    window.addEventListener("pointerup", () => { down = false; track.classList.remove("is-dragging"); });
  }

  /* ---------- Sticker board: drag stickers around ---------- */
  const board = $("#stickerBoard");
  if (board) {
    let z = 5, giggles = 0;
    $$(".drag", board).forEach(st => {
      st.addEventListener("dragstart", e => e.preventDefault());
      st.addEventListener("pointerdown", e => {
        e.preventDefault();
        st.setPointerCapture(e.pointerId);
        st.classList.add("is-grabbed"); st.style.zIndex = ++z;
        const b = board.getBoundingClientRect(), r = st.getBoundingClientRect();
        const ox = e.clientX - r.left, oy = e.clientY - r.top;
        const move = ev => {
          const x = Math.min(Math.max(ev.clientX - b.left - ox, -r.width * .3), b.width - r.width * .7);
          const y = Math.min(Math.max(ev.clientY - b.top - oy, -r.height * .3), b.height - r.height * .7);
          st.style.left = x + "px"; st.style.top = y + "px";
        };
        const up = () => {
          st.classList.remove("is-grabbed");
          st.removeEventListener("pointermove", move); st.removeEventListener("pointerup", up);
          st.style.transform = `rotate(${Math.round(Math.random() * 20 - 10)}deg)`;
          if (++giggles === 6) say("Interior designer of the year 🏆");
        };
        st.addEventListener("pointermove", move); st.addEventListener("pointerup", up);
      });
    });
  }

  /* ---------- Misc ---------- */
  $("#year").textContent = new Date().getFullYear();

  // Konami-ish easter egg: type "fryz"
  let buf = "";
  window.addEventListener("keydown", e => {
    buf = (buf + e.key.toLowerCase()).slice(-4);
    if (buf === "fryz") { fryRain(60); say("You found the secret. Free vibes, not free fryz 😅"); }
  });
})();
