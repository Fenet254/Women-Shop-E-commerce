// Advanced E-Commerce Girls Shop JavaScript
// Core functionality: Products, Cart, Wishlist, Search, Slider, etc.

// Import products
let products = [];
fetch('../js/products.js')
  .then(response => response.text())
  .then(text => {
    // Extract products array from the file
    const match = text.match(/const products = (\[[\s\S]*?\]);/);
    if (match) {
      products = eval(match[1]);
      // Load from localStorage if modified
      const storedProducts = localStorage.getItem('products');
      if (storedProducts) {
        products = JSON.parse(storedProducts);
      }
      initApp();
    }
  })
  .catch(error => {
    console.error('Error loading products:', error);
    // Fallback: define products inline if fetch fails
    products = [
      { id: 1, name: "Sample Dress", price: 50, image: "../image/dressimage/dress.png", category: "dresses", description: "Sample description" }
    ];
    initApp();
  });

// Load additional scripts
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// Load PWA and Admin scripts
Promise.all([
  loadScript('../js/pwa.js'),
  loadScript('../js/admin.js')
]).then(() => {
  console.log('PWA and Admin scripts loaded');
}).catch(error => {
  console.error('Error loading scripts:', error);
});

// Voice search functionality
function initVoiceSearch() {
  const searchInput = document.querySelector('.search-bar input');
  if (!searchInput || !('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) return;

  const voiceBtn = document.createElement('button');
  voiceBtn.innerHTML = '🎤';
  voiceBtn.setAttribute('aria-label', 'Voice search');
  voiceBtn.style.marginLeft = '10px';
  voiceBtn.style.background = 'var(--primary-color)';
  voiceBtn.style.color = 'white';
  voiceBtn.style.border = 'none';
  voiceBtn.style.borderRadius = '50%';
  voiceBtn.style.width = '40px';
  voiceBtn.style.height = '40px';
  voiceBtn.style.cursor = 'pointer';
  searchInput.parentNode.appendChild(voiceBtn);

  voiceBtn.addEventListener('click', () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      searchInput.value = transcript;
      performSearch(transcript);
    };

    recognition.onerror = (event) => {
      showNotification('Voice search failed. Please try again.');
    };
  });
}

// Advanced filters
function initAdvancedFilters() {
  const filterContainer = document.querySelector('.filter-container');
  if (!filterContainer) return;

  filterContainer.innerHTML = `
    <div class="advanced-filters">
      <select id="size-filter">
        <option value="">All Sizes</option>
        <option value="S">Small</option>
        <option value="M">Medium</option>
        <option value="L">Large</option>
        <option value="XL">Extra Large</option>
      </select>
      <select id="color-filter">
        <option value="">All Colors</option>
        <option value="red">Red</option>
        <option value="blue">Blue</option>
        <option value="black">Black</option>
        <option value="white">White</option>
        <option value="pink">Pink</option>
      </select>
      <input type="range" id="price-filter" min="0" max="200" value="200">
      <span id="price-value">$200</span>
      <button id="apply-filters">Apply Filters</button>
    </div>
  `;

  const priceFilter = document.getElementById('price-filter');
  const priceValue = document.getElementById('price-value');
  priceFilter.addEventListener('input', () => {
    priceValue.textContent = '$' + priceFilter.value;
  });

  document.getElementById('apply-filters').addEventListener('click', () => {
    const size = document.getElementById('size-filter').value;
    const color = document.getElementById('color-filter').value;
    const maxPrice = parseInt(priceFilter.value);

    filteredProducts = products.filter(product => {
      return (!size || product.size === size) &&
             (!color || product.color === color) &&
             product.price <= maxPrice;
    });
    renderProducts();
  });
}

// User profiles
function initUserProfiles() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) return;

  // Add user menu to navbar
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const userMenu = document.createElement('div');
    userMenu.className = 'user-menu';
    userMenu.innerHTML = `
      <button class="user-btn">${user.email.split('@')[0]}</button>
      <div class="user-dropdown">
        <a href="account.html">Profile</a>
        <a href="#" onclick="logout()">Logout</a>
      </div>
    `;
    navbar.appendChild(userMenu);
  }
}

window.logout = function() {
  localStorage.removeItem('user');
  window.location.reload();
};

// Social sharing
function initSocialSharing() {
  document.querySelectorAll('.product-card').forEach(card => {
    const shareBtn = document.createElement('button');
    shareBtn.innerHTML = '📤';
    shareBtn.setAttribute('aria-label', 'Share product');
    shareBtn.className = 'share-btn';
    shareBtn.onclick = () => shareProduct(card);
    card.querySelector('.buttons').appendChild(shareBtn);
  });
}

function shareProduct(card) {
  const productName = card.querySelector('h3').textContent;
  const productImage = card.querySelector('img').src;
  const url = window.location.href;

  if (navigator.share) {
    navigator.share({
      title: productName,
      text: `Check out this ${productName}!`,
      url: url
    });
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard.writeText(`${productName} - ${url}`);
    showNotification('Link copied to clipboard!');
  }
}

// Image search
function initImageSearch() {
  const imageSearchBtn = document.querySelector('.image-search-btn');
  if (!imageSearchBtn) return;

  imageSearchBtn.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        // Simulate image search (in real app, send to AI service)
        showNotification('Image search feature coming soon!');
      }
    };
    input.click();
  });
}

// Initialize app after products load
function initApp() {
  // DOM elements
  const productContainer = document.querySelector('.product-container');
  const searchInput = document.querySelector('.search-bar input');
  const searchButton = document.querySelector('.search-bar button');
  const slider = document.querySelector('.slider');
  const slideTrack = document.querySelector('.slide-track');
  const prevBtn = document.querySelector('.prev');
  const nextBtn = document.querySelector('.next');
  const themeToggle = document.querySelector('.theme-toggle') || createThemeToggle();
  const cartCount = document.querySelector('.cart-count') || createCartCount();
  const wishlistCount = document.querySelector('.wishlist-count') || createWishlistCount();

  // State
  let currentSlide = 0;
  let filteredProducts = [...products];
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  let currentCategory = 'all';

  // Initialize
  renderProducts();
  updateCartCount();
  updateWishlistCount();
  initSlider();
  initSearch();
  initVoiceSearch();
  initAdvancedFilters();
  initUserProfiles();
  initSocialSharing();
  initImageSearch();
  initThemeToggle();
  renderFeaturedSection();
  renderRelatedSection();
  renderAdvertisementSection();

  // Create theme toggle if not exists
  function createThemeToggle() {
    const toggle = document.createElement('button');
    toggle.className = 'theme-toggle';
    toggle.innerHTML = '🌙';
    toggle.setAttribute('aria-label', 'Toggle dark mode');
    document.body.appendChild(toggle);
    return toggle;
  }

  // Create cart/wishlist counts in nav
  function createCartCount() {
    const cartLink = document.querySelector('a[href*="carts"]');
    if (cartLink) {
      const count = document.createElement('span');
      count.className = 'cart-count';
      count.style.background = 'var(--primary-color)';
      count.style.color = 'white';
      count.style.borderRadius = '50%';
      count.style.padding = '2px 6px';
      count.style.fontSize = '12px';
      count.style.marginLeft = '5px';
      cartLink.appendChild(count);
      return count;
    }
  }

  function createWishlistCount() {
    const wishlistLink = document.querySelector('a[href*="wishlist"]');
    if (wishlistLink) {
      const count = document.createElement('span');
      count.className = 'wishlist-count';
      count.style.background = 'var(--accent-color)';
      count.style.color = 'var(--dark-color)';
      count.style.borderRadius = '50%';
      count.style.padding = '2px 6px';
      count.style.fontSize = '12px';
      count.style.marginLeft = '5px';
      wishlistLink.appendChild(count);
      return count;
    }
  }

  // Render products
  function renderProducts(productsToRender = filteredProducts) {
    if (!productContainer) return;

    productContainer.innerHTML = '';
    productsToRender.forEach(product => {
      const productCard = document.createElement('div');
      productCard.className = 'product-card';
      productCard.innerHTML = `
        <img src="${product.image}" alt="${product.name}" loading="lazy" onclick="openModal(${product.id})">
        <div class="info">
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <div class="price">$${product.price}</div>
          <div class="buttons">
            <button class="add-to-cart" onclick="addToCart(${product.id})" aria-label="Add ${product.name} to cart">Add to Cart</button>
            <button class="add-to-wishlist" onclick="addToWishlist(${product.id})" aria-label="Add ${product.name} to wishlist">❤️</button>
          </div>
        </div>
      `;
      productContainer.appendChild(productCard);
    });
  }

  // Slider functionality
  function initSlider() {
    if (!slider || !slideTrack) return;

    const slides = slideTrack.children;
    const totalSlides = slides.length;

    function showSlide(index) {
      slideTrack.style.transform = `translateX(-${index * 100}%)`;
      currentSlide = index;
    }

    function nextSlide() {
      currentSlide = (currentSlide + 1) % totalSlides;
      showSlide(currentSlide);
    }

    function prevSlide() {
      currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
      showSlide(currentSlide);
    }

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Auto-slide
    setInterval(nextSlide, 5000);
  }

  // Perform search with query
  function performSearch(overrideQuery) {
    const query = overrideQuery ? overrideQuery.toLowerCase() : searchInput.value.toLowerCase();
    filteredProducts = products.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    );
    renderProducts();
  }

  // Search functionality
  function initSearch() {
    if (!searchInput || !searchButton) return;

    searchButton.addEventListener('click', () => performSearch());
    searchInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') performSearch();
    });

    // Mega menu toggle
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    if (dropdownToggle) {
      dropdownToggle.addEventListener('click', (e) => {
        e.preventDefault();
        const megaMenu = document.querySelector('.mega-menu');
        if (megaMenu) {
          megaMenu.classList.toggle('show');
        }
      });
    }

    // Search suggestions
    const searchSuggestions = document.getElementById('search-suggestions');
    if (searchInput && searchSuggestions) {
      searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        if (query.length > 1) {
          const suggestions = products.filter(product =>
            product.name.toLowerCase().includes(query)
          ).slice(0, 5);

          searchSuggestions.innerHTML = suggestions.map(product =>
            `<div class="suggestion-item" onclick="selectSuggestion('${product.name}')">${product.name}</div>`
          ).join('');
          searchSuggestions.style.display = suggestions.length > 0 ? 'block' : 'none';
        } else {
          searchSuggestions.style.display = 'none';
        }
      });

      // Hide suggestions when clicking outside
      document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
          searchSuggestions.style.display = 'none';
        }
      });
    }
  }

  // Select search suggestion
  window.selectSuggestion = function(name) {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.value = name;
      document.getElementById('search-suggestions').style.display = 'none';
      performSearch(name);
    }
  };

  // Theme toggle
  function initThemeToggle() {
    if (!themeToggle) return;

    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    themeToggle.innerHTML = currentTheme === 'dark' ? '☀️' : '🌙';

    themeToggle.addEventListener('click', () => {
      const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      themeToggle.innerHTML = newTheme === 'dark' ? '☀️' : '🌙';
    });
  }

  // Cart functions
  window.addToCart = function(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification('Added to cart!');
  };

  function updateCartCount() {
    if (cartCount) {
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      cartCount.textContent = totalItems;
      cartCount.style.display = totalItems > 0 ? 'inline' : 'none';
    }
  }

  // Wishlist functions
  window.addToWishlist = function(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (!wishlist.find(item => item.id === productId)) {
      wishlist.push(product);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      updateWishlistCount();
      showNotification('Added to wishlist!');
    } else {
      showNotification('Already in wishlist!');
    }
  };

  function updateWishlistCount() {
    if (wishlistCount) {
      wishlistCount.textContent = wishlist.length;
      wishlistCount.style.display = wishlist.length > 0 ? 'inline' : 'none';
    }
  }

  // Modal for product details
  window.openModal = function(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close" onclick="closeModal()">&times;</span>
        <img src="${product.image}" alt="${product.name}" loading="lazy" style="width: 100%; border-radius: 10px; margin-bottom: 20px;">
        <h2>${product.name}</h2>
        <p>${product.description}</p>
        <div class="price" style="font-size: 24px; color: var(--primary-color); margin: 20px 0;">$${product.price}</div>
        <div class="buttons">
          <button class="add-to-cart" onclick="addToCart(${product.id}); closeModal();" aria-label="Add ${product.name} to cart">Add to Cart</button>
          <button class="add-to-wishlist" onclick="addToWishlist(${product.id}); closeModal();" aria-label="Add ${product.name} to wishlist">❤️ Add to Wishlist</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'block';
  };

  window.closeModal = function() {
    const modal = document.querySelector('.modal');
    if (modal) modal.remove();
  };

  // Notification system
  function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.background = 'var(--primary-color)';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '25px';
    notification.style.boxShadow = 'var(--shadow)';
    notification.style.zIndex = '1001';
    notification.style.animation = 'slideIn 0.3s ease';
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  // Filter by category (for category pages)
  window.filterByCategory = function(category) {
    currentCategory = category;
    if (category === 'all') {
      filteredProducts = [...products];
    } else {
      filteredProducts = products.filter(product => product.category === category);
    }
    renderProducts();
  };

  // Sort products
  window.sortProducts = function(criteria) {
    filteredProducts.sort((a, b) => {
      if (criteria === 'price-low') return a.price - b.price;
      if (criteria === 'price-high') return b.price - a.price;
      if (criteria === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
    renderProducts();
  };

  // Infinite scroll simulation
  let loading = false;
  window.addEventListener('scroll', () => {
    if (loading) return;
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
      loading = true;
      // Simulate loading more products
      setTimeout(() => {
        // In a real app, fetch more from server
        showNotification('More products loaded!');
        loading = false;
      }, 1000);
    }
  });

  // Render featured section under search bar
  function renderFeaturedSection() {
    const searchBar = document.querySelector('.search-bar');
    if (!searchBar) return;

    const featuredSection = document.createElement('div');
    featuredSection.className = 'featured-section';
    featuredSection.innerHTML = `
      <h2>Featured Categories</h2>
      <div class="featured-grid">
        <div class="featured-item">
          <img src="../image/dressimage/dress.png" alt="Dresses">
          <h3>Dresses</h3>
          <p>Explore our latest dress collection.</p>
        </div>
        <div class="featured-item">
          <img src="../image/skirtimage/skirt1.png" alt="Skirts">
          <h3>Skirts</h3>
          <p>Stylish skirts for every occasion.</p>
        </div>
        <div class="featured-item">
          <img src="../image/suitimage/suit1.png" alt="Suits">
          <h3>Suits</h3>
          <p>Elegant suits for formal wear.</p>
        </div>
      </div>
    `;
    searchBar.insertAdjacentElement('afterend', featuredSection);
  }

  // Render related section before footer
  function renderRelatedSection() {
    const footer = document.querySelector('footer');
    if (!footer) return;

    const relatedSection = document.createElement('div');
    relatedSection.className = 'related-section';
    relatedSection.innerHTML = `
      <h2>You Might Also Like</h2>
      <div class="related-products">
        ${products.slice(0, 4).map(product => `
          <div class="related-product">
            <img src="${product.image}" alt="${product.name}">
            <h4>${product.name}</h4>
          </div>
        `).join('')}
      </div>
    `;
    footer.insertAdjacentElement('beforebegin', relatedSection);
  }

  // Render advertisement section before footer
  function renderAdvertisementSection() {
    const advertisementGrid = document.querySelector('.advertisement-grid');
    if (!advertisementGrid) return;

    const images = [
      'back.png', 'bottoms.png', 'ff.png', 'fifteen.png', 'fine.png', 'foutheen.png',
      'ii.png', 'seventeen.png', 'seventen.png', 'sixteen.png', 'thirteen.png',
      'twelve.png', 'twen.png', 'twtw.png', 'eighteen.png'
    ];

    advertisementGrid.innerHTML = images.map(img => `
      <div class="advertisement-item" onclick="showNotification('Advertisement clicked!')">
        <img src="../${img}" alt="Advertisement">
      </div>
    `).join('');
  }

  // Expose functions globally for HTML onclick
  window.renderProducts = renderProducts;
  window.filterByCategory = filterByCategory;
  window.sortProducts = sortProducts;
}

// Cart page functions
function initCartPage() {
  const cartContainer = document.querySelector('.cart-container');
  if (!cartContainer) return;

  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  let total = 0;

  cartContainer.innerHTML = '';
  cart.forEach(item => {
    total += item.price * item.quantity;
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}" loading="lazy">
      <div>
        <h3>${item.name}</h3>
        <p>$${item.price} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}</p>
        <button onclick="removeFromCart(${item.id})">Remove</button>
      </div>
    `;
    cartContainer.appendChild(cartItem);
  });

  const totalDiv = document.createElement('div');
  totalDiv.className = 'cart-total';
  totalDiv.textContent = `Total: $${total.toFixed(2)}`;
  cartContainer.appendChild(totalDiv);

  const checkoutBtn = document.createElement('button');
  checkoutBtn.textContent = 'Checkout';
  checkoutBtn.onclick = () => showNotification('Checkout simulation - Payment processed!');
  cartContainer.appendChild(checkoutBtn);
}

window.removeFromCart = function(productId) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart = cart.filter(item => item.id !== productId);
  localStorage.setItem('cart', JSON.stringify(cart));
  initCartPage();
  updateCartCount();
};

// Wishlist page functions
function initWishlistPage() {
  const wishlistContainer = document.querySelector('.wishlist-container');
  if (!wishlistContainer) return;

  const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

  wishlistContainer.innerHTML = '';
  wishlist.forEach(item => {
    const wishlistItem = document.createElement('div');
    wishlistItem.className = 'wishlist-item';
    wishlistItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}" loading="lazy">
      <div>
        <h3>${item.name}</h3>
        <p>$${item.price}</p>
        <button onclick="addToCart(${item.id})">Add to Cart</button>
        <button onclick="removeFromWishlist(${item.id})">Remove</button>
      </div>
    `;
    wishlistContainer.appendChild(wishlistItem);
  });
}

window.removeFromWishlist = function(productId) {
  let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  wishlist = wishlist.filter(item => item.id !== productId);
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
  initWishlistPage();
  updateWishlistCount();
};

// Account page functions
function initAccountPage() {
  const loginForm = document.querySelector('.login-form');
  const registerForm = document.querySelector('.register-form');

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = e.target.email.value;
      const password = e.target.password.value;
      // Simulate login
      localStorage.setItem('user', JSON.stringify({ email, loggedIn: true }));
      showNotification('Logged in successfully!');
      window.location.href = 'index.html';
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = e.target.email.value;
      const password = e.target.password.value;
      // Simulate register
      localStorage.setItem('user', JSON.stringify({ email, loggedIn: true }));
      showNotification('Registered successfully!');
      window.location.href = 'index.html';
    });
  }
}

// Initialize page-specific functions
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.cart-container')) initCartPage();
  if (document.querySelector('.wishlist-container')) initWishlistPage();
  if (document.querySelector('.login-form') || document.querySelector('.register-form')) initAccountPage();
});
