// Simple Chatbot for Girls Shop
// Provides FAQs, product queries, support

class Chatbot {
  constructor() {
    this.isOpen = false;
    this.responses = {
      greeting: "Hello! How can I help you today? 😊",
      faq: {
        shipping: "We offer free shipping on orders over $50. Standard delivery takes 3-5 business days.",
        returns: "Returns are accepted within 30 days. Items must be unworn with tags attached.",
        sizes: "Check our size guide in product descriptions. If unsure, contact us!",
        payment: "We accept Visa, Mastercard, PayPal, and Apple Pay.",
        contact: "Email us at support@girlsshop.com or call 1-800-SHOP-NOW."
      },
      products: {
        dresses: "We have elegant dresses for all occasions! Check our dresses category.",
        skirts: "From mini to maxi, our skirts are perfect for any style.",
        suits: "Professional and casual suits available.",
        makeup: "Beauty products to enhance your look.",
        default: "Browse our categories for the latest trends!"
      }
    };
    this.init();
  }

  init() {
    this.createChatbotUI();
    this.bindEvents();
  }

  createChatbotUI() {
    const chatbotHTML = `
      <div id="chatbot" class="chatbot">
        <div class="chatbot-toggle" id="chatbot-toggle">💬</div>
        <div class="chatbot-window" id="chatbot-window">
          <div class="chatbot-header">
            <h4>Girls Shop Assistant</h4>
            <button id="chatbot-close">&times;</button>
          </div>
          <div class="chatbot-messages" id="chatbot-messages">
            <div class="message bot">${this.responses.greeting}</div>
          </div>
          <div class="chatbot-input">
            <input type="text" id="chatbot-input" placeholder="Ask me anything...">
            <button id="chatbot-send">Send</button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', chatbotHTML);
  }

  bindEvents() {
    const toggle = document.getElementById('chatbot-toggle');
    const close = document.getElementById('chatbot-close');
    const send = document.getElementById('chatbot-send');
    const input = document.getElementById('chatbot-input');

    toggle.addEventListener('click', () => this.toggleChat());
    close.addEventListener('click', () => this.closeChat());
    send.addEventListener('click', () => this.sendMessage());
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    const window = document.getElementById('chatbot-window');
    window.style.display = this.isOpen ? 'flex' : 'none';
  }

  closeChat() {
    this.isOpen = false;
    document.getElementById('chatbot-window').style.display = 'none';
  }

  sendMessage() {
    const input = document.getElementById('chatbot-input');
    const message = input.value.trim();
    if (!message) return;

    this.addMessage('user', message);
    input.value = '';

    // Simulate response
    setTimeout(() => {
      const response = this.generateResponse(message);
      this.addMessage('bot', response);
    }, 1000);
  }

  addMessage(sender, text) {
    const messages = document.getElementById('chatbot-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.textContent = text;
    messages.appendChild(messageDiv);
    messages.scrollTop = messages.scrollHeight;
  }

  generateResponse(message) {
    const lowerMsg = message.toLowerCase();

    // Check for keywords
    if (lowerMsg.includes('shipping') || lowerMsg.includes('delivery')) return this.responses.faq.shipping;
    if (lowerMsg.includes('return') || lowerMsg.includes('refund')) return this.responses.faq.returns;
    if (lowerMsg.includes('size')) return this.responses.faq.sizes;
    if (lowerMsg.includes('payment') || lowerMsg.includes('pay')) return this.responses.faq.payment;
    if (lowerMsg.includes('contact') || lowerMsg.includes('help')) return this.responses.faq.contact;

    if (lowerMsg.includes('dress')) return this.responses.products.dresses;
    if (lowerMsg.includes('skirt')) return this.responses.products.skirts;
    if (lowerMsg.includes('suit')) return this.responses.products.suits;
    if (lowerMsg.includes('makeup')) return this.responses.products.makeup;

    if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) return "Hi there! How can I assist you?";
    if (lowerMsg.includes('thank')) return "You're welcome! Happy shopping! 🛍️";

    return this.responses.products.default;
  }
}

// Initialize chatbot
document.addEventListener('DOMContentLoaded', () => {
  new Chatbot();
});
