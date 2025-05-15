export class BuyButton {
    constructor() {
        this.setupEventListeners();
    }

    render(product, variant = null) {
        const isAvailable = this.checkAvailability(product, variant);
        const buttonClass = isAvailable ? 'buy-button' : 'buy-button disabled';
        
        return `
            <div class="product-actions" data-product-id="${product.id}">
                <button class="add-to-cart-btn" ${!isAvailable ? 'disabled' : ''}>
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
                <button class="${buttonClass}" ${!isAvailable ? 'disabled' : ''}>
                    <i class="fas fa-bolt"></i> Buy Now
                </button>
                <button class="wishlist-btn">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
        `;
    }

    checkAvailability(product, variant) {
        if (variant) {
            return variant.stock_quantity > 0;
        }
        return product.stock_quantity > 0;
    }

    setupEventListeners() {
        document.addEventListener('click', async (e) => {
            const buyBtn = e.target.closest('.buy-button');
            const addToCartBtn = e.target.closest('.add-to-cart-btn');
            const wishlistBtn = e.target.closest('.wishlist-btn');

            if (buyBtn && !buyBtn.disabled) {
                const productId = buyBtn.closest('[data-product-id]').dataset.productId;
                await this.handleBuyNow(productId);
            }

            if (addToCartBtn && !addToCartBtn.disabled) {
                const productId = addToCartBtn.closest('[data-product-id]').dataset.productId;
                await this.handleAddToCart(productId);
            }

            if (wishlistBtn) {
                const productId = wishlistBtn.closest('[data-product-id]').dataset.productId;
                await this.handleAddToWishlist(productId);
            }
        });
    }

    async handleBuyNow(productId) {
        try {
            // Add to cart first
            await this.handleAddToCart(productId);
            // Redirect to checkout
            window.location.href = '/pages/checkout.html';
        } catch (error) {
            this.showNotification('Failed to process purchase', 'error');
        }
    }

    async handleAddToCart(productId) {
        try {
            const cart = await cartManager.getOrCreate();
            await cartManager.addItem(cart.cart_id, productId, 1);
            this.showNotification('Product added to cart!', 'success');
            this.updateCartCount();
        } catch (error) {
            this.showNotification('Failed to add to cart', 'error');
        }
    }

    async handleAddToWishlist(productId) {
        try {
            const userId = this.getCurrentUserId();
            if (!userId) {
                window.location.href = '/pages/login.html';
                return;
            }
            await wishlistManager.addItem(userId, productId);
            this.showNotification('Added to wishlist!', 'success');
        } catch (error) {
            this.showNotification('Failed to add to wishlist', 'error');
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

    updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const count = parseInt(cartCount.textContent || '0') + 1;
            cartCount.textContent = count;
        }
    }

    getCurrentUserId() {
        // Get user ID from session/localStorage
        return localStorage.getItem('userId');
    }
} 