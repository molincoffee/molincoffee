const defaultProducts = [
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

function getProducts() {
  return defaultProducts;
}

function productTemplate(product) {
  return `
    <article class="menu-item">
      <img src="${product.image}" alt="${product.name}">
      <div>
        <h2>${product.name}</h2>
        <p>${product.description}</p>
      </div>
      <strong class="price">${product.price}</strong>
    </article>
  `;
}

function initMenu() {
  const list = document.querySelector("[data-menu-list]");
  const tabs = document.querySelector("[data-category-tabs]");
  const search = document.querySelector("[data-menu-search]");
  if (!list || !tabs) return;

  const products = getProducts();
  const categories = ["Tümü", ...new Set(products.map((product) => product.category))];
  let activeCategory = "Tümü";

  function renderTabs() {
    tabs.innerHTML = categories
      .map((category) => `<button type="button" class="${category === activeCategory ? "active" : ""}" data-category="${category}">${category}</button>`)
      .join("");
  }

  function renderProducts() {
    const term = (search?.value || "").toLocaleLowerCase("tr-TR").trim();
    const filtered = products.filter((product) => {
      const matchesCategory = activeCategory === "Tümü" || product.category === activeCategory;
      const haystack = `${product.name} ${product.description} ${product.category}`.toLocaleLowerCase("tr-TR");
      return matchesCategory && haystack.includes(term);
    });

    list.innerHTML = filtered.length
      ? filtered.map(productTemplate).join("")
      : `<div class="empty-state">Bu arama için ürün bulunamadı.</div>`;
  }

  tabs.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-category]");
    if (!button) return;
    activeCategory = button.dataset.category;
    renderTabs();
    renderProducts();
  });

  search?.addEventListener("input", renderProducts);
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
