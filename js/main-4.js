/* =========================================================
   Wrapz N Fryz — Option 4 interactions ("Food first")
   ========================================================= */
(() => {
  "use strict";
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(pointer: fine)").matches;
  const C = "images/clipart/";

  /* ---------- Nav ---------- */
  const nav = $("#nav"), burger = $("#burger");
  let lastY = 0;
  addEventListener("scroll", () => {
    const y = scrollY;
    nav.classList.toggle("solid", y > 60);
    nav.classList.toggle("hide", y > lastY && y > 600 && !nav.classList.contains("open"));
    lastY = y;
  }, { passive: true });
  burger.addEventListener("click", () => {
    const o = nav.classList.toggle("open");
    burger.setAttribute("aria-expanded", String(o));
  });
  $$("#navLinks a").forEach(a => a.addEventListener("click", () => { nav.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); }));

  /* ---------- Statement: words light up as you scroll ---------- */
  const st = $("#statement");
  (function splitWords(node) {
    [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          const s = document.createElement("span"); s.className = "w"; s.textContent = part; frag.appendChild(s);
        });
        node.replaceChild(frag, n);
      } else if (n.nodeType === 1) {
        n.classList.add("w");
      }
    });
  })(st);
  const words = $$(".w", st);

  /* ---------- Craft: sticky steps ---------- */
  const steps = $$(".step"), plates = $$(".plate__img"), num = $("#craftNum");
  let curStep = -1;
  function setStep(i) {
    if (i === curStep) return;
    curStep = i;
    steps.forEach((s, k) => s.classList.toggle("is-on", k === i));
    plates.forEach((p, k) => p.classList.toggle("is-on", k === i));
    num.textContent = String(i + 1).padStart(2, "0");
  }
  setStep(0);

  /* ---------- Menu ---------- */
  const MENU = {
    wraps: [
      ["Classic Veggie", true, "Crisp vegetables and house sauce in a warm grilled wrap.", "lettuce.svg"],
      ["Butter Garlic Mushroom", true, "Mushrooms tossed in butter and garlic until golden.", "mushrooms.svg"],
      ["Crispy Paneer", true, "Golden-fried paneer with fresh vegetables.", "wraps-duo.svg"],
      ["Cheesy Paneer", true, "Paneer folded with melted cheese.", "cheese.svg"],
      ["Crispy Chicken", false, "Crunchy fried chicken, crisp greens, creamy sauce.", "wrap-bite-hand.svg"],
      ["Chilli Chicken", false, "Chicken in a bold chilli glaze with onion and peppers.", "chilli.svg"],
      ["Smoky Tandoori Chicken", false, "Tandoori-marinated chicken with a smoky char.", "tomato.svg"],
      ["Cheesy Mexican Chicken", false, "Mexican-spiced chicken under melted cheese.", "onions.svg"],
      ["Fully Loaded Chicken", false, "Our most generous wrap, filled to the edge.", "wrap-in-hand.svg"]
    ],
    fryz: [
      ["Salted Fryz", true, "Hand-cut, double-fried and seasoned with salt.", "fries-box.svg"],
      ["Cheesy Loaded Fryz", true, "Double-fried fryz under a layer of melted cheese.", "loaded-fries.svg"],
      ["Plain Fryz", true, "Hand-cut and double-fried, nothing added.", "fries-and-sticks.svg"]
    ],
    more: [
      ["UFO Wraps", null, "A sealed, toasted round wrap with a hot filling.", "ufo.svg"],
      ["Thick Shakes", true, "Thick, cold and blended to order.", "shake.svg"],
      ["Mojitos", true, "Fresh mint, lime and sparkle.", "mojito.svg"],
      ["Desserts", true, "Something sweet to finish.", "dessert.svg"]
    ]
  };
  const list = $("#menuList"), preview = $("#menuPreview"), pImg = $("#menuPreviewImg");
  function render(cat) {
    list.innerHTML = MENU[cat].map(([n, v, d, img], k) => `
      <li class="mi" data-img="${img}" style="animation-delay:${k * 60}ms">
        <span class="mi__n">${String(k + 1).padStart(2, "0")}</span>
        <div class="mi__name"><h3>${n} ${v === null ? "" : `<span class="${v ? "vg" : "nv"}" title="${v ? "Vegetarian" : "Non-vegetarian"}"></span>`}</h3><p>${d}</p></div>
        <span class="mi__tag">${cat === "wraps" ? "Wrap" : cat === "fryz" ? "Fryz" : n === "UFO Wraps" ? "UFO" : "Sip & sweet"}</span>
      </li>`).join("");
  }
  $$(".mtab").forEach(t => t.addEventListener("click", () => {
    $$(".mtab").forEach(x => x.classList.toggle("is-on", x === t));
    render(t.dataset.cat);
  }));
  render("wraps");

  // floating preview follows the cursor over menu rows (mouse only)
  if (fine && !reduce) {
    let px = 0, py = 0, tx = 0, ty = 0, raf = 0;
    const loop = () => { px += (tx - px) * .18; py += (ty - py) * .18; preview.style.left = px + "px"; preview.style.top = py + "px"; raf = requestAnimationFrame(loop); };
    list.addEventListener("mouseover", e => {
      const li = e.target.closest(".mi"); if (!li) return;
      const src = C + li.dataset.img;
      if (!pImg.src.endsWith(li.dataset.img)) pImg.src = src;
      preview.classList.add("show");
      if (!raf) raf = requestAnimationFrame(loop);
    });
    list.addEventListener("mousemove", e => { tx = Math.min(innerWidth - 150, Math.max(e.clientX + 240, innerWidth * .66)); ty = e.clientY; if (!px) { px = tx; py = ty; } });
    list.addEventListener("mouseleave", () => { preview.classList.remove("show"); cancelAnimationFrame(raf); raf = 0; });
  }

  /* ---------- Magnetic buttons ---------- */
  if (fine && !reduce) {
    $$(".magnetic").forEach(b => {
      b.addEventListener("mousemove", e => {
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px, ${(e.clientY - r.top - r.height / 2) * .35}px)`;
      });
      b.addEventListener("mouseleave", () => (b.style.transform = ""));
    });
  }

  /* ---------- Scroll-driven effects ---------- */
  const heroImg = $("#heroImg"), hero = $("#hero");
  const sigMain = $(".sig-main"), sigDips = $$(".sig-dip"), sig = $(".signature");
  const galImgs = $$(".gal__item img");
  const frBg = $(".franchise__bg"), fr = $(".franchise");
  let ticking = false;

  function onScroll() {
    ticking = false;
    const vh = innerHeight;

    // hero: slow zoom + drift
    const hr = hero.getBoundingClientRect();
    if (hr.bottom > 0) {
      const p = Math.min(1, -hr.top / hr.height);
      heroImg.style.transform = `scale(${1.15 + p * .15}) translateY(${p * 8}%)`;
    }

    // statement words
    const sr = st.getBoundingClientRect();
    const sp = Math.min(1, Math.max(0, (vh * .85 - sr.top) / (sr.height + vh * .35)));
    const lit = Math.round(sp * words.length);
    words.forEach((w, i) => w.classList.toggle("on", i < lit));

    // craft step = the step whose centre is nearest the viewport centre
    let best = 0, bestD = Infinity;
    steps.forEach((s, i) => {
      const r = s.getBoundingClientRect();
      const d = Math.abs(r.top + r.height / 2 - vh / 2);
      if (d < bestD) { bestD = d; best = i; }
    });
    setStep(best);

    // signature parallax
    const gr = sig.getBoundingClientRect();
    if (gr.top < vh && gr.bottom > 0) {
      const p = (vh - gr.top) / (vh + gr.height) - .5;
      sigMain.style.transform = `translateY(${p * -60}px) rotate(${p * -8}deg)`;
      sigDips.forEach((d, i) => (d.style.transform = `translateY(${p * (40 + i * 30)}px)`));
    }

    // gallery parallax
    galImgs.forEach(img => {
      const r = img.parentElement.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) {
        const p = (r.top + r.height / 2 - vh / 2) / vh;
        img.style.transform = `translateY(${p * parseFloat(img.dataset.speed) * 400 - 6}%)`;
      }
    });

    // franchise bg
    const fb = fr.getBoundingClientRect();
    if (fb.top < vh && fb.bottom > 0) frBg.style.transform = `scale(1.1) translateY(${((fb.top + fb.height / 2 - vh / 2) / vh) * -8}%)`;
  }
  if (!reduce) {
    addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
    addEventListener("resize", onScroll);
    onScroll();
  } else {
    words.forEach(w => w.classList.add("on"));
    // still switch craft steps without animation
    addEventListener("scroll", () => {
      let best = 0, bestD = Infinity;
      steps.forEach((s, i) => { const r = s.getBoundingClientRect(); const d = Math.abs(r.top + r.height / 2 - innerHeight / 2); if (d < bestD) { bestD = d; best = i; } });
      setStep(best);
    }, { passive: true });
  }

  /* ---------- Reveal ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .15 });
  $$(".reveal").forEach(el => io.observe(el));

  $("#year").textContent = new Date().getFullYear();
})();
