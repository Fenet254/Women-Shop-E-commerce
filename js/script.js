// Example "data" (simulating a database)
const products = [
  {
    name: "Summer Dress 2025",
    price: 49.99,
    description: "Elegant dress for summer evenings.",
    videoUrl: "videos/summer-dress.mp4", // place your video inside /videos folder
  },
  {
    name: "Luxury Handbag",
    price: 79.99,
    description: "Trendy handbag for every occasion.",
    videoUrl: "videos/handbag.mp4",
  },
  {
    name: "Human Hair Wig",
    price: 120.0,
    description: "High-quality human hair wig.",
    videoUrl: "videos/human-hair.mp4",
  },
];

// Load products dynamically
const grid = document.getElementById("productGrid");
products.forEach((product) => {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
        <div class="title">${product.name}</div>
        <video controls autoplay loop muted>
          <source src="${product.videoUrl}" type="video/mp4">
          Your browser does not support the video tag.
        </video>
        <p>${product.description}</p>
        <p class="price">$${product.price}</p>
      `;
  grid.appendChild(card);
});
