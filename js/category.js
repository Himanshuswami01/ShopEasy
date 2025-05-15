document.addEventListener('DOMContentLoaded', async () => {
    const currentPage = window.location.pathname.split('/').pop();
    const category = currentPage.replace('.html', '');
    
    // Update page title and breadcrumb
    updatePageContent(category);
    
    // Load category-specific filters
    loadCategoryFilters(category);
    
    // Load products
    await loadProducts(category);
    
    // Setup event listeners
    setupEventListeners();
});

function updatePageContent(category) {
    const pageTitle = document.querySelector('.products-header h1');
    const breadcrumbCurrent = document.querySelector('.breadcrumb .current');
    
    const titles = {
        mens: "Men's Fashion",
        womens: "Women's Fashion",
        kids: "Kids' Fashion",
        accessories: "Accessories",
        sale: "Sale",
        fashion: "Fashion Collection"
    };
    
    pageTitle.textContent = titles[category];
    breadcrumbCurrent.textContent = titles[category];
    document.title = `${titles[category]} - Fashion Store`;
}

async function loadProducts(category) {
    try {
        const response = await fetch(`/api/products?category=${category}`);
        const products = await response.json();
        
        const productsGrid = document.querySelector('.products-grid');
        productsGrid.innerHTML = products.map(product => `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="product-actions">
                        <button class="add-to-cart-btn" data-id="${product.id}">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                        <button class="wishlist-btn" data-id="${product.id}">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="price">$${product.price.toFixed(2)}</p>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

function initializeFilters() {
    // Price filter
    const priceFilter = document.querySelector('.price-inputs button');
    priceFilter.addEventListener('click', function() {
        const min = document.getElementById('price-min').value;
        const max = document.getElementById('price-max').value;
        filterByPrice(min, max);
    });

    // Brand filters
    const brandCheckboxes = document.querySelectorAll('input[name="brand"]');
    brandCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            filterByBrands();
        });
    });

    // Rating filters
    const ratingRadios = document.querySelectorAll('input[name="rating"]');
    ratingRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            filterByRating(this.value);
        });
    });

    // Sort options
    const sortSelect = document.getElementById('sort');
    sortSelect.addEventListener('change', function() {
        sortProducts(this.value);
    });
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

// Filter and sort functions to be implemented based on your needs
function filterByPrice(min, max) {
    console.log('Filtering by price:', min, max);
    // Implement price filtering
}

function filterByBrands() {
    const selectedBrands = Array.from(document.querySelectorAll('input[name="brand"]:checked'))
        .map(cb => cb.value);
    console.log('Filtering by brands:', selectedBrands);
    // Implement brand filtering
}

function filterByRating(minRating) {
    console.log('Filtering by rating:', minRating);
    // Implement rating filtering
}

function sortProducts(sortBy) {
    console.log('Sorting by:', sortBy);
    // Implement sorting
}

function setupEventListeners() {
    // Add event listeners for product actions
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        const addToCartBtn = card.querySelector('.add-to-cart-btn');
        const wishlistBtn = card.querySelector('.wishlist-btn');

        addToCartBtn.addEventListener('click', () => {
            const productId = addToCartBtn.getAttribute('data-id');
            addToCart(productId);
        });

        wishlistBtn.addEventListener('click', () => {
            const productId = wishlistBtn.getAttribute('data-id');
            addToWishlist(productId);
        });
    });
}

function addToCart(productId) {
    console.log('Adding to cart:', productId);
    // Implement adding to cart
}

function addToWishlist(productId) {
    console.log('Adding to wishlist:', productId);
    // Implement adding to wishlist
}

function loadCategoryFilters(category) {
    // Implement loading category-specific filters
} 