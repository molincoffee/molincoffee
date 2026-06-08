const MENU_CATEGORIES = [
  "Tatlılar",
  "Soğuk İçecekler",
  "Sıcak İçecekler",
  // "Kruvasan Sandviç ve Kahvaltılar",
  "Dondurmalar ve Ekstralar"
];
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

const defaultProducts = typeof window !== "undefined" && window.MOLIN_MENU_PRODUCTS
  ? window.MOLIN_MENU_PRODUCTS
  : [
  {
    id: "san-sebastian",
    category: "Tatlılar",
    name: "San Sebastian Cheesecake",
    description: "Akışkan çikolata sosu ve yoğun krem peynir dokusuyla.",
    price: "165 TL",
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "magnolia",
    category: "Tatlılar",
    name: "Çilekli Magnolia",
    description: "Taze çilek, vanilyalı krema ve bisküvi katmanları.",
    price: "135 TL",
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "brownie",
    category: "Tatlılar",
    name: "Belçika Çikolatalı Brownie",
    description: "Sıcak servis, kakao yoğunluğu yüksek yumuşak brownie.",
    price: "125 TL",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "latte",
    category: "Kahveler",
    name: "Caffe Latte",
    description: "Taze espresso, ipeksi süt köpüğü ve dengeli içim.",
    price: "95 TL",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "americano",
    category: "Kahveler",
    name: "Americano",
    description: "Espresso üzerine sıcak su ile sade ve güçlü kahve.",
    price: "85 TL",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "mocha",
    category: "Kahveler",
    name: "Mocha",
    description: "Espresso, süt ve çikolatanın yumuşak birleşimi.",
    price: "110 TL",
    image: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "ice-latte",
    category: "Soğuk İçecekler",
    name: "Ice Latte",
    description: "Soğuk süt, buz ve çift shot espresso.",
    price: "105 TL",
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "limonata",
    category: "Soğuk İçecekler",
    name: "Ev Yapımı Limonata",
    description: "Taze limon, nane ve dengeli şeker oranı.",
    price: "90 TL",
    image: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "tost",
    category: "Atıştırmalıklar",
    name: "Mozzarella Tost",
    description: "Ekşi mayalı ekmek, mozzarella, domates ve fesleğen.",
    price: "145 TL",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=80"
  }
];

async function getProducts() {
  return defaultProducts.map(normalizeProduct);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeProduct(product) {
  if (product.category === "Kahveler") {
    return { ...product, category: "Sıcak İçecekler", subcategory: product.subcategory || "Kahve" };
  }

  if (product.category === "Atıştırmalıklar") {
    return { ...product, category: "Kruvasan Sandviç ve Kahvaltılar" };
  }

  if (product.category === "Soğuk İçecekler" && !product.subcategory) {
    const subcategory = product.name.toLocaleLowerCase("tr-TR").includes("limonata")
      ? "Limonata"
      : "Soğuk Kahveler";
    return { ...product, subcategory };
  }

  if (product.category === "Sıcak İçecekler" && !product.subcategory) {
    return { ...product, subcategory: "Kahve" };
  }

  return product;
}

function isVisibleProduct(product) {
  return MENU_CATEGORIES.includes(product.category);
}

function productTemplate(product) {
  return `
    <article class="menu-item">
      <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}">
      <div>
        <h2>${escapeHtml(product.name)}</h2>
        <p>${escapeHtml(product.description)}</p>
      </div>
      <strong class="price">${escapeHtml(product.price)}</strong>
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

async function initMenu() {
  const list = document.querySelector("[data-menu-list]");
  const tabs = document.querySelector("[data-category-tabs]");
  if (!list || !tabs) return;

  const products = (await getProducts()).filter(isVisibleProduct);
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

  tabs.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-category]");
    if (!button) return;
    activeCategory = button.dataset.category;
    renderTabs();
    renderProducts();
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
