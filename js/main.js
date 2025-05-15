document.addEventListener('DOMContentLoaded', function() {
    // Load featured products
    loadFeaturedProducts();
    
    // Initialize cart count
    updateCartCount();
});

function loadFeaturedProducts() {
    // Simulated product data
    const products = [
        {
            id: 1,
            name: "Wireless Headphones",
            price: 99.99,
            image: "images/products/headphones.jpg",
            rating: 4.5
        },
        {
            id: 2,
            name: "Smartphone",
            price: 599.99,
            image: "images/products/smartphone.jpg",
            rating: 4.8
        },
        // Add more products
    ];

    const productGrid = document.querySelector('.product-grid');
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        productGrid.appendChild(productCard);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <div class="product-rating">
            ${createStarRating(product.rating)}
        </div>
        <div class="product-price">$${product.price}</div>
        <button onclick="addToCart(${product.id})" class="add-to-cart">
            Add to Cart
        </button>
    `;
    
    return card;
}

function createStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    return stars;
}

function addToCart(productId) {
    // Get current cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(productId);
    
    // Save updated cart
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Show confirmation
    alert('Product added to cart!');
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = document.querySelector('.cart-count');
    cartCount.textContent = cart.length;
} 