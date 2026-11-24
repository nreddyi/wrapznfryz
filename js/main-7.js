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

  /* ---------- Menu data (from the Wrapz N Fryz menu) ----------
     d = available as: v veg · p paneer · m mushroom · c chicken
     img starting with "food/" = real photo, "menu/" = menu artwork */
  const F = "images/";
  const MENU = {
    wraps: [
      { n: "Crispy Wrap", sub: "Classic Wrap", p: 109, d: "vc", img: "food/wrap-crispy-chicken.jpg", t: "Crunchy filling, fresh lettuce, tomato and onion, grilled warm." },
      { n: "Simply Classic Wrap", sub: "Classic Wrap", p: 149, d: "pmc", img: "food/wrap-chicken-peppers.jpg", t: "Grilled filling with peppers, onion and lettuce. The all-rounder." },
      { n: "Cheesy Mac", sub: "Cheese Melts", p: 149, d: "vc", img: "menu/wrap-cheese-melt.jpg", t: "Mac and cheese, wrapped and grilled till melty." },
      { n: "Cheesy Mexican", sub: "Cheese Melts", p: 159, d: "vc", img: "menu/wrap-cheese-melt.jpg", t: "Mexican spice under a layer of melted cheese." },
      { n: "Chilli Wrap", sub: "Bold Flavors", p: 109, d: "pc", img: "food/wrap-paneer.jpg", t: "A fiery chilli toss for spice lovers." },
      { n: "Nashville Wrap", sub: "Bold Flavors", p: 149, d: "pc", img: "menu/wrap-bold.jpg", t: "Nashville hot heat, wrapped up and grilled." },
      { n: "Korean Glazed", sub: "Bold Flavors", p: 169, d: "pc", img: "food/wrap-paneer-olive.jpg", t: "Sweet, sticky Korean glaze with a little kick." }
    ],
    fryz: [
      { n: "Salted Fries", sub: "Classic Fryz", p: 99, d: "v", img: "food/fryz-salted.jpg", t: "Golden, crisp and perfectly salted." },
      { n: "Peri Peri Fries", sub: "Classic Fryz", p: 99, d: "v", img: "food/fryz-peri-peri.jpg", t: "Tossed in zingy peri peri spice." },
      { n: "Crispy Potato Shots", sub: "Classic Fryz", p: 99, d: "v", img: "menu/fryz-classic.jpg", t: "Bite-sized, crispy potato shots." },
      { n: "Crispy Fries", sub: "Loaded Fryz", p: 149, d: "pmc", img: "menu/fryz-loaded.jpg", t: "Fries loaded with crispy toppings and sauces." },
      { n: "Korean Fries", sub: "Loaded Fryz", p: 159, d: "pc", img: "food/fryz-korean.jpg", t: "Korean-glazed topping, sesame and a double drizzle." },
      { n: "Creamy Fries", sub: "Loaded Fryz", p: 149, d: "mc", img: "menu/fryz-loaded.jpg", t: "Fries smothered in a creamy, saucy topping." },
      { n: "Mac N Cheese Fries", sub: "Loaded Fryz", p: 169, d: "pmc", img: "food/fryz-mac-cheese.jpg", t: "Fries, crispy bites and creamy mac n cheese in one box." },
      { n: "Nashville Hot Chicken Fries", sub: "Loaded Fryz", p: 159, d: "c", img: "menu/fryz-loaded.jpg", t: "Fries topped with Nashville hot chicken." }
    ],
    bites: [
      { n: "Popcorn", sub: "Quick Bites", p: 99, d: "vc", img: "menu/quick-bites.jpg", t: "Crunchy bite-sized popcorn, made for sharing." },
      { n: "Golden Nuggets", sub: "Quick Bites", p: 99, d: "pmc", img: "menu/quick-bites.jpg", t: "Golden, crumbed nuggets with dips." },
      { n: "Grill Sandwich", sub: "Sandwiches", p: 99, d: "pmc", img: "menu/sandwich.jpg", t: "Toasted on the grill, loaded with filling." },
      { n: "Peri Peri Chicken Sandwich", sub: "Sandwiches", p: 109, d: "c", img: "menu/sandwich.jpg", t: "Peri peri chicken in a grilled sandwich." }
    ],
    drinks: [
      { n: "Mojitos", sub: "Mojitos", p: 109, img: "menu/drink-mojito.jpg", list: ["Blue Heaven", "Pineapple Breeze", "Cool Mint Sparkle", "Virgin Mint Splash", "Blueberry Fizz", "Watermelon Breeze"] },
      { n: "Fruity Milkshakes", sub: "Milkshakes", p: 79, img: "menu/drink-shake-fruit.jpg", list: ["Butterscotch Banana", "Mango", "Strawberry", "Vanilla", "Kesar Pista"] },
      { n: "Premium Milkshakes", sub: "Milkshakes", p: 99, img: "menu/drink-shake-oreo.jpg", list: ["Oreo", "Black Current", "Hardrock Coffee", "Dryfruit", "Belgium Chocolate", "Kitkat", "Ferraro"] }
    ],
    desserts: [
      { n: "Brownie Bowls", sub: "Bold Flavors", img: "menu/brownie-bowl.jpg", list: ["Double Chocolate Brownie Bowl · ₹109", "KitKat Brownie Bowl · ₹119", "Nutella Brownie Bowl · ₹129"] },
      { n: "Classic Ice Creams", sub: "Classic Ice Creams", p: 129, img: "menu/ice-cream-classic.jpg", list: ["Fruit Salad with Icecream", "Mexican Brownie Bliss", "American Dryfruit", "Chocolate Fudge Sundae"] },
      { n: "Layered Ice Creams", sub: "Layered Ice Creams", p: 149, img: "menu/ice-cream-layered.jpg", list: ["Royal Dry Fruit Sundae", "Death By Chocolate", "Nutella Brownie Indulgence", "Fruit n Nut Overload"] }
    ]
  };
  const DIET = { v: ["veg", "Veg"], p: ["paneer", "Paneer"], m: ["mushroom", "Mushroom"], c: ["chicken", "Chicken"] };
  const colours = ["yellow", "cream", "red"];
  const rs = p => "₹" + p;

  /* ---------- Carousel ---------- */
  const track = $("#track"), dots = $("#dots"), count = $("#count");
  function card(it, i) {
    const photo = it.img.startsWith("food/");
    const tags = it.d ? `<div class="tags">${[...it.d].map(k => `<span class="tagd tagd--${DIET[k][0]}">${DIET[k][1]}</span>`).join("")}</div>` : "";
    const body = it.list
      ? `<ul class="flav">${it.list.map(x => `<li>${x}</li>`).join("")}</ul>`
      : `<p>${it.t}</p>`;
    return `
      <article class="card card--${colours[i % 3]}${it.list ? " card--list" : ""}" style="animation-delay:${i * 50}ms">
        <div class="card__img ${photo ? "is-photo" : "is-art"}"><img src="${F}${it.img}" alt="${it.n}" loading="lazy"></div>
        <p class="card__sub">${it.sub}</p>
        <div class="card__row"><h3>${it.n}</h3>${it.p ? `<span class="price">${it.list ? "each " : ""}${rs(it.p)}</span>` : ""}</div>
        ${tags}
        ${body}
      </article>`;
  }
  function render(cat) {
    const items = MENU[cat];
    track.innerHTML = items.map(card).join("");
    track.scrollLeft = 0;
    dots.innerHTML = items.map((_, i) => `<i class="${i === 0 ? "on" : ""}"></i>`).join("");
    const n = items.reduce((a, it) => a + (it.list ? it.list.length : 1), 0);
    count.textContent = `${n} item${n > 1 ? "s" : ""}`;
  }
  function cardStep() { const c = $(".card", track); return c ? c.getBoundingClientRect().width + 22 : 300; }
  $("#prev").addEventListener("click", () => track.scrollBy({ left: -cardStep(), behavior: reduce ? "auto" : "smooth" }));
  $("#next").addEventListener("click", () => track.scrollBy({ left: cardStep(), behavior: reduce ? "auto" : "smooth" }));
  track.addEventListener("scroll", () => {
    const all = $$("i", dots), i = Math.round(track.scrollLeft / cardStep());
    all.forEach((d, k) => d.classList.toggle("on", k === Math.min(i, all.length - 1)));
  }, { passive: true });
  let down = false, sx = 0, sl = 0;
  track.addEventListener("pointerdown", e => { if (e.pointerType !== "mouse") return; down = true; sx = e.clientX; sl = track.scrollLeft; track.style.scrollSnapType = "none"; track.style.cursor = "grabbing"; });
  addEventListener("pointermove", e => { if (down) track.scrollLeft = sl - (e.clientX - sx); });
  addEventListener("pointerup", () => { if (!down) return; down = false; track.style.scrollSnapType = ""; track.style.cursor = ""; });
  function setTab(cat) {
    $$(".tab").forEach(x => x.classList.toggle("is-on", x.dataset.cat === cat));
    render(cat);
  }
  $$(".tab").forEach(t => t.addEventListener("click", () => setTab(t.dataset.cat)));
  render("wraps");

  /* ---------- Find your wrap (every result is a real menu item) ---------- */
  const W = Object.fromEntries(MENU.wraps.map(w => [w.n, w]));
  const MATCH = {
    veg:      { crispy: "Crispy Wrap", classic: "Crispy Wrap", cheesy: "Cheesy Mac", spicy: "Cheesy Mexican", hot: "Cheesy Mexican", sweet: "Cheesy Mac" },
    paneer:   { crispy: "Simply Classic Wrap", classic: "Simply Classic Wrap", cheesy: "Simply Classic Wrap", spicy: "Chilli Wrap", hot: "Nashville Wrap", sweet: "Korean Glazed" },
    mushroom: { crispy: "Simply Classic Wrap", classic: "Simply Classic Wrap", cheesy: "Simply Classic Wrap", spicy: "Simply Classic Wrap", hot: "Simply Classic Wrap", sweet: "Simply Classic Wrap" },
    chicken:  { crispy: "Crispy Wrap", classic: "Simply Classic Wrap", cheesy: "Cheesy Mexican", spicy: "Chilli Wrap", hot: "Nashville Wrap", sweet: "Korean Glazed" }
  };
  const LABEL = { veg: "Veg", paneer: "Paneer", mushroom: "Mushroom", chicken: "Chicken" };
  const pick = { base: null, mood: null };
  const plate = $("#plate"), pImg = $("#pickImg"), pName = $("#pickName"), pDesc = $("#pickDesc"), pPrice = $("#pickPrice");
  function showMatch() {
    if (!pick.base || !pick.mood) {
      pName.textContent = pick.base || pick.mood ? "One more pick…" : "Make your picks";
      pDesc.textContent = pick.base ? "Now choose a mood." : pick.mood ? "Now choose a filling." : "Choose a filling and a mood to see your wrap.";
      pPrice.textContent = "";
      return;
    }
    const w = W[MATCH[pick.base][pick.mood]];
    pName.textContent = `${w.n} (${LABEL[pick.base]})`;
    pDesc.textContent = w.t;
    pPrice.textContent = `${w.sub} · ${rs(w.p)}`;
    pImg.src = F + w.img; pImg.removeAttribute("data-clip");
    plate.classList.add("has-photo");
    plate.classList.remove("spin"); void plate.offsetWidth; plate.classList.add("spin");
  }
  $$(".opts").forEach(group => group.addEventListener("click", e => {
    const b = e.target.closest(".opt"); if (!b) return;
    $$(".opt", group).forEach(o => o.classList.toggle("is-on", o === b));
    pick[group.dataset.q] = b.dataset.v;
    showMatch();
  }));

  /* ---------- Fryz switcher ---------- */
  const fp = $("#fryzPhoto"), fpr = $("#fryzPrice");
  $$("#fryzTypes .ft").forEach(b => b.addEventListener("click", () => {
    $$("#fryzTypes .ft").forEach(x => x.classList.toggle("is-on", x === b));
    fp.classList.remove("swap"); void fp.offsetWidth; fp.classList.add("swap");
    fp.src = b.dataset.img; fpr.textContent = b.dataset.label;
  }));

  /* ---------- Reveal on scroll ---------- */
  $$(".head, .picker__box, .pair, .fryz__text, .goodness__text, .visit__card, .visit__map, .franchise__in").forEach(el => el.classList.add("reveal"));
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 });
  $$(".reveal").forEach(el => io.observe(el));

  $("#year").textContent = new Date().getFullYear();
})();
