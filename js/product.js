document.addEventListener('DOMContentLoaded', function() {
    initializeProductPage();
    loadReviews();
});

function initializeProductPage() {
    // Handle thumbnail clicks
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('main-product-image');

    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            mainImage.src = this.src.replace('thumbnail', 'product-large');
            thumbnails.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Handle add to cart button
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    addToCartBtn.addEventListener('click', function() {
        const quantity = parseInt(document.getElementById('quantity').value);
        const productId = getProductIdFromUrl(); // Implement this based on your URL structure
        
        for(let i = 0; i < quantity; i++) {
            addToCart(productId);
        }
        
        // Show confirmation
        showAddToCartConfirmation(quantity);
    });

    // Handle buy now button
    const buyNowBtn = document.querySelector('.buy-now-btn');
    buyNowBtn.addEventListener('click', function() {
        window.location.href = '../pages/checkout.html';
    });
}

function loadReviews() {
    const reviewsContainer = document.querySelector('.reviews-container');
    
    // Simulated reviews data
    const reviews = [
        {
            user: "John D.",
            rating: 5,
            date: "March 15, 2024",
            title: "Great product!",
            content: "This product exceeded my expectations. Would definitely recommend!"
        },
        {
            user: "Sarah M.",
            rating: 4,
            date: "March 10, 2024",
            title: "Good value",
            content: "Good quality for the price. Fast shipping too."
        }
        // Add more reviews
    ];

    reviewsContainer.innerHTML = reviews.map(review => `
        <div class="review">
            <div class="review-header">
                <div class="review-user">${review.user}</div>
                <div class="review-rating">
                    ${createStarRating(review.rating)}
                </div>
                <div class="review-date">${review.date}</div>
            </div>
            <h3 class="review-title">${review.title}</h3>
            <p class="review-content">${review.content}</p>
        </div>
    `).join('');
}

function createStarRating(rating) {
    let stars = '';
    for(let i = 1; i <= 5; i++) {
        if(i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else if(i - 0.5 <= rating) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

function showAddToCartConfirmation(quantity) {
    alert(`${quantity} item(s) added to cart!`);
    updateCartCount();
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
} 