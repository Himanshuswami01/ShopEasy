import { ProductList } from '../components/ProductList.js';

document.addEventListener('DOMContentLoaded', async () => {
    const productContainer = document.querySelector('.product-grid');
    const productList = new ProductList(productContainer);
    const categoryId = new URLSearchParams(window.location.search).get('id');

    try {
        const response = await fetch(`/api/products/category/${categoryId}`);
        const products = await response.json();
        productList.render(products);
    } catch (error) {
        console.error('Error loading products:', error);
    }
}); 