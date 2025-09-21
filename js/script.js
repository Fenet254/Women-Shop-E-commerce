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
