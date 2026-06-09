const MENU_CATEGORIES = [
  "Tatlılar",
  "Soğuk İçecekler",
  "Sıcak İçecekler",
  "Dondurmalar ve Ekstralar"
];

const HIDDEN_CATEGORIES = new Set([
  "Kruvasan Sandviç ve Kahvaltılar"
]);

const SUBCATEGORY_OPTIONS = {
  "Soğuk İçecekler": [
    "Molin Special İçecekler",
    "Soğuk Kahveler",
    "Milk Shake",
    "Frozen",
    "Taze Sıkma Meyve Suları",
    "Limonata",
    "Şişe ve Kutu İçecekler"
  ],
  "Sıcak İçecekler": [
    "Kahve",
    "Çay"
  ]
};

function getProducts() {
  return Array.isArray(window.MOLIN_MENU_PRODUCTS) ? window.MOLIN_MENU_PRODUCTS : [];
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isVisibleProduct(product) {
  return !HIDDEN_CATEGORIES.has(product.category) && MENU_CATEGORIES.includes(product.category);
}

function productPriceTemplate(product) {
  if (Array.isArray(product.priceOptions) && product.priceOptions.length) {
    return `
      <div class="price-options">
        ${product.priceOptions.map((option) => `
          <div class="price-option">
            <span>${escapeHtml(option.label)}</span>
            <strong>${escapeHtml(option.price)}</strong>
          </div>
        `).join("")}
      </div>
    `;
  }

  return `<strong class="price">${escapeHtml(product.price)}</strong>`;
}

function productTemplate(product) {
  return `
    <article class="menu-item">
      <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" loading="lazy">
      <div>
        <h2>${escapeHtml(product.name)}</h2>
        <p>${escapeHtml(product.description)}</p>
      </div>
      ${productPriceTemplate(product)}
    </article>
  `;
}

function getMenuCategories(products) {
  const productCategories = products.filter(isVisibleProduct).map((product) => product.category);
  return ["Tümü", ...MENU_CATEGORIES, ...productCategories.filter((category) => !MENU_CATEGORIES.includes(category))];
}

function shouldGroupBySubcategory(category) {
  return Boolean(SUBCATEGORY_OPTIONS[category]);
}

function groupedProductsTemplate(products, category) {
  const order = SUBCATEGORY_OPTIONS[category] || [];
  const groups = new Map(order.map((subcategory) => [subcategory, []]));

  products.forEach((product) => {
    const subcategory = product.subcategory || "Diğer";
    if (!groups.has(subcategory)) {
      groups.set(subcategory, []);
    }
    groups.get(subcategory).push(product);
  });

  return [...groups.entries()]
    .filter(([, groupProducts]) => groupProducts.length)
    .map(([subcategory, groupProducts]) => `
      <section class="menu-subcategory">
        <button class="subcategory-heading" type="button" data-subcategory-toggle aria-expanded="false">
          <span>${escapeHtml(subcategory)}</span>
          <small>${groupProducts.length}</small>
        </button>
        <div class="subcategory-products hidden">
          ${groupProducts.map(productTemplate).join("")}
        </div>
      </section>
    `)
    .join("");
}

function initMenu() {
  const list = document.querySelector("[data-menu-list]");
  const tabs = document.querySelector("[data-category-tabs]");
  if (!list || !tabs) return;

  const products = getProducts().filter(isVisibleProduct);
  const categories = [...new Set(getMenuCategories(products))];
  let activeCategory = "Tümü";

  function renderTabs() {
    tabs.innerHTML = categories
      .map((category) => {
        const count = category === "Tümü"
          ? products.length
          : products.filter((product) => product.category === category).length;
        const isActive = category === activeCategory;

        return `
          <button type="button" class="${isActive ? "active" : ""}" data-category="${category}" aria-pressed="${isActive}">
            <span>${category}</span>
            <small>${count}</small>
          </button>
        `;
      })
      .join("");
  }

  function renderProducts() {
    const filtered = products.filter((product) => {
      const matchesCategory = activeCategory === "Tümü" || product.category === activeCategory;
      return matchesCategory;
    });

    list.innerHTML = filtered.length
      ? shouldGroupBySubcategory(activeCategory)
        ? groupedProductsTemplate(filtered, activeCategory)
        : filtered.map(productTemplate).join("")
      : `<div class="empty-state">Bu kategori için ürün bulunamadı.</div>`;
  }

  function scrollMenuToStart() {
    const tools = document.querySelector(".menu-tools");
    const offset = tools ? tools.offsetHeight + 12 : 12;
    const top = list.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({
      top: Math.max(0, top),
      behavior: "auto"
    });
  }

  function scheduleMenuScroll() {
    requestAnimationFrame(() => {
      requestAnimationFrame(scrollMenuToStart);
    });
  }

  tabs.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-category]");
    if (!button) return;
    activeCategory = button.dataset.category;
    renderTabs();
    renderProducts();
    tabs.querySelector("button.active")?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest"
    });
    scheduleMenuScroll();
  });

  list.addEventListener("click", (event) => {
    const button = event.target.closest("[data-subcategory-toggle]");
    if (!button) return;

    const group = button.closest(".menu-subcategory");
    const productsContainer = group?.querySelector(".subcategory-products");
    const isExpanded = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!isExpanded));
    productsContainer?.classList.toggle("hidden", isExpanded);
  });

  renderTabs();
  renderProducts();
}

function initNav() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    nav.classList.toggle("open");
  });

  nav.addEventListener("click", () => {
    nav.classList.remove("open");
  });
}

initNav();
initMenu();
