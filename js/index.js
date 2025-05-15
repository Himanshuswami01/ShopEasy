import { productManager } from './admin/products.js';
import { initializeProducts } from './products.js';
import { addToCart, updateCartSummary } from './cart.js';

class IndexPage {
    constructor() {
        this.initialize();
    }

    async initialize() {
        await this.loadHeroSlider();
        await this.loadNewArrivals();
        await this.loadTrendingProducts();
        await this.loadSpecialOffers();
        this.setupEventListeners();
    }

    async loadHeroSlider() {
        const sliderContent = [
            {
                image: 'images/slider/slide1.jpg',
                title: 'Summer Collection',
                subtitle: 'Up to 50% off',
                link: 'pages/sale.html'
            },
            // Add more slider items
        ];

        const sliderContainer = document.querySelector('.hero-slider');
        if (!sliderContainer) return;

        sliderContainer.innerHTML = sliderContent.map(slide => `
            <div class="slider-item">
                <img src="${slide.image}" alt="${slide.title}">
                <div class="slider-content">
                    <h2>${slide.title}</h2>
                    <p>${slide.subtitle}</p>
                    <a href="${slide.link}" class="shop-now">Shop Now</a>
                </div>
            </div>
        `).join('');
    }

    async loadNewArrivals() {
        const products = await productManager.getNewArrivals();
        this.renderProducts(products, '#new-arrivals .product-grid');
    }

    async loadTrendingProducts() {
        const products = await productManager.getTrendingProducts();
        this.renderProducts(products, '.trending-section .product-grid');
    }

    async loadSpecialOffers() {
        const offers = await productManager.getSpecialOffers();
        const offersContainer = document.querySelector('.offers-grid');
        if (!offersContainer) return;

        offersContainer.innerHTML = offers.map(offer => `
            <div class="offer-card">
                <img src="${offer.image}" alt="${offer.title}">
                <div class="offer-content">
                    <h3>${offer.title}</h3>
                    <p>${offer.description}</p>
                    <span class="discount">${offer.discount}% OFF</span>
                    <a href="${offer.link}" class="shop-now">Shop Now</a>
                </div>
            </div>
        `).join('');
    }

    renderProducts(products, containerSelector) {
        const container = document.querySelector(containerSelector);
        if (!container) return;

        container.innerHTML = products.map(product => `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="product-overlay">
                        <button class="quick-view-btn" data-id="${product.id}">
                            <i class="fas fa-eye"></i>
                            Quick View
                        </button>
                        <button class="add-to-cart-btn" data-id="${product.id}">
                            <i class="fas fa-shopping-cart"></i>
                            Add to Cart
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <div class="product-meta">
                        <div class="product-rating">
                            ${this.createStarRating(product.rating || 4.5)}
                            <span>(${product.reviews || 0})</span>
                        </div>
                        <div class="product-price">
                            <span class="price">$${product.price}</span>
                            ${product.originalPrice ? `<span class="original-price">$${product.originalPrice}</span>` : ''}
                        </div>
                    </div>
                    ${product.colors ? `
                    <div class="product-colors">
                        ${product.colors.map(color => `
                            <span class="color-dot" style="background: ${color.hex};" title="${color.name}"></span>
                        `).join('')}
                    </div>
                    ` : ''}
                    <div class="product-buttons">
                        <button class="quick-view-btn" data-id="${product.id}">
                            <i class="fas fa-eye"></i>
                            Quick View
                        </button>
                        <button class="add-to-cart-btn" data-id="${product.id}">
                            <i class="fas fa-shopping-cart"></i>
                            Add to Cart
                        </button>
                        <button class="buy-now-btn" data-id="${product.id}">
                            <i class="fas fa-bolt"></i>
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    createStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let stars = '';
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }
        
        return stars;
    }

    setupEventListeners() {
        // Add to cart functionality
        document.addEventListener('click', (e) => {
            const addToCartBtn = e.target.closest('.add-to-cart-btn');
            const quickViewBtn = e.target.closest('.quick-view-btn');
            const buyNowBtn = e.target.closest('.buy-now-btn');

            if (addToCartBtn) {
                const productId = addToCartBtn.dataset.id;
                this.addToCart(productId);
            }

            if (quickViewBtn) {
                const productId = quickViewBtn.dataset.id;
                this.showQuickView(productId);
            }

            if (buyNowBtn) {
                const productId = buyNowBtn.dataset.id;
                this.buyNow(productId);
            }
        });
    }

    addToCart(productId) {
        // Get current cart from localStorage
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push(productId);
        
        // Save updated cart
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart count
        this.updateCartCount();
        
        // Show notification
        this.showNotification('Product added to cart!');
    }

    showQuickView(productId) {
        // Get product details
        const product = this.getProductById(productId);
        if (!product) return;

        // Create and show modal
        const modal = document.createElement('div');
        modal.className = 'quick-view-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <div class="product-details">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="product-info">
                        <h2>${product.name}</h2>
                        <p class="price">$${product.price}</p>
                        <p class="description">${product.description}</p>
                        <button class="add-to-cart" data-product-id="${product.id}">Add to Cart</button>
                    </div>
                </div>
            </div>
        `;

        // Add modal to page
        document.body.appendChild(modal);

        // Set up close button
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });

        // Set up add to cart button in modal
        modal.querySelector('.add-to-cart').addEventListener('click', () => {
            this.addToCart(productId);
            modal.remove();
        });
    }

    buyNow(productId) {
        // Add to cart first
        this.addToCart(productId);
        
        // Redirect to checkout
        window.location.href = 'pages/checkout.html';
    }

    updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = cart.length;
        }
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <p>${message}</p>
            </div>
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    getProductById(productId) {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        return products.find(product => product.id === productId);
    }
}

// Initialize the index page
const indexPage = new IndexPage();

// Helper functions
function showQuickViewModal(name, price) {
    // Implement modal display logic
    console.log(`Quick view: ${name} - ${price}`);
}

function addToCart(product) {
    // Implement cart logic
    console.log(`Added to cart: ${product.name}`);
    // Update cart count
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const currentCount = parseInt(cartCount.textContent);
        cartCount.textContent = currentCount + 1;
    }
    // Show success message
    showNotification('Product added to cart!');
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <p>${message}</p>
        </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize products
    initializeProducts();

    // Set up event listeners for product buttons
    setupProductButtons();

    // Update cart summary
    updateCartSummary();
});

// Function to set up product button event listeners
function setupProductButtons() {
    // Add to Cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = event.target.dataset.productId;
            addToCart(productId);
        });
    });

    // Buy Now buttons
    document.querySelectorAll('.buy-now').forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = event.target.dataset.productId;
            addToCart(productId);
            window.location.href = 'pages/checkout.html';
        });
    });

    // Quick View buttons
    document.querySelectorAll('.quick-view').forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = event.target.dataset.productId;
            showQuickView(productId);
        });
    });
}

// Function to show quick view modal
function showQuickView(productId) {
    // Get product details
    const product = indexPage.getProductById(productId);
    if (!product) return;

    // Create and show modal
    const modal = document.createElement('div');
    modal.className = 'quick-view-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div class="product-details">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-info">
                    <h2>${product.name}</h2>
                    <p class="price">$${product.price}</p>
                    <p class="description">${product.description}</p>
                    <button class="add-to-cart" data-product-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        </div>
    `;

    // Add modal to page
    document.body.appendChild(modal);

    // Set up close button
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });

    // Set up add to cart button in modal
    modal.querySelector('.add-to-cart').addEventListener('click', () => {
        indexPage.addToCart(productId);
        modal.remove();
    });
} 