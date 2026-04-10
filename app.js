let cart = JSON.parse(localStorage.getItem("cart")) || [];
let currentProduct = null;
let selectedSize = "M";
let selectedColor = "";

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function showPage(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  if (id === "cart") renderCart();
}

function renderProducts(list = products) {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";

  if (!list.length) {
    grid.innerHTML = "<p>No products found.</p>";
    return;
  }

  list.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.onclick = () => openProduct(product.id);

    card.innerHTML = `
      <img src="${product.images[0]}" alt="${product.name}">
      <div class="product-info">
        <h3>${product.name}</h3>
        <div class="meta">${product.gender} • ${product.category}</div>
        <div class="price">$${product.price}</div>
        <button class="buy-btn" onclick="event.stopPropagation(); quickAdd(${product.id})">Buy</button>
      </div>
    `;

    grid.appendChild(card);
  });
}

function applyFilters() {
  const text = document.getElementById("searchInput").value.toLowerCase().trim();
  const gender = document.getElementById("genderFilter").value;
  const category = document.getElementById("categoryFilter").value;

  const filtered = products.filter(p => {
    const matchText =
      p.name.toLowerCase().includes(text) ||
      p.category.toLowerCase().includes(text) ||
      p.gender.toLowerCase().includes(text);

    const matchGender = gender === "all" || p.gender === gender;
    const matchCategory = category === "all" || p.category === category;

    return matchText && matchGender && matchCategory;
  });

  renderProducts(filtered);
}

function searchFromHome() {
  document.getElementById("searchInput").value = document.getElementById("homeSearch").value;
  showPage("buy");
  applyFilters();
}

function quickGender(gender) {
  document.getElementById("genderFilter").value = gender;
  showPage("buy");
  applyFilters();
}

function quickCategory(category) {
  document.getElementById("categoryFilter").value = category;
  showPage("buy");
  applyFilters();
}

function openProduct(id) {
  const product = products.find(p => p.id === id);
  currentProduct = product;
  selectedSize = "M";
  selectedColor = product.colors[0];

  const similar = products.filter(p =>
    p.category === product.category &&
    p.gender === product.gender &&
    p.id !== product.id
  ).slice(0, 4);

  const detail = document.getElementById("productDetail");
  detail.innerHTML = `
    <div class="product-layout">
      <div>
        <img id="mainProductImage" class="product-main-image" src="${product.images[0]}" alt="${product.name}">
        <div class="thumb-row">
          ${product.images.map(img => `<img src="${img}" onclick="changeImage('${img}')">`).join("")}
        </div>
      </div>

      <div>
        <h2>${product.name}</h2>
        <div class="meta">${product.gender} • ${product.category}</div>
        <div class="price">$${product.price}</div>
        <p>${product.description}</p>

        <h3>Size</h3>
        <div class="size-row">
          ${product.sizes.map(size => `<button class="size-btn ${size === "M" ? "active" : ""}" onclick="selectSize('${size}', this)">${size}</button>`).join("")}
        </div>

        <h3>Color</h3>
        <div class="color-row">
          ${product.colors.map((color, i) => `<div class="color-chip ${i === 0 ? "active" : ""}" style="background:${mapColor(color)}" title="${color}" onclick="selectColor('${color}', this)"></div>`).join("")}
        </div>

        <button class="buy-btn" onclick="addCurrentToCart()">Buy</button>
      </div>
    </div>

    <h3 style="margin-top:28px;">Similar Products</h3>
    <div class="product-grid">
      ${similar.map(item => `
        <div class="product-card" onclick="openProduct(${item.id})">
          <img src="${item.images[0]}" alt="${item.name}">
          <div class="product-info">
            <h3>${item.name}</h3>
            <div class="meta">${item.gender} • ${item.category}</div>
            <div class="price">$${item.price}</div>
          </div>
        </div>
      `).join("")}
    </div>
  `;

  showPage("product");
}

function changeImage(src) {
  document.getElementById("mainProductImage").src = src;
}

function selectSize(size, el) {
  selectedSize = size;
  document.querySelectorAll(".size-btn").forEach(btn => btn.classList.remove("active"));
  el.classList.add("active");
}

function selectColor(color, el) {
  selectedColor = color;
  document.querySelectorAll(".color-chip").forEach(chip => chip.classList.remove("active"));
  el.classList.add("active");
}

function addCurrentToCart() {
  if (!currentProduct) return;
  cart.push({
    id: currentProduct.id,
    name: currentProduct.name,
    price: currentProduct.price,
    size: selectedSize,
    color: selectedColor
  });
  saveCart();
  renderCart();
  showPage("cart");
}

function quickAdd(id) {
  const product = products.find(p => p.id === id);
  cart.push({
    id: product.id,
    name: product.name,
    price: product.price,
    size: "M",
    color: product.colors[0]
  });
  saveCart();
  renderCart();
  showPage("cart");
}

function removeCartItem(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}

function renderCart() {
  const box = document.getElementById("cartItems");
  const totalBox = document.getElementById("cartTotal");
  box.innerHTML = "";

  if (!cart.length) {
    box.innerHTML = "<p>Your cart is empty.</p>";
    totalBox.textContent = "";
    return;
  }

  let total = 0;
  cart.forEach((item, index) => {
    total += item.price;
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <div>
        <strong>${item.name}</strong><br>
        Size: ${item.size} | Color: ${item.color}<br>
        $${item.price}
      </div>
      <button class="remove-btn" onclick="removeCartItem(${index})">Remove</button>
    `;
    box.appendChild(row);
  });

  totalBox.textContent = `Total: $${total}`;
}

function mapColor(color) {
  const colors = {
    Black:"#000",
    White:"#f4f4f4",
    Gray:"#777",
    Olive:"#556b2f",
    Beige:"#d9c7a3",
    "Dark Blue":"#1e3a8a",
    Stone:"#9a9488",
    Cream:"#f6e7c1",
    Red:"#d62828"
  };
  return colors[color] || "#888";
}

window.addEventListener("load", async () => {
  renderProducts();
  renderCart();

  if (window.Clerk) {
    await Clerk.load();
    const box = document.getElementById("clerk-login");
    if (Clerk.user) {
      box.innerHTML = `<p>Logged in as ${Clerk.user.primaryEmailAddress?.emailAddress || "user"}</p>`;
    } else {
      Clerk.mountSignIn(box);
    }
  }
});
