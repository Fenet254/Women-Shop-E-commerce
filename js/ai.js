// AI-Powered Recommendations for Girls Shop
// Simulates AI recommendations based on user behavior

class AIRecommendations {
  constructor() {
    this.viewedProducts = JSON.parse(localStorage.getItem('viewedProducts')) || [];
    this.cartProducts = JSON.parse(localStorage.getItem('cart')) || [];
    this.wishlistProducts = JSON.parse(localStorage.getItem('wishlist')) || [];
  }

  // Track product view
  trackView(productId) {
    if (!this.viewedProducts.includes(productId)) {
      this.viewedProducts.push(productId);
      localStorage.setItem('viewedProducts', JSON.stringify(this.viewedProducts));
    }
  }

  // Get recommendations based on viewed, cart, wishlist
  getRecommendations(limit = 6) {
    const allInteracted = [...new Set([...this.viewedProducts, ...this.cartProducts.map(p => p.id), ...this.wishlistProducts.map(p => p.id)])];
    const recommendations = [];

    // Simple logic: Recommend similar category products not interacted with
    allInteracted.forEach(id => {
      const product = products.find(p => p.id === id);
      if (product) {
        const similar = products.filter(p =>
          p.category === product.category &&
          !allInteracted.includes(p.id) &&
          p.id !== id
        );
        recommendations.push(...similar);
      }
    });

    // If no recommendations, recommend popular (high rating or random)
    if (recommendations.length === 0) {
      recommendations.push(...products.filter(p => p.rating >= 4).slice(0, limit));
    }

    // Shuffle and limit
    return this.shuffleArray(recommendations).slice(0, limit);
  }

  // Shuffle array
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Get personalized suggestions for homepage
  getPersonalizedSuggestions() {
    return this.getRecommendations(4);
  }
}

// Global instance
const aiRec = new AIRecommendations();
