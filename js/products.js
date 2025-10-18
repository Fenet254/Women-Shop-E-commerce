// Modernized Products Management for Girls Shop E-Commerce
let products = [];
let currentCategory = 'all';
let currentSort = '';

// Fetch products from backend API
async function fetchProducts() {
  try {
    const response = await fetch('../php/api/products.php');
    if (!response.ok) {
      throw new Error('Failed to fetch products from API');
    }
    const data = await response.json();
    products = data.products || [];
    displayProducts(products);
    hideLoadingSpinner();
  } catch (error) {
    console.error('Error fetching products:', error);
    showErrorMessage('Failed to load products. Please try again later.');
    hideLoadingSpinner();
    // Fallback to hardcoded products if API fails
    loadFallbackProducts();
  }
}

// Fallback products in case API is not available
function loadFallbackProducts() {
  products = [
    // Dresses
    { id: 1, name: "Elegant Red Dress", price: 89.99, image: "../image/dressimage/dress.png", category: "dresses", description: "Stunning red dress perfect for parties.", sizes: ["S", "M", "L", "XL"], colors: ["Red"], reviews: [{ user: "Alice", rating: 5, comment: "Love it!" }], rating: 5 },
    { id: 2, name: "Summer Floral Dress", price: 59.99, image: "../image/dressimage/dress1.png", category: "dresses", description: "Light floral dress for summer outings." },
    { id: 3, name: "Black Evening Dress", price: 129.99, image: "../image/dressimage/dress2.png", category: "dresses", description: "Sophisticated black dress for evenings." },
    { id: 4, name: "Casual Blue Dress", price: 49.99, image: "../image/dressimage/dress3.png", category: "dresses", description: "Comfortable blue dress for daily wear." },
    { id: 5, name: "Vintage Pink Dress", price: 79.99, image: "../image/dressimage/dress4.png", category: "dresses", description: "Vintage-inspired pink dress." },
    { id: 6, name: "Maxi Green Dress", price: 99.99, image: "../image/dressimage/dress5.png", category: "dresses", description: "Flowy green maxi dress." },
    { id: 7, name: "Chic White Dress", price: 69.99, image: "../image/dressimage/dress6.png", category: "dresses", description: "Chic white dress for any occasion." },
    { id: 8, name: "Bohemian Yellow Dress", price: 54.99, image: "../image/dressimage/dress7.png", category: "dresses", description: "Bohemian style yellow dress." },
    { id: 9, name: "Sleeveless Purple Dress", price: 64.99, image: "../image/dressimage/dress8.png", category: "dresses", description: "Sleeveless purple dress." },
    { id: 10, name: "Classic Black Dress", price: 84.99, image: "../image/dressimage/dress9.png", category: "dresses", description: "Timeless classic black dress." },
    { id: 11, name: "Off-Shoulder Dress", price: 74.99, image: "../image/dressimage/dress10.png", category: "dresses", description: "Trendy off-shoulder dress." },

    // Skirts
    { id: 12, name: "Pleated Mini Skirt", price: 39.99, image: "../image/skirtimage/skirt1.png", category: "skirts", description: "Cute pleated mini skirt." },
    { id: 13, name: "Denim Midi Skirt", price: 49.99, image: "../image/skirtimage/skirt2.png", category: "skirts", description: "Stylish denim midi skirt." },
    { id: 14, name: "Leather Pencil Skirt", price: 79.99, image: "../image/skirtimage/skirt3.png", category: "skirts", description: "Edgy leather pencil skirt." },
    { id: 15, name: "Floral A-Line Skirt", price: 44.99, image: "../image/skirtimage/skirt4.png", category: "skirts", description: "Floral A-line skirt." },
    { id: 16, name: "High-Waisted Skirt", price: 54.99, image: "../image/skirtimage/skirt5.png", category: "skirts", description: "High-waisted skirt for fashion." },
    { id: 17, name: "Tulle Tutu Skirt", price: 34.99, image: "../image/skirtimage/skirt7.png", category: "skirts", description: "Fun tulle tutu skirt." },
    { id: 18, name: "Wrap Skirt", price: 59.99, image: "../image/skirtimage/skirt8.png", category: "skirts", description: "Elegant wrap skirt." },
    { id: 19, name: "Chiffon Skirt", price: 49.99, image: "../image/skirtimage/skirt9.png", category: "skirts", description: "Light chiffon skirt." },
    { id: 20, name: "Asymmetrical Skirt", price: 64.99, image: "../image/skirtimage/skirt10.png", category: "skirts", description: "Modern asymmetrical skirt." },
    { id: 21, name: "Velvet Skirt", price: 69.99, image: "../image/skirtimage/skirt11.png", category: "skirts", description: "Luxurious velvet skirt." },
    { id: 22, name: "Cargo Skirt", price: 59.99, image: "../image/skirtimage/skirt12.png", category: "skirts", description: "Practical cargo skirt." },
    { id: 23, name: "Maxi Skirt", price: 74.99, image: "../image/skirtimage/skirt13.png", category: "skirts", description: "Flowy maxi skirt." },

    // Suits
    { id: 24, name: "Tailored Blazer Suit", price: 149.99, image: "../image/suitimage/suit1.png", category: "suits", description: "Professional tailored blazer suit." },
    { id: 25, name: "Pinstripe Suit", price: 179.99, image: "../image/suitimage/suit2.png", category: "suits", description: "Classic pinstripe suit." },
    { id: 26, name: "Velvet Suit", price: 199.99, image: "../image/suitimage/suit3.png", category: "suits", description: "Luxurious velvet suit." },
    { id: 27, name: "Casual Suit", price: 129.99, image: "../image/suitimage/suit4.png", category: "suits", description: "Casual yet elegant suit." },
    { id: 28, name: "Two-Piece Suit", price: 159.99, image: "../image/suitimage/suit5.png", category: "suits", description: "Versatile two-piece suit." },
    { id: 29, name: "Jumpsuit Suit", price: 139.99, image: "../image/suitimage/suit6.png", category: "suits", description: "Modern jumpsuit suit." },
    { id: 30, name: "Tuxedo Suit", price: 249.99, image: "../image/suitimage/suit7.png", category: "suits", description: "Formal tuxedo suit." },
    { id: 31, name: "Skirt Suit", price: 169.99, image: "../image/suitimage/suit8.png", category: "suits", description: "Chic skirt suit." },
    { id: 32, name: "Pant Suit", price: 189.99, image: "../image/suitimage/suit9.png", category: "suits", description: "Professional pant suit." },

    // Pajamas
    { id: 33, name: "Black Pajama Set", price: 29.99, image: "../image/pjamaimage/black-pjama.png", category: "pajamas", description: "Comfortable black pajama set." },
    { id: 34, name: "Blue Pajama Set", price: 29.99, image: "../image/pjamaimage/blue-pjama.png", category: "pajamas", description: "Cozy blue pajama set." },
    { id: 35, name: "Pink Pajama Set", price: 29.99, image: "../image/pjamaimage/pink-pijama.png", category: "pajamas", description: "Adorable pink pajama set." },

    // Shoes
    { id: 52, name: "Red Heels", price: 79.99, image: "../six.png", category: "shoes", description: "Classic red high heels." },
    { id: 53, name: "White Sneakers", price: 59.99, image: "../seven.png", category: "shoes", description: "Comfortable white sneakers." },
    { id: 54, name: "Black Boots", price: 99.99, image: "../eight.png", category: "shoes", description: "Stylish black boots." },
    { id: 55, name: "Sandals", price: 39.99, image: "../nine.png", category: "shoes", description: "Summer sandals." },
    { id: 56, name: "Loafers", price: 69.99, image: "../ten.png", category: "shoes", description: "Elegant loafers." },

    // Jewelry
    { id: 57, name: "Gold Necklace", price: 49.99, image: "../eleven.png", category: "jewelry", description: "Shiny gold necklace." },

document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.querySelector(".login-form");
  const registerForm = document.querySelector(".register-form");
  const loginContainer = document.querySelector(".account-form:nth-child(1)");
  const registerContainer = document.querySelector(".account-form:nth-child(2)");

  const toggleButtons = document.createElement("div");
  toggleButtons.className = "toggle-buttons";
  toggleButtons.innerHTML = `
    <button onclick="showLogin()">Login</button>
    <button onclick="showRegister()">Register</button>
  `;
  document.querySelector(".account-forms").prepend(toggleButtons);

  window.showLogin = function () {
    loginContainer.classList.remove("inactive");
    registerContainer.classList.add("inactive");
  };

  window.showRegister = function () {
    registerContainer.classList.remove("inactive");
    loginContainer.classList.add("inactive");
  };

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.password.value;

    if (email && password) {
      alert("Login successful!");
    
    } else {
      alert("Please fill in all fields.");
    }
  });

  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = registerForm.email.value;
    const password = registerForm.password.value;
    const confirmPassword = registerForm.confirmPassword.value;

    if (!email || !password || !confirmPassword) {
      alert("Please fill in all fields.");
    } else if (password !== confirmPassword) {
      alert("Passwords do not match.");
    } else {
      alert("Registration successful!");
      
    }
  });

  showLogin();
});
function showLogin() {
  document.getElementById("login-container").style.display = "block";
  document.getElementById("register-container").style.display = "none";
}

function showRegister() {
  document.getElementById("register-container").style.display = "block";
  document.getElementById("login-container").style.display = "none";
}

// Optional: Set default view
document.addEventListener("DOMContentLoaded", showLogin);


