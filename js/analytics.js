// Analytics for Girls Shop
// Tracks user behavior, product views, popular items

class Analytics {
  constructor() {
    this.views = JSON.parse(localStorage.getItem('productViews')) || {};
    this.popularProducts = JSON.parse(localStorage.getItem('popularProducts')) || [];
    this.userBehavior = JSON.parse(localStorage.getItem('userBehavior')) || {
      pageViews: 0,
      timeSpent: 0,
      searches: [],
      clicks: []
    };
    this.startTime = Date.now();
  }

  // Track product view
  trackProductView(productId) {
    this.views[productId] = (this.views[productId] || 0) + 1;
    localStorage.setItem('productViews', JSON.stringify(this.views));
    this.updatePopularProducts();
  }

  // Update popular products list
  updatePopularProducts() {
    const sorted = Object.entries(this.views)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([id]) => parseInt(id));
    this.popularProducts = sorted;
    localStorage.setItem('popularProducts', JSON.stringify(this.popularProducts));
  }

  // Get popular products
  getPopularProducts(limit = 6) {
    return this.popularProducts.slice(0, limit).map(id => products.find(p => p.id === id)).filter(Boolean);
  }

  // Track page view
  trackPageView(page) {
    this.userBehavior.pageViews++;
    this.userBehavior.clicks.push({ page, timestamp: Date.now() });
    localStorage.setItem('userBehavior', JSON.stringify(this.userBehavior));
  }

  // Track search
  trackSearch(query) {
    this.userBehavior.searches.push({ query, timestamp: Date.now() });
    localStorage.setItem('userBehavior', JSON.stringify(this.userBehavior));
  }

  // Track time spent
  trackTimeSpent() {
    const timeSpent = Math.floor((Date.now() - this.startTime) / 1000);
    this.userBehavior.timeSpent += timeSpent;
    localStorage.setItem('userBehavior', JSON.stringify(this.userBehavior));
  }

  // Get analytics data
  getAnalytics() {
    return {
      views: this.views,
      popular: this.popularProducts,
      behavior: this.userBehavior
    };
  }

  // Reset analytics (for admin)
  resetAnalytics() {
    localStorage.removeItem('productViews');
    localStorage.removeItem('popularProducts');
    localStorage.removeItem('userBehavior');
    this.views = {};
    this.popularProducts = [];
    this.userBehavior = { pageViews: 0, timeSpent: 0, searches: [], clicks: [] };
  }
}

// Global instance
const analytics = new Analytics();

// Track page view on load
document.addEventListener('DOMContentLoaded', () => {
  analytics.trackPageView(window.location.pathname);
});

// Track time on unload
window.addEventListener('beforeunload', () => {
  analytics.trackTimeSpent();
});
