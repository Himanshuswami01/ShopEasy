class ProductManager {
    constructor() {
        this.products = [];
        this.categories = [];
        this.initialize();
    }

    async initialize() {
        await this.loadCategories();
        await this.loadProducts();
        this.setupEventListeners();
    }

    async loadCategories() {
        try {
            const response = await fetch('/api/categories');
            this.categories = await response.json();
            this.populateCategorySelects();
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }

    async loadProducts() {
        try {
            const response = await fetch('/api/products');
            this.products = await response.json();
            this.renderProducts();
        } catch (error) {
            console.error('Error loading products:', error);
        }
    }

    renderProducts() {
        const grid = document.querySelector('.product-grid');
        grid.innerHTML = this.products.map(product => `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image_url}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>$${product.price.toFixed(2)}</p>
                    <p>Stock: ${product.stock_quantity}</p>
                </div>
                <div class="product-actions">
                    <button class="action-btn edit-btn" data-id="${product.id}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="action-btn delete-btn" data-id="${product.id}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
    }

    setupEventListeners() {
        // Form submission
        document.getElementById('productForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleProductSubmit();
        });

        // Image upload preview
        document.getElementById('productImages').addEventListener('change', (e) => {
            this.handleImageUpload(e);
        });

        // Product actions (edit/delete)
        document.querySelector('.product-grid').addEventListener('click', (e) => {
            const editBtn = e.target.closest('.edit-btn');
            const deleteBtn = e.target.closest('.delete-btn');

            if (editBtn) {
                this.editProduct(editBtn.dataset.id);
            } else if (deleteBtn) {
                this.deleteProduct(deleteBtn.dataset.id);
            }
        });

        // Search and filters
        document.getElementById('productSearch').addEventListener('input', (e) => {
            this.filterProducts();
        });

        document.getElementById('categoryFilter').addEventListener('change', () => {
            this.filterProducts();
        });

        document.getElementById('statusFilter').addEventListener('change', () => {
            this.filterProducts();
        });
    }

    async handleProductSubmit() {
        const formData = new FormData(document.getElementById('productForm'));
        const productId = formData.get('productId');

        try {
            const response = await fetch(`/api/products${productId ? `/${productId}` : ''}`, {
                method: productId ? 'PUT' : 'POST',
                body: formData
            });

            if (response.ok) {
                await this.loadProducts();
                closeProductModal();
                showNotification('Product saved successfully!', 'success');
            } else {
                throw new Error('Failed to save product');
            }
        } catch (error) {
            console.error('Error saving product:', error);
            showNotification('Failed to save product', 'error');
        }
    }

    async deleteProduct(productId) {
        if (confirm('Are you sure you want to delete this product?')) {
            try {
                const response = await fetch(`/api/products/${productId}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    await this.loadProducts();
                    showNotification('Product deleted successfully!', 'success');
                } else {
                    throw new Error('Failed to delete product');
                }
            } catch (error) {
                console.error('Error deleting product:', error);
                showNotification('Failed to delete product', 'error');
            }
        }
    }

    async handleImageUpload(event) {
        const files = event.target.files;
        const preview = document.querySelector('.image-preview');
        preview.innerHTML = '';

        for (const file of files) {
            if (!file.type.startsWith('image/')) continue;

            const reader = new FileReader();
            reader.onload = (e) => {
                preview.innerHTML += `
                    <div class="preview-image">
                        <img src="${e.target.result}" alt="Preview">
                        <button type="button" class="remove-image" onclick="this.parentElement.remove()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;
            };
            reader.readAsDataURL(file);
        }
    }

    async editProduct(productId) {
        const product = this.products.find(p => p.id === parseInt(productId));
        if (!product) return;

        // Populate form fields
        document.getElementById('productName').value = product.name;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productStock').value = product.stock_quantity;
        document.getElementById('productCategory').value = product.category_id;
        document.getElementById('productDescription').value = product.description;

        // Add hidden input for product ID
        const idInput = document.createElement('input');
        idInput.type = 'hidden';
        idInput.name = 'productId';
        idInput.value = productId;
        document.getElementById('productForm').appendChild(idInput);

        // Show existing images
        const preview = document.querySelector('.image-preview');
        preview.innerHTML = product.images.map(image => `
            <div class="preview-image">
                <img src="${image.url}" alt="Product image">
                <button type="button" class="remove-image" data-image-id="${image.id}">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');

        openProductModal();
    }

    filterProducts() {
        const searchTerm = document.getElementById('productSearch').value.toLowerCase();
        const categoryFilter = document.getElementById('categoryFilter').value;
        const statusFilter = document.getElementById('statusFilter').value;

        const filteredProducts = this.products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                                product.description.toLowerCase().includes(searchTerm);
            const matchesCategory = !categoryFilter || product.category_id === parseInt(categoryFilter);
            const matchesStatus = !statusFilter || product.status === statusFilter;

            return matchesSearch && matchesCategory && matchesStatus;
        });

        this.renderProducts(filteredProducts);
    }

    populateCategorySelects() {
        const categorySelects = ['categoryFilter', 'productCategory'];
        
        categorySelects.forEach(selectId => {
            const select = document.getElementById(selectId);
            if (!select) return;

            select.innerHTML = `
                <option value="">Select Category</option>
                ${this.categories.map(category => `
                    <option value="${category.id}">${category.name}</option>
                `).join('')}
            `;
        });
    }
}

// Initialize the product manager
const productManager = new ProductManager(); 