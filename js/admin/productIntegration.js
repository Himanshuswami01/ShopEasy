import { productManager } from './products.js';
import { inventoryManager } from './inventory.js';
import { analyticsDashboard } from './analytics.js';

class ProductIntegration {
    constructor() {
        this.initialize();
    }

    async initialize() {
        // Link inventory with products
        await this.syncInventoryWithProducts();
        
        // Setup event listeners for cross-feature updates
        this.setupIntegrationListeners();
    }

    async syncInventoryWithProducts() {
        const products = await productManager.loadProducts();
        const inventory = products.map(product => ({
            id: product.id,
            name: product.name,
            sku: `SKU-${product.id}`,
            stock: product.stock || 0,
            reorderPoint: product.reorderPoint || 10,
            image: product.image,
            history: []
        }));

        localStorage.setItem('inventory', JSON.stringify(inventory));
        inventoryManager.loadInventory();
    }

    setupIntegrationListeners() {
        // Update inventory when product is updated
        document.addEventListener('productUpdated', (e) => {
            this.handleProductUpdate(e.detail);
        });

        // Update analytics when inventory changes
        document.addEventListener('inventoryChanged', (e) => {
            this.handleInventoryChange(e.detail);
        });
    }

    handleProductUpdate(product) {
        // Update inventory when product changes
        inventoryManager.updateProductStock(product.id, product.stock);
        
        // Update analytics
        analyticsDashboard.refreshData();
    }

    handleInventoryChange(inventory) {
        // Update product stock levels
        productManager.updateProductStock(inventory.id, inventory.stock);
        
        // Update analytics
        analyticsDashboard.refreshData();
    }
}

export const productIntegration = new ProductIntegration(); 