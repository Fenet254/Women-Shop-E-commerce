// Admin Panel for Girls Shop
// Simulated admin functionality for managing products

class AdminPanel {
  constructor() {
    this.isAdmin = localStorage.getItem('isAdmin') === 'true';
    this.init();
  }

  init() {
    if (this.isAdmin) {
      this.showAdminFeatures();
    } else {
      this.showAdminLogin();
    }
  }

  // Show admin login
  showAdminLogin() {
    const loginModal = document.createElement('div');
    loginModal.className = 'modal';
    loginModal.innerHTML = `
      <div class="modal-content admin-login">
        <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
        <h2>Admin Login</h2>
        <input type="password" id="admin-password" placeholder="Enter admin password" style="width: 100%; padding: 10px; margin: 10px 0; border-radius: 5px; border: 1px solid #ccc;">
        <button id="admin-login-btn" style="width: 100%; padding: 10px; background: var(--primary-color); color: white; border: none; border-radius: 5px; cursor: pointer;">Login</button>
      </div>
    `;
    document.body.appendChild(loginModal);
    loginModal.style.display = 'block';

    document.getElementById('admin-login-btn').addEventListener('click', () => {
      const password = document.getElementById('admin-password').value;
      if (password === 'admin123') { // Simple password for demo
        localStorage.setItem('isAdmin', 'true');
        this.isAdmin = true;
        loginModal.remove();
        this.showAdminFeatures();
        showNotification('Admin access granted!');
      } else {
        showNotification('Invalid password!');
      }
    });
  }

  // Show admin features
  showAdminFeatures() {
    // Add admin button to navbar
    const navbar = document.querySelector('.navbar');
    if (navbar && !document.querySelector('.admin-btn')) {
      const adminBtn = document.createElement('button');
      adminBtn.className = 'admin-btn';
      adminBtn.innerHTML = '⚙️ Admin';
      adminBtn.style.background = 'var(--accent-color)';
      adminBtn.style.color = 'var(--dark-color)';
      adminBtn.style.border = 'none';
      adminBtn.style.borderRadius = '25px';
      adminBtn.style.padding = '10px 15px';
      adminBtn.style.cursor = 'pointer';
      adminBtn.style.marginLeft = '10px';
      adminBtn.addEventListener('click', () => this.openAdminPanel());
      navbar.appendChild(adminBtn);
    }

    // Enable edit mode for products
    this.enableProductEditing();
  }

  // Open admin panel
  openAdminPanel() {
    const panel = document.createElement('div');
    panel.className = 'modal';
    panel.innerHTML = `
      <div class="modal-content admin-panel">
        <span class="close" onclick="this.parentElement.remove()">&times;</span>
        <h2>Admin Panel</h2>
        <div class="admin-tabs">
          <button class="tab-btn active" onclick="switchTab('products')">Products</button>
          <button class="tab-btn" onclick="switchTab('analytics')">Analytics</button>
          <button class="tab-btn" onclick="switchTab('settings')">Settings</button>
        </div>
        <div id="products-tab" class="tab-content">
          <h3>Product Management</h3>
          <button onclick="addNewProduct()">Add New Product</button>
          <div id="product-list">
            ${products.slice(0, 10).map(p => `
              <div class="admin-product-item">
                <img src="${p.image}" alt="${p.name}" style="width: 50px; height: 50px; object-fit: cover;">
                <span>${p.name}</span>
                <span>$${p.price}</span>
                <button onclick="editProduct(${p.id})">Edit</button>
                <button onclick="deleteProduct(${p.id})">Delete</button>
              </div>
            `).join('')}
          </div>
        </div>
        <div id="analytics-tab" class="tab-content" style="display: none;">
          <h3>Analytics</h3>
          <p>Total Products: ${products.length}</p>
          <p>Popular Products: ${analytics.getPopularProducts(5).map(p => p.name).join(', ')}</p>
          <p>User Behavior: ${JSON.stringify(analytics.getAnalytics().behavior, null, 2)}</p>
        </div>
        <div id="settings-tab" class="tab-content" style="display: none;">
          <h3>Settings</h3>
          <button onclick="resetAnalytics()">Reset Analytics</button>
          <button onclick="logoutAdmin()">Logout Admin</button>
        </div>
      </div>
    `;
    document.body.appendChild(panel);
    panel.style.display = 'block';
  }

  // Enable product editing
  enableProductEditing() {
    document.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        if (this.isAdmin) {
          const productId = card.querySelector('img').onclick.toString().match(/(\d+)/)[0];
          this.quickEditProduct(productId);
        }
      });
    });
  }

  // Quick edit product
  quickEditProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const newPrice = prompt('Enter new price:', product.price);
    if (newPrice && !isNaN(newPrice)) {
      product.price = parseFloat(newPrice);
      localStorage.setItem('products', JSON.stringify(products));
      renderProducts();
      showNotification('Product updated!');
    }
  }
}

// Global functions for admin
window.switchTab = function(tabName) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById(tabName + '-tab').style.display = 'block';
  event.target.classList.add('active');
};

window.addNewProduct = function() {
  const name = prompt('Product name:');
  const price = prompt('Price:');
  const category = prompt('Category:');
  const image = prompt('Image path:');
  if (name && price && category && image) {
    const newProduct = {
      id: products.length + 1,
      name,
      price: parseFloat(price),
      image,
      category,
      description: 'New product'
    };
    products.push(newProduct);
    localStorage.setItem('products', JSON.stringify(products));
    showNotification('Product added!');
    location.reload();
  }
};

window.editProduct = function(id) {
  const product = products.find(p => p.id === id);
  if (product) {
    const newName = prompt('New name:', product.name);
    const newPrice = prompt('New price:', product.price);
    if (newName) product.name = newName;
    if (newPrice) product.price = parseFloat(newPrice);
    localStorage.setItem('products', JSON.stringify(products));
    showNotification('Product updated!');
    location.reload();
  }
};

window.deleteProduct = function(id) {
  if (confirm('Delete this product?')) {
    const index = products.findIndex(p => p.id === id);
    if (index > -1) {
      products.splice(index, 1);
      localStorage.setItem('products', JSON.stringify(products));
      showNotification('Product deleted!');
      location.reload();
    }
  }
};

window.resetAnalytics = function() {
  if (confirm('Reset all analytics?')) {
    analytics.resetAnalytics();
    showNotification('Analytics reset!');
  }
};

window.logoutAdmin = function() {
  localStorage.removeItem('isAdmin');
  location.reload();
};

// Initialize admin
document.addEventListener('DOMContentLoaded', () => {
  new AdminPanel();
});
