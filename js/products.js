import Product from '../models/Product.js';
import { connectDB } from '../config/database.js';

// Default products data
const defaultProducts = [
    {
        name: 'Classic White T-Shirt',
        price: 29.99,
        description: 'A comfortable and stylish white t-shirt made from 100% organic cotton.',
        image: '../assets/images/products/tshirt-white.jpg',
        category: 'T-Shirts',
        stock: 50
    },
    {
        name: 'Blue Denim Jeans',
        price: 59.99,
        description: 'Classic blue denim jeans with a modern fit and comfortable stretch.',
        image: '../assets/images/products/jeans-blue.jpg',
        category: 'Jeans',
        stock: 30
    },
    {
        name: 'Black Leather Jacket',
        price: 199.99,
        description: 'Premium black leather jacket with a timeless design.',
        image: '../assets/images/products/jacket-black.jpg',
        category: 'Jackets',
        stock: 20
    }
];

// Initialize products in MongoDB if not already present
export async function initializeProducts() {
    try {
        await connectDB();
        const count = await Product.countDocuments();
        
        if (count === 0) {
            await Product.insertMany(defaultProducts);
            console.log('Default products initialized in MongoDB');
        }
        
        await renderProducts();
    } catch (error) {
        console.error('Error initializing products:', error);
    }
}

// Get all products
export async function getAllProducts() {
    try {
        return await Product.find().sort({ createdAt: -1 });
    } catch (error) {
        console.error('Error getting products:', error);
        return [];
    }
}

// Get product by ID
export async function getProductById(productId) {
    try {
        return await Product.findById(productId);
    } catch (error) {
        console.error('Error getting product:', error);
        return null;
    }
}

// Add new product
export async function addProduct(productData) {
    try {
        const product = new Product(productData);
        await product.save();
        await renderProducts();
        return product;
    } catch (error) {
        console.error('Error adding product:', error);
        throw error;
    }
}

// Update existing product
export async function updateProduct(productId, updatedData) {
    try {
        const product = await Product.findByIdAndUpdate(
            productId,
            updatedData,
            { new: true, runValidators: true }
        );
        await renderProducts();
        return product;
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
}

// Delete product
export async function deleteProduct(productId) {
    try {
        await Product.findByIdAndDelete(productId);
        await renderProducts();
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
}

// Render products to the page
async function renderProducts() {
    const productsContainer = document.querySelector('.products-grid');
    if (!productsContainer) return;

    try {
        const products = await getAllProducts();
        
        productsContainer.innerHTML = products.map(product => `
            <div class="product-card" data-product-id="${product._id}">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="price">$${product.price}</p>
                <div class="product-actions">
                    <button class="add-to-cart" data-product-id="${product._id}">Add to Cart</button>
                    <button class="quick-view" data-product-id="${product._id}">Quick View</button>
                    <button class="buy-now" data-product-id="${product._id}">Buy Now</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error rendering products:', error);
        productsContainer.innerHTML = '<p>Error loading products</p>';
    }
} 