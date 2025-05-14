// Initialize cart from localStorage or empty array
let cart = JSON.parse(localStorage.getItem("cart")) || []

// DOM Elements
document.addEventListener("DOMContentLoaded", () => {
  // Update cart count on all pages
  updateCartCount()

  // Setup search functionality
  setupSearch()

  // Load featured products on homepage
  const featuredProductsContainer = document.getElementById("featured-products")
  if (featuredProductsContainer) {
    loadFeaturedProducts()
  }

  // Load products by category
  const mainShopProducts = document.getElementById("main-shop-products")
  if (mainShopProducts) {
    loadProducts("main-shop")
  }

  const mysteryBoxProducts = document.getElementById("mystery-box-products")
  if (mysteryBoxProducts) {
    loadProducts("mystery-boxes")
  }

  const seasonalProducts = document.getElementById("seasonal-products")
  if (seasonalProducts) {
    loadProducts("seasonal")
  }

  // Add to cart buttons
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-to-cart")) {
      const productId = Number.parseInt(e.target.getAttribute("data-id"))
      const productName = e.target.getAttribute("data-name")
      const productPrice = Number.parseFloat(e.target.getAttribute("data-price"))
      const productImage = e.target.getAttribute("data-image") || getImageForProduct(productName)
      addToCart(productId, productName, productPrice, productImage)
    }
  })

  // Cart page specific code
  const cartList = document.getElementById("cart-list")
  if (cartList) {
    loadCart()

    // Setup checkout form
    const checkoutForm = document.getElementById("checkout-form")
    if (checkoutForm) {
      checkoutForm.addEventListener("submit", (e) => {
        e.preventDefault()
        processOrder()
      })
    }

    // Continue shopping button
    const continueShoppingBtn = document.getElementById("continue-shopping")
    if (continueShoppingBtn) {
      continueShoppingBtn.addEventListener("click", () => {
        document.getElementById("order-confirmation").classList.add("hidden")
        clearCart()
        window.location.href = "index.html"
      })
    }

    // Close modal button
    const closeModal = document.querySelector(".close-modal")
    if (closeModal) {
      closeModal.addEventListener("click", () => {
        document.getElementById("order-confirmation").classList.add("hidden")
      })
    }
  }

  // Sort functionality
  const sortOptions = document.getElementById("sort-options")
  if (sortOptions) {
    sortOptions.addEventListener("change", () => {
      const container = document.querySelector(".product-grid")
      const category =
        container.id === "main-shop-products"
          ? "main-shop"
          : container.id === "mystery-box-products"
            ? "mystery-boxes"
            : "seasonal"

      loadProducts(category, sortOptions.value)
    })
  }
})

// Setup search functionality
function setupSearch() {
  const searchToggle = document.querySelector(".search-toggle")
  const closeSearch = document.querySelector(".close-search")
  const searchOverlay = document.querySelector(".search-overlay")

  if (searchToggle && closeSearch && searchOverlay) {
    searchToggle.addEventListener("click", () => {
      searchOverlay.classList.remove("hidden")
      document.querySelector(".search-form input").focus()
    })

    closeSearch.addEventListener("click", () => {
      searchOverlay.classList.add("hidden")
    })

    // Close search on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !searchOverlay.classList.contains("hidden")) {
        searchOverlay.classList.add("hidden")
      }
    })

    // Search form submission
    const searchForm = document.querySelector(".search-form")
    if (searchForm) {
      searchForm.addEventListener("submit", (e) => {
        e.preventDefault()
        const searchTerm = searchForm.querySelector("input").value.toLowerCase()

        if (searchTerm.trim() !== "") {
          // Store search term and redirect to search results page
          sessionStorage.setItem("searchTerm", searchTerm)
          window.location.href = `main-shop.html?search=${encodeURIComponent(searchTerm)}`
        }
      })
    }
  }
}

// Load featured products on homepage
function loadFeaturedProducts() {
  const featuredContainer = document.getElementById("featured-products")
  if (!featuredContainer) return

  // Create hardcoded featured products
  const featuredProducts = [
    {
      id: 1,
      name: "Starry Beach",
      price: 1.0,
      image: "images/starry-beach.png",
    },
    {
      id: 101,
      name: "Mystery Box - Regular",
      price: 2.5,
      image: "images/mystery-regular.png",
    },
    {
      id: 201,
      name: "Summer Vibes",
      price: 2.0,
      image: "images/summer-vibes-bracelet.png",
    },
  ]

  // Display featured products
  featuredContainer.innerHTML = ""
  featuredProducts.forEach((product) => {
    const productCard = document.createElement("div")
    productCard.className = "product-card"
    productCard.innerHTML = `
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-price">£${product.price.toFixed(2)}</p>
        <button class="add-to-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-image="${product.image}">Add to Cart</button>
      </div>
    `
    featuredContainer.appendChild(productCard)
  })
}

// Function to load products
function loadProducts(category, sortOption = "featured") {
  let containerId
  let products = []

  // Determine which container to use based on category
  if (category === "main-shop") {
    containerId = "main-shop-products"
    products = [
      { id: 1, name: "Starry Beach", price: 1.0, image: "images/starry-beach.png" },
      { id: 2, name: "Summer Flowers", price: 1.5, image: "images/summer-flowers.png" },
      { id: 3, name: "Neon Pearls", price: 1.0, image: "images/neon-pearls.png" },
      { id: 4, name: "Smiley Pink", price: 1.0, image: "images/smiley-pink.png" },
      { id: 5, name: "Midnight Stars Bundle", price: 1.5, image: "images/midnight-stars.png" },
      { id: 6, name: "Custom", price: 1.5, image: "images/custom.png" },
      { id: 7, name: "Fruit n Toot", price: 1.0, image: "images/fruit-n-toot.png" },
      { id: 8, name: "Aloha", price: 1.0, image: "images/aloha.png" },
    ]
  } else if (category === "mystery-boxes") {
    containerId = "mystery-box-products"
    products = [
      { id: 101, name: "Mystery Box - Mini", price: 1.5, image: "images/mystery-mini.png" },
      { id: 102, name: "Mystery Box - Regular", price: 2.5, image: "images/mystery-regular.png" },
      { id: 103, name: "Mystery Box - Large", price: 3.99, image: "images/mystery-large.png" },
    ]
  } else if (category === "seasonal") {
    containerId = "seasonal-products"
    products = [
      { id: 201, name: "Summer Vibes", price: 2.0, image: "images/summer-vibes-bracelet.png" },
      { id: 202, name: "Pink Lemonade", price: 1.25, image: "images/pink-lemonade.png" },
      { id: 203, name: "Summer Salt", price: 1.2, image: "images/summer-salt.png" },
    ]
  }

  const container = document.getElementById(containerId)
  if (!container) return

  // Sort products if needed
  if (sortOption === "price-low") {
    products.sort((a, b) => a.price - b.price)
  } else if (sortOption === "price-high") {
    products.sort((a, b) => b.price - a.price)
  } else if (sortOption === "name-az") {
    products.sort((a, b) => a.name.localeCompare(b.name))
  } else if (sortOption === "name-za") {
    products.sort((a, b) => b.name.localeCompare(a.name))
  }

  // Clear container and display products
  container.innerHTML = ""

  products.forEach((product) => {
    const productCard = document.createElement("div")
    productCard.className = "product-card"
    productCard.innerHTML = `
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-price">£${product.price.toFixed(2)}</p>
        <button class="add-to-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-image="${product.image}">Add to Cart</button>
      </div>
    `
    container.appendChild(productCard)
  })
}

// Add item to cart
function addToCart(id, name, price, image) {
  const existingItem = cart.find((item) => item.id === id)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({
      id,
      name,
      price,
      quantity: 1,
      image: image || getImageForProduct(name),
    })
  }

  saveCart()
  updateCartCount()

  // Show confirmation
  const notification = document.createElement("div")
  notification.className = "notification"
  notification.innerHTML = `
    <div class="notification-content">
      <p>${name} added to cart!</p>
    </div>
  `

  document.body.appendChild(notification)

  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.classList.add("fade-out")
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 500)
  }, 2500)
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart))
}

// Update cart count in the header
function updateCartCount() {
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0)

  document.querySelectorAll("#cart-count, #cart-count-icon").forEach((element) => {
    if (element) {
      element.textContent = totalItems
    }
  })
}

// Load cart items on the cart page
function loadCart() {
  const cartList = document.getElementById("cart-list")
  const cartTotalPrice = document.getElementById("cart-total-price")

  if (cartList) {
    if (cart.length === 0) {
      cartList.innerHTML = '<p>Your cart is empty. <a href="main-shop.html">Continue shopping</a></p>'
      cartTotalPrice.textContent = "£0.00"
      return
    }

    cartList.innerHTML = ""
    let total = 0

    cart.forEach((item) => {
      const itemTotal = item.price * item.quantity
      total += itemTotal

      const cartItem = document.createElement("div")
      cartItem.className = "cart-item"
      cartItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
        <div class="cart-item-details">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">£${item.price.toFixed(2)}</div>
        </div>
        <div class="cart-item-quantity">
          <button class="quantity-btn decrease-quantity" data-id="${item.id}">-</button>
          <span class="quantity-value">${item.quantity}</span>
          <button class="quantity-btn increase-quantity" data-id="${item.id}">+</button>
        </div>
        <button class="remove-item" data-id="${item.id}">✕</button>
      `
      cartList.appendChild(cartItem)
    })

    cartTotalPrice.textContent = `£${total.toFixed(2)}`

    // Add event listeners for quantity buttons and remove buttons
    document.querySelectorAll(".decrease-quantity").forEach((button) => {
      button.addEventListener("click", function () {
        const id = Number.parseInt(this.getAttribute("data-id"))
        decreaseQuantity(id)
      })
    })

    document.querySelectorAll(".increase-quantity").forEach((button) => {
      button.addEventListener("click", function () {
        const id = Number.parseInt(this.getAttribute("data-id"))
        increaseQuantity(id)
      })
    })

    document.querySelectorAll(".remove-item").forEach((button) => {
      button.addEventListener("click", function () {
        const id = Number.parseInt(this.getAttribute("data-id"))
        removeItem(id)
      })
    })
  }
}

// Decrease item quantity
function decreaseQuantity(id) {
  const item = cart.find((item) => item.id === id)

  if (item) {
    item.quantity -= 1

    if (item.quantity <= 0) {
      removeItem(id)
    } else {
      saveCart()
      loadCart()
      updateCartCount()
    }
  }
}

// Increase item quantity
function increaseQuantity(id) {
  const item = cart.find((item) => item.id === id)

  if (item) {
    item.quantity += 1
    saveCart()
    loadCart()
    updateCartCount()
  }
}

// Remove item from cart
function removeItem(id) {
  cart = cart.filter((item) => item.id !== id)
  saveCart()
  loadCart()
  updateCartCount()
}

// Clear cart
function clearCart() {
  cart = []
  saveCart()
  updateCartCount()
}

// Process order
function processOrder() {
  if (cart.length === 0) {
    alert("Your cart is empty!")
    return
  }

  const email = document.getElementById("email").value
  document.getElementById("confirmation-email").textContent = email
  document.getElementById("order-confirmation").classList.remove("hidden")
}

// Helper function to get image path based on product name
function getImageForProduct(name) {
  // This is a simple implementation - in a real app, you'd have a more robust way to match images
  if (name.includes("Mystery")) {
    if (name.includes("Mini")) return "images/mystery-mini.png"
    if (name.includes("Regular")) return "images/mystery-regular.png"
    if (name.includes("Large")) return "images/mystery-large.png"
    return "images/mystery-regular.png"
  }

  if (name === "Summer Vibes") return "images/summer-vibes-bracelet.png"
  if (name === "Pink Lemonade") return "images/pink-lemonade.png"
  if (name === "Summer Salt") return "images/summer-salt.png"

  // Convert name to kebab case for image path
  const imageName = name.toLowerCase().replace(/\s+/g, "-")
  return `images/${imageName}.png`
}
