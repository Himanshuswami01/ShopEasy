class InventoryManager {
    constructor() {
        this.inventory = [];
        this.initialize();
    }

    async initialize() {
        await this.loadInventory();
        this.setupEventListeners();
        this.checkLowStock();
    }

    async loadInventory() {
        // In a real app, this would be an API call
        this.inventory = JSON.parse(localStorage.getItem('inventory')) || [];
        this.renderInventory();
    }

    renderInventory() {
        const inventoryTable = document.querySelector('.inventory-table tbody');
        if (!inventoryTable) return;

        inventoryTable.innerHTML = this.inventory.map(item => `
            <tr class="${this.getStockLevelClass(item.stock)}">
                <td>${item.id}</td>
                <td>
                    <img src="${item.image}" alt="${item.name}" width="50">
                    ${item.name}
                </td>
                <td>${item.sku}</td>
                <td>${item.stock}</td>
                <td>${item.reorderPoint}</td>
                <td>
                    <div class="inventory-actions">
                        <button class="action-btn adjust-btn" data-id="${item.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn history-btn" data-id="${item.id}">
                            <i class="fas fa-history"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    getStockLevelClass(stock) {
        if (stock <= 0) return 'out-of-stock';
        if (stock < 10) return 'low-stock';
        return '';
    }

    showAdjustmentModal(itemId) {
        const item = this.inventory.find(i => i.id === parseInt(itemId));
        if (!item) return;

        const modal = document.createElement('div');
        modal.className = 'admin-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Adjust Inventory</h2>
                    <button class="close-modal">&times;</button>
                </div>
                <form class="adjustment-form">
                    <div class="form-group">
                        <label>Current Stock: ${item.stock}</label>
                    </div>
                    <div class="form-group">
                        <label for="adjustmentType">Adjustment Type</label>
                        <select id="adjustmentType" required>
                            <option value="add">Add Stock</option>
                            <option value="remove">Remove Stock</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="quantity">Quantity</label>
                        <input type="number" id="quantity" min="1" required>
                    </div>
                    <div class="form-group">
                        <label for="reason">Reason</label>
                        <select id="reason" required>
                            <option value="restock">Restock</option>
                            <option value="damage">Damaged Goods</option>
                            <option value="correction">Inventory Correction</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="notes">Notes</label>
                        <textarea id="notes" rows="3"></textarea>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="save-btn">Save Adjustment</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);
        this.setupModalListeners(modal, item);
    }

    showHistoryModal(itemId) {
        const item = this.inventory.find(i => i.id === parseInt(itemId));
        if (!item) return;

        const modal = document.createElement('div');
        modal.className = 'admin-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Inventory History</h2>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="history-content">
                    <h3>${item.name}</h3>
                    <table class="history-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Quantity</th>
                                <th>Reason</th>
                                <th>Stock After</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.renderInventoryHistory(item.history)}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.setupModalListeners(modal);
    }

    renderInventoryHistory(history) {
        return history.map(record => `
            <tr>
                <td>${new Date(record.date).toLocaleDateString()}</td>
                <td>${record.type}</td>
                <td class="${record.type === 'add' ? 'positive' : 'negative'}">
                    ${record.type === 'add' ? '+' : '-'}${record.quantity}
                </td>
                <td>${record.reason}</td>
                <td>${record.stockAfter}</td>
            </tr>
        `).join('');
    }

    adjustInventory(itemId, adjustment) {
        const item = this.inventory.find(i => i.id === parseInt(itemId));
        if (!item) return;

        const quantity = parseInt(adjustment.quantity);
        const newStock = adjustment.type === 'add' 
            ? item.stock + quantity 
            : item.stock - quantity;

        item.stock = newStock;
        item.history = item.history || [];
        item.history.unshift({
            date: new Date().toISOString(),
            type: adjustment.type,
            quantity: quantity,
            reason: adjustment.reason,
            notes: adjustment.notes,
            stockAfter: newStock
        });

        localStorage.setItem('inventory', JSON.stringify(this.inventory));
        this.renderInventory();
        this.checkLowStock();
    }

    checkLowStock() {
        const lowStockItems = this.inventory.filter(
            item => item.stock <= item.reorderPoint
        );

        if (lowStockItems.length > 0) {
            this.showLowStockAlert(lowStockItems);
        }
    }

    showLowStockAlert(items) {
        const alert = document.createElement('div');
        alert.className = 'low-stock-alert';
        alert.innerHTML = `
            <h3>Low Stock Alert</h3>
            <p>${items.length} items need reordering:</p>
            <ul>
                ${items.map(item => `
                    <li>${item.name} (${item.stock} remaining)</li>
                `).join('')}
            </ul>
            <button class="close-alert">&times;</button>
        `;

        document.body.appendChild(alert);
        alert.querySelector('.close-alert').addEventListener('click', () => {
            alert.remove();
        });
    }
}

export const inventoryManager = new InventoryManager(); 