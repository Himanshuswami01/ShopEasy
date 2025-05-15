class ProductManager {
    constructor() {
        this.products = [];
        this.categories = [];
        this.currentProduct = null;
        this.initialize();
    }

    async initialize() {
        await this.loadProducts();
        await this.loadCategories();
        this.setupEventListeners();
    }

    async loadCategories() {
        try {
            // Load website categories
            const response = await fetch('/api/website/categories');
            this.categories = await response.json();
            
            // Update both product form and filter dropdowns
            this.updateCategoryDropdowns();
        } catch (error) {
            console.error('Error loading categories:', error);
            this.showNotification('Error loading categories', 'error');
        }
    }

    updateCategoryDropdowns() {
        // Update product form category dropdown
        const categorySelect = document.getElementById('productCategory');
        const filterSelect = document.getElementById('categoryFilter');
        
        const options = this.categories.map(category => `
            <option value="${category.id}" data-slug="${category.slug}">
                ${category.name}
            </option>
        `).join('');

        // Update product form dropdown
        categorySelect.innerHTML = `
            <option value="">Select Category</option>
            ${options}
            <option value="add_new">+ Add New Category</option>
        `;

        // Update filter dropdown
        filterSelect.innerHTML = `
            <option value="">All Categories</option>
            ${options}
        `;
    }

    async loadProducts() {
        try {
            const response = await fetch('/api/admin/products');
            this.products = await response.json();
            this.renderProducts();
        } catch (error) {
            console.error('Error loading products:', error);
            this.showNotification('Error loading products', 'error');
        }
    }

    renderProducts() {
        const grid = document.querySelector('.product-grid');
        if (!this.products.length) {
            grid.innerHTML = `
                <div class="no-products">
                    <i class="fas fa-box-open"></i>
                    <p>No products found</p>
                    <button onclick="productManager.openAddProductModal()" class="add-product-btn">
                        Add First Product
                    </button>
                </div>
            `;
            return;
        }

        grid.innerHTML = this.products.map(product => `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.images?.[0] || '../../images/placeholder.png'}" 
                         alt="${product.name}"
                         onerror="this.src='../../images/placeholder.png'">
                    <div class="product-actions">
                        <button onclick="productManager.editProduct(${product.id})" class="edit-btn" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="productManager.duplicateProduct(${product.id})" class="duplicate-btn" title="Duplicate">
                            <i class="fas fa-copy"></i>
                        </button>
                        <button onclick="productManager.deleteProduct(${product.id})" class="delete-btn" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <div class="product-meta">
                        <span class="price">${this.formatPrice(product.price)}</span>
                        <span class="stock ${product.stock <= 10 ? 'low-stock' : ''}">
                            Stock: ${product.stock}
                        </span>
                    </div>
                    <div class="product-status">
                        <span class="status-badge ${product.status.toLowerCase()}">
                            ${product.status}
                        </span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    setupEventListeners() {
        // Fix the Add New Product button click handler
        const addButton = document.querySelector('.add-product-btn');
        if (addButton) {
            addButton.onclick = (e) => {
                e.preventDefault();
                this.openAddProductModal();
            };
        }

        // Form submission
        const form = document.getElementById('productForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit(e.target);
            });
        }

        // Close modal buttons
        const closeBtn = document.querySelector('.modal .close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }

        // Add specification button
        const addSpecBtn = document.querySelector('.add-spec-btn');
        if (addSpecBtn) {
            addSpecBtn.addEventListener('click', () => this.addSpecRow());
        }

        // Image upload
        const imageInput = document.getElementById('productImages');
        if (imageInput) {
            imageInput.addEventListener('change', (e) => this.handleImageUpload(e));
        }

        // Auto-generate slug from product name
        const productName = document.getElementById('productName');
        if (productName) {
            productName.addEventListener('input', (e) => {
                const slug = e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, '');
                document.getElementById('productSlug').value = slug;
            });
        }

        // Close modal when clicking outside
        window.onclick = (event) => {
            const modal = document.getElementById('productModal');
            if (event.target === modal) {
                this.closeModal();
            }
        };
    }

    openAddProductModal() {
        const modal = document.getElementById('productModal');
        const form = document.getElementById('productForm');
        
        form.reset();
        document.querySelector('#productModal h2').textContent = 'Add New Product';
        document.querySelector('.image-preview').innerHTML = '';
        document.getElementById('specsContainer').innerHTML = this.getDefaultSpecRow();
        
        // Generate SKU and Barcode when product name is entered
        document.getElementById('productName').addEventListener('input', (e) => {
            this.generateProductCodes(e.target.value);
        });

        modal.style.display = 'block';
    }

    async handleFormSubmit(form) {
        try {
            const formData = new FormData(form);
            
            // Get selected category details
            const categorySelect = document.getElementById('productCategory');
            const selectedOption = categorySelect.options[categorySelect.selectedIndex];
            const categorySlug = selectedOption.dataset.slug;

            // Create product data
            const productData = {
                name: formData.get('productName'),
                slug: formData.get('productSlug'),
                price: parseFloat(formData.get('productPrice')),
                salePrice: parseFloat(formData.get('productSalePrice')) || null,
                stock: parseInt(formData.get('productStock')),
                sku: formData.get('productSKU'),
                barcode: formData.get('productBarcode'),
                categoryId: formData.get('productCategory'),
                categorySlug: categorySlug,
                tags: formData.get('productTags').split(',').map(tag => tag.trim()),
                description: formData.get('productDescription'),
                specifications: this.getSpecifications(),
                status: formData.get('productStatus'),
                images: await this.handleImageUpload(formData.getAll('productImages'))
            };

            // Save to both admin and website APIs
            await this.saveProductToAdmin(productData);
            await this.saveProductToWebsite(productData);

            this.showNotification('Product added successfully');
            this.closeModal();
            await this.loadProducts();
        } catch (error) {
            console.error('Error saving product:', error);
            this.showNotification('Error saving product', 'error');
        }
    }

    async saveProductToAdmin(productData) {
        const response = await fetch('/api/admin/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
        });

        if (!response.ok) throw new Error('Failed to save product to admin');
        return await response.json();
    }

    async saveProductToWebsite(productData) {
        // Prepare data for website display
        const websiteData = {
            ...productData,
            url: `/products/${productData.categorySlug}/${productData.slug}`,
            isNew: true,
            rating: 0,
            reviewCount: 0
        };

        const response = await fetch('/api/website/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(websiteData)
        });

        if (!response.ok) throw new Error('Failed to save product to website');
        return await response.json();
    }

    async handleImageUpload(files) {
        const imageUrls = [];
        for (const file of files) {
            const formData = new FormData();
            formData.append('image', file);

            try {
                const response = await fetch('/api/upload/image', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) throw new Error('Failed to upload image');
                
                const data = await response.json();
                imageUrls.push(data.url);
            } catch (error) {
                console.error('Error uploading image:', error);
                this.showNotification('Error uploading image', 'error');
            }
        }
        return imageUrls;
    }

    getSpecifications() {
        const specs = [];
        document.querySelectorAll('.spec-row').forEach(row => {
            const name = row.querySelector('.spec-name').value;
            const value = row.querySelector('.spec-value').value;
            if (name && value) {
                specs.push({ name, value });
            }
        });
        return specs;
    }

    handleImageUpload(event) {
        const files = event.target.files;
        const preview = document.querySelector('.image-preview');
        preview.innerHTML = '';

        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                preview.innerHTML += `
                    <div class="preview-image">
                        <img src="${e.target.result}" alt="Product preview">
                        <button type="button" class="remove-image" onclick="productManager.removeImage(this)">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;
            };
            reader.readAsDataURL(file);
        });
    }

    removeImage(button) {
        button.closest('.preview-image').remove();
    }

    closeModal() {
        const modal = document.getElementById('productModal');
        modal.style.display = 'none';
    }

    showNotification(message, type = 'success') {
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

    // Helper methods
    formatPrice(price) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    }

    getDefaultSpecRow() {
        return `
            <div class="spec-row">
                <input type="text" placeholder="Specification name" class="spec-name">
                <input type="text" placeholder="Specification value" class="spec-value">
                <button type="button" class="remove-spec" onclick="productManager.removeSpecRow(this)">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    }

    // Add other helper methods as needed

    // Add this new method for category management
    async addNewCategory(categoryName) {
        try {
            const response = await fetch('/api/admin/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: categoryName })
            });

            if (!response.ok) throw new Error('Failed to add category');

            await this.loadCategories(); // Reload categories
            this.showNotification('Category added successfully');
            return true;
        } catch (error) {
            console.error('Error adding category:', error);
            this.showNotification('Error adding category', 'error');
            return false;
        }
    }

    showAddCategoryPrompt() {
        const categoryName = prompt('Enter new category name:');
        if (categoryName) {
            this.addNewCategory(categoryName).then(success => {
                if (success) {
                    const categorySelect = document.getElementById('productCategory');
                    // Select the newly added category (it will be the last one)
                    categorySelect.selectedIndex = categorySelect.options.length - 2;
                } else {
                    categorySelect.value = ''; // Reset to default if failed
                }
            });
        } else {
            document.getElementById('productCategory').value = ''; // Reset if cancelled
        }
    }

    // Add method for generating SKU and Barcode
    generateProductCodes(productName) {
        if (!productName) return;

        // Generate SKU: First letters of each word + timestamp
        const sku = productName
            .split(' ')
            .map(word => word.charAt(0).toUpperCase())
            .join('') + Date.now().toString().slice(-4);
        
        // Generate Barcode: Current timestamp + random number
        const barcode = Date.now().toString().slice(-8) + 
                       Math.floor(Math.random() * 1000).toString().padStart(3, '0');

        document.getElementById('productSKU').value = sku;
        document.getElementById('productBarcode').value = barcode;
    }

    // Add method to check if product should be displayed on website
    shouldDisplayOnWebsite(product) {
        return product.status === 'active' && product.stock > 0;
    }

    // Add method to update website display
    async updateWebsiteDisplay(productId, shouldDisplay) {
        try {
            const response = await fetch(`/api/website/products/${productId}/display`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ display: shouldDisplay })
            });

            if (!response.ok) throw new Error('Failed to update website display');
        } catch (error) {
            console.error('Error updating website display:', error);
            this.showNotification('Error updating website display', 'error');
        }
    }
}

// Initialize the product manager
const productManager = new ProductManager();

function getSpecifications() {
    const specs = [];
    document.querySelectorAll('.spec-row').forEach(row => {
        const name = row.querySelector('.spec-name').value;
        const value = row.querySelector('.spec-value').value;
        if (name && value) {
            specs.push({ name, value });
        }
    });
    return specs;
}

function showNotification(message, type = 'success') {
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