/* Wrapz N Fryz — Option 6 ("Food & fun") */
(() => {
  "use strict";
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const C = "images/clipart/";

  /* ---------- Nav ---------- */
  const nav = $("#nav"), toggle = $("#toggle");
  addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 10), { passive: true });
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  $$("#navLinks a").forEach(a => a.addEventListener("click", () => { nav.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); }));

  /* ---------- Hero: ingredients follow the mouse ---------- */
  const art = $("#heroArt");
  if (art && !reduce && matchMedia("(pointer: fine)").matches) {
    art.addEventListener("mousemove", e => {
      const r = art.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      $$(".float", art).forEach(f => { const d = +f.dataset.d; f.style.transform = `translate(${x * d}px, ${y * d}px) rotate(${x * d / 2}deg)`; });
    });
    art.addEventListener("mouseleave", () => $$(".float", art).forEach(f => (f.style.transform = "")));
  }

  /* ---------- Menu data ---------- */
  const MENU = {
    wraps: [
      ["Classic Veggie", true, "Fresh, crunchy vegetables in a warm grilled wrap.", "lettuce.svg"],
      ["Butter Garlic Mushroom", true, "Mushrooms tossed in butter and garlic.", "mushrooms.svg"],
      ["Crispy Paneer", true, "Golden, crispy paneer with fresh veg.", "wraps-duo.svg"],
      ["Cheesy Paneer", true, "Paneer folded with melted cheese.", "cheese.svg"],
      ["Crispy Chicken", false, "Crunchy fried chicken and crisp greens.", "wrap-bite-hand.svg"],
      ["Chilli Chicken", false, "Chicken in a bold chilli glaze.", "chilli.svg"],
      ["Smoky Tandoori Chicken", false, "Tandoori-marinated chicken with a smoky char.", "tomato.svg"],
      ["Cheesy Mexican Chicken", false, "Mexican-spiced chicken under melted cheese.", "onions.svg"],
      ["Fully Loaded Chicken", false, "Our most generous wrap, packed to the edge.", "wrap-in-hand.svg"]
    ],
    fryz: [
      ["Salted Fryz", true, "Hand-cut, double-fried, perfectly salted.", "fries-box.svg"],
      ["Cheesy Loaded Fryz", true, "Double-fried fryz under melted cheese.", "loaded-fries.svg"],
      ["Plain Fryz", true, "Hand-cut and double-fried. Simple and golden.", "fries-and-sticks.svg"]
    ],
    more: [
      ["UFO Wraps", null, "A sealed, toasted round wrap with a hot filling.", "ufo.svg"],
      ["Thick Shakes", true, "Thick, cold and blended to order.", "shake.svg"],
      ["Mojitos", true, "Mint, lime and fizz.", "mojito.svg"],
      ["Desserts", true, "Something sweet to finish.", "dessert.svg"]
    ]
  };
  const colours = ["yellow", "cream", "red"];

  /* ---------- Carousel ---------- */
  const track = $("#track"), dots = $("#dots");
  function render(cat) {
    track.innerHTML = MENU[cat].map(([n, v, d, img], i) => `
      <article class="card card--${colours[i % 3]}" style="animation-delay:${i * 60}ms">
        <div class="card__img"><img src="${C}${img}" alt=""></div>
        <h3>${n}${v === null ? "" : ` <span class="diet ${v ? "diet--veg" : "diet--non"}">${v ? "Veg" : "Non-veg"}</span>`}</h3>
        <p>${d}</p>
      </article>`).join("");
    track.scrollLeft = 0;
    dots.innerHTML = MENU[cat].map((_, i) => `<i class="${i === 0 ? "on" : ""}"></i>`).join("");
  }
  function cardStep() { const c = $(".card", track); return c ? c.getBoundingClientRect().width + 22 : 300; }
  $("#prev").addEventListener("click", () => track.scrollBy({ left: -cardStep(), behavior: reduce ? "auto" : "smooth" }));
  $("#next").addEventListener("click", () => track.scrollBy({ left: cardStep(), behavior: reduce ? "auto" : "smooth" }));
  track.addEventListener("scroll", () => {
    const i = Math.round(track.scrollLeft / cardStep());
    $$("i", dots).forEach((d, k) => d.classList.toggle("on", k === Math.min(i, $$("i", dots).length - 1)));
  }, { passive: true });
  // drag to scroll with the mouse
  let down = false, sx = 0, sl = 0;
  track.addEventListener("pointerdown", e => { if (e.pointerType !== "mouse") return; down = true; sx = e.clientX; sl = track.scrollLeft; track.style.scrollSnapType = "none"; track.style.cursor = "grabbing"; });
  addEventListener("pointermove", e => { if (down) track.scrollLeft = sl - (e.clientX - sx); });
  addEventListener("pointerup", () => { if (!down) return; down = false; track.style.scrollSnapType = ""; track.style.cursor = ""; });
  $$(".tab").forEach(t => t.addEventListener("click", () => {
    $$(".tab").forEach(x => x.classList.toggle("is-on", x === t));
    render(t.dataset.cat);
  }));
  render("wraps");

  /* ---------- Find your wrap ---------- */
  // Every combination maps to a real item on the menu.
  const MATCH = {
    veg:      { crispy: "Classic Veggie", cheesy: "Cheesy Paneer", spicy: "Classic Veggie", smoky: "Classic Veggie", loaded: "Crispy Paneer" },
    mushroom: { crispy: "Butter Garlic Mushroom", cheesy: "Butter Garlic Mushroom", spicy: "Butter Garlic Mushroom", smoky: "Butter Garlic Mushroom", loaded: "Butter Garlic Mushroom" },
    paneer:   { crispy: "Crispy Paneer", cheesy: "Cheesy Paneer", spicy: "Crispy Paneer", smoky: "Crispy Paneer", loaded: "Cheesy Paneer" },
    chicken:  { crispy: "Crispy Chicken", cheesy: "Cheesy Mexican Chicken", spicy: "Chilli Chicken", smoky: "Smoky Tandoori Chicken", loaded: "Fully Loaded Chicken" }
  };
  const pick = { base: null, mood: null };
  const plate = $("#plate"), pImg = $("#pickImg"), pName = $("#pickName"), pDesc = $("#pickDesc"), pKick = $("#pickKicker");
  function showMatch() {
    if (!pick.base || !pick.mood) {
      pName.textContent = pick.base || pick.mood ? "One more pick…" : "Make your picks";
      pDesc.textContent = pick.base ? "Now choose a mood." : pick.mood ? "Now choose a filling." : "Choose a filling and a mood to see your wrap.";
      return;
    }
    const name = MATCH[pick.base][pick.mood];
    const item = MENU.wraps.find(w => w[0] === name);
    pKick.textContent = "Your match";
    pName.textContent = name;
    pDesc.textContent = item[2];
    pImg.src = C + item[3];
    plate.classList.remove("spin"); void plate.offsetWidth; plate.classList.add("spin");
  }
  $$(".opts").forEach(group => {
    group.addEventListener("click", e => {
      const b = e.target.closest(".opt"); if (!b) return;
      $$(".opt", group).forEach(o => o.classList.toggle("is-on", o === b));
      pick[group.dataset.q] = b.dataset.v;
      showMatch();
    });
  });

  /* ---------- Dips ---------- */
  const tips = {
    red: "Dunk! A fry in the red dip.",
    yellow: "Splash! Golden fry, golden dip.",
    blue: "Plop! Straight into the blue cup."
  };
  const tip = $("#dipTip");
  $$(".dip").forEach(d => d.addEventListener("click", () => {
    d.classList.remove("dunk"); void d.offsetWidth; d.classList.add("dunk");
    tip.textContent = tips[d.dataset.dip];
  }));

  /* ---------- Reveal on scroll ---------- */
  $$(".head, .picker__box, .pair, .fryz__text, .goodness__text, .visit__card, .visit__map, .franchise__in").forEach(el => el.classList.add("reveal"));
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 });
  $$(".reveal").forEach(el => io.observe(el));

  $("#year").textContent = new Date().getFullYear();
})();
