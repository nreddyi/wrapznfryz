/* Wrapz N Fryz — Option 5 ("Clean & simple") */
(() => {
  "use strict";
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  // Nav: border on scroll + mobile toggle
  const nav = $("#nav"), toggle = $("#toggle");
  addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 8), { passive: true });
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  $$("#navLinks a").forEach(a => a.addEventListener("click", () => {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }));

  // Menu
  const MENU = {
    wraps: [
      ["Classic Veggie", true, "Fresh vegetables in a grilled wrap", "lettuce.svg"],
      ["Butter Garlic Mushroom", true, "Mushrooms in butter and garlic", "mushrooms.svg"],
      ["Crispy Paneer", true, "Crisp paneer with fresh vegetables", "wraps-duo.svg"],
      ["Cheesy Paneer", true, "Paneer with melted cheese", "cheese.svg"],
      ["Crispy Chicken", false, "Crunchy chicken with greens", "wrap-bite-hand.svg"],
      ["Chilli Chicken", false, "Chicken in a chilli glaze", "chilli.svg"],
      ["Smoky Tandoori Chicken", false, "Tandoori-marinated chicken", "tomato.svg"],
      ["Cheesy Mexican Chicken", false, "Mexican-spiced chicken with cheese", "onions.svg"],
      ["Fully Loaded Chicken", false, "Our most filling wrap", "wrap-in-hand.svg"]
    ],
    fryz: [
      ["Salted Fryz", true, "Hand-cut, double-fried, salted", "fries-box.svg"],
      ["Cheesy Loaded Fryz", true, "Topped with melted cheese", "loaded-fries.svg"],
      ["Plain Fryz", true, "Hand-cut and double-fried", "fries-and-sticks.svg"]
    ],
    more: [
      ["UFO Wraps", null, "Sealed and toasted round wraps", "ufo.svg"],
      ["Thick Shakes", true, "Thick and blended to order", "shake.svg"],
      ["Mojitos", true, "Mint, lime and soda", "mojito.svg"],
      ["Desserts", true, "Something sweet to finish", "dessert.svg"]
    ]
  };
  const list = $("#menuList");
  function render(cat) {
    list.innerHTML = MENU[cat].map(([name, veg, desc, img], i) => `
      <li class="item" style="animation-delay:${i * 30}ms">
        <span class="item__img ${["bg-blue","bg-yellow","bg-red"][i % 3]}"><img src="images/clipart/${img}" alt=""></span>
        <div>
          <h3>${name}${veg === null ? "" : ` <span class="${veg ? "veg" : "nonveg"}" title="${veg ? "Vegetarian" : "Non-vegetarian"}"></span>`}</h3>
          <p>${desc}</p>
        </div>
      </li>`).join("");
  }
  function setTab(cat) {
    $$(".tab").forEach(t => {
      const on = t.dataset.cat === cat;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", String(on));
    });
    render(cat);
  }
  $$(".tab").forEach(t => t.addEventListener("click", () => setTab(t.dataset.cat)));
  $$("[data-jump]").forEach(a => a.addEventListener("click", () => setTab(a.dataset.jump)));
  render("wraps");

  $("#year").textContent = new Date().getFullYear();
})();
