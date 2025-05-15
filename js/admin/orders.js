class OrderManager {
    constructor() {
        this.orders = [];
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.initialize();
    }

    async initialize() {
        await this.loadOrders();
        this.setupEventListeners();
    }

    async loadOrders() {
        try {
            const response = await fetch('/api/orders');
            this.orders = await response.json();
            this.renderOrders();
            this.renderPagination();
        } catch (error) {
            console.error('Error loading orders:', error);
            showNotification('Failed to load orders', 'error');
        }
    }

    renderOrders(filteredOrders = null) {
        const orders = filteredOrders || this.orders;
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageOrders = orders.slice(startIndex, endIndex);

        const tbody = document.querySelector('.orders-table tbody');
        tbody.innerHTML = pageOrders.map(order => `
            <tr>
                <td>#${order.order_number}</td>
                <td>
                    <div class="customer-info">
                        <div>${order.customer_name}</div>
                        <small>${order.customer_email}</small>
                    </div>
                </td>
                <td>${new Date(order.created_at).toLocaleDateString()}</td>
                <td>$${order.total_amount.toFixed(2)}</td>
                <td>
                    <span class="status-badge ${order.status.toLowerCase()}">
                        ${order.status}
                    </span>
                </td>
                <td>
                    <span class="payment-status ${order.payment_status.toLowerCase()}">
                        ${order.payment_status}
                    </span>
                </td>
                <td>
                    <div class="order-actions">
                        <button class="action-btn view-btn" onclick="orderManager.viewOrder('${order.id}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn update-btn" onclick="orderManager.updateStatus('${order.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    async viewOrder(orderId) {
        try {
            const response = await fetch(`/api/orders/${orderId}`);
            const order = await response.json();
            
            const modal = document.getElementById('orderModal');
            modal.querySelector('.order-details').innerHTML = `
                <div class="order-section">
                    <h2>Order #${order.order_number}</h2>
                    <p>Date: ${new Date(order.created_at).toLocaleString()}</p>
                    <p>Status: <span class="status-badge ${order.status.toLowerCase()}">${order.status}</span></p>
                </div>

                <div class="order-section">
                    <h3>Customer Details</h3>
                    <p>${order.customer_name}</p>
                    <p>${order.customer_email}</p>
                    <p>${order.customer_phone}</p>
                </div>

                <div class="order-section">
                    <h3>Shipping Address</h3>
                    <p>${order.shipping_address}</p>
                </div>

                <div class="order-section">
                    <h3>Order Items</h3>
                    <table class="order-items">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${order.items.map(item => `
                                <tr>
                                    <td>${item.name}</td>
                                    <td>${item.quantity}</td>
                                    <td>$${item.price.toFixed(2)}</td>
                                    <td>$${(item.price * item.quantity).toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="3">Subtotal</td>
                                <td>$${order.subtotal.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td colspan="3">Shipping</td>
                                <td>$${order.shipping_amount.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td colspan="3"><strong>Total</strong></td>
                                <td><strong>$${order.total_amount.toFixed(2)}</strong></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <div class="order-section">
                    <h3>Order Timeline</h3>
                    <div class="order-timeline">
                        ${order.timeline.map(event => `
                            <div class="timeline-item">
                                <div class="timeline-date">${new Date(event.date).toLocaleString()}</div>
                                <div class="timeline-status">${event.status}</div>
                                <div class="timeline-note">${event.note}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            
            modal.style.display = 'block';
        } catch (error) {
            console.error('Error loading order details:', error);
            showNotification('Failed to load order details', 'error');
        }
    }

    async updateStatus(orderId) {
        const newStatus = prompt('Enter new status (pending/processing/shipped/delivered/cancelled):');
        if (!newStatus) return;

        try {
            const response = await fetch(`/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                await this.loadOrders();
                showNotification('Order status updated successfully!', 'success');
            } else {
                throw new Error('Failed to update order status');
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            showNotification('Failed to update order status', 'error');
        }
    }

    exportOrders() {
        const csv = this.generateCSV();
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    generateCSV() {
        const headers = ['Order ID', 'Customer', 'Date', 'Total', 'Status', 'Payment Status'];
        const rows = this.orders.map(order => [
            order.order_number,
            order.customer_name,
            new Date(order.created_at).toLocaleDateString(),
            order.total_amount,
            order.status,
            order.payment_status
        ]);

        return [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');
    }

    setupEventListeners() {
        // Search and filters
        document.getElementById('orderSearch').addEventListener('input', () => this.filterOrders());
        document.getElementById('statusFilter').addEventListener('change', () => this.filterOrders());
        document.getElementById('dateFilter').addEventListener('change', () => this.filterOrders());

        // Modal close button
        document.querySelector('.modal .close').addEventListener('click', () => {
            document.getElementById('orderModal').style.display = 'none';
        });
    }

    filterOrders() {
        const searchTerm = document.getElementById('orderSearch').value.toLowerCase();
        const statusFilter = document.getElementById('statusFilter').value;
        const dateFilter = document.getElementById('dateFilter').value;

        const filteredOrders = this.orders.filter(order => {
            const matchesSearch = order.order_number.toLowerCase().includes(searchTerm) ||
                                order.customer_name.toLowerCase().includes(searchTerm);
            const matchesStatus = !statusFilter || order.status.toLowerCase() === statusFilter.toLowerCase();
            const matchesDate = !dateFilter || order.created_at.startsWith(dateFilter);

            return matchesSearch && matchesStatus && matchesDate;
        });

        this.renderOrders(filteredOrders);
        this.renderPagination(filteredOrders.length);
    }
}

// Initialize the order manager
const orderManager = new OrderManager(); 