export class ProductCard {
    constructor() {
        this.setupEventListeners();
    }

    render(product) {
        return `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="product-actions">
                        <button class="add-to-cart-btn" data-id="${product.id}">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                        <button class="buy-now-btn" data-id="${product.id}">
                            <i class="fas fa-bolt"></i> Buy Now
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="price">$${product.price.toFixed(2)}</p>
                    <div class="product-rating">
                        ${this.generateRatingStars(product.rating)}
                        <span>(${product.reviews} reviews)</span>
                    </div>
                </div>
            </div>
        `;
    }

    generateRatingStars(rating) {
        return `
            <div class="stars">
                ${Array(5).fill('').map((_, i) => `
                    <i class="fas fa-star${i < rating ? '' : '-o'}"></i>
                `).join('')}
            </div>
        `;
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            const addToCartBtn = e.target.closest('.add-to-cart-btn');
            const buyNowBtn = e.target.closest('.buy-now-btn');

            if (addToCartBtn) {
                const productId = addToCartBtn.dataset.id;
                this.handleAddToCart(productId);
            }

            if (buyNowBtn) {
                const productId = buyNowBtn.dataset.id;
                this.handleBuyNow(productId);
            }
        });
    }

    async handleAddToCart(productId) {
        try {
            const product = await this.fetchProductDetails(productId);
            cartManager.addToCart(product);
            this.showNotification('Product added to cart successfully!', 'success');
        } catch (error) {
            this.showNotification('Failed to add product to cart', 'error');
        }
    }

    async handleBuyNow(productId) {
        try {
            const product = await this.fetchProductDetails(productId);
            cartManager.addToCart(product);
            window.location.href = '/pages/checkout.html';
        } catch (error) {
            this.showNotification('Failed to process purchase', 'error');
        }
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <p>${message}</p>
            </div>
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }
} 