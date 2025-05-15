class AnalyticsDashboard {
    constructor() {
        this.charts = {};
        this.initialize();
    }

    async initialize() {
        await this.loadData();
        this.setupCharts();
        this.setupEventListeners();
        this.setupTimePeriodFilters();
    }

    async loadData() {
        try {
            const response = await fetch('/api/analytics/dashboard');
            const data = await response.json();
            this.updateMetrics(data);
            this.updateTables(data);
            return data;
        } catch (error) {
            console.error('Error loading analytics data:', error);
        }
    }

    setupCharts() {
        // Sales Chart
        this.charts.sales = new Chart(document.getElementById('salesChart'), {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Sales',
                    data: [],
                    borderColor: '#2196f3',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });

        // Products Chart
        this.charts.products = new Chart(document.getElementById('productsChart'), {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Sales',
                    data: [],
                    backgroundColor: '#4caf50'
                }]
            }
        });

        // Demographics Chart
        this.charts.demographics = new Chart(document.getElementById('demographicsChart'), {
            type: 'doughnut',
            data: {
                labels: ['18-24', '25-34', '35-44', '45-54', '55+'],
                datasets: [{
                    data: [],
                    backgroundColor: [
                        '#2196f3',
                        '#4caf50',
                        '#ff9800',
                        '#9c27b0',
                        '#f44336'
                    ]
                }]
            }
        });

        // Traffic Sources Chart
        this.charts.traffic = new Chart(document.getElementById('trafficChart'), {
            type: 'pie',
            data: {
                labels: ['Direct', 'Organic', 'Social', 'Referral'],
                datasets: [{
                    data: [],
                    backgroundColor: [
                        '#2196f3',
                        '#4caf50',
                        '#ff9800',
                        '#9c27b0'
                    ]
                }]
            }
        });
    }

    updateMetrics(data) {
        document.getElementById('totalSales').textContent = `$${data.totalSales.toLocaleString()}`;
        document.getElementById('totalOrders').textContent = data.totalOrders.toLocaleString();
        document.getElementById('newUsers').textContent = data.newUsers.toLocaleString();
        document.getElementById('conversionRate').textContent = `${data.conversionRate}%`;

        // Update change percentages
        this.updateChangeMetric('salesChange', data.salesChange);
        this.updateChangeMetric('ordersChange', data.ordersChange);
        this.updateChangeMetric('usersChange', data.usersChange);
        this.updateChangeMetric('conversionChange', data.conversionChange);
    }

    updateChangeMetric(elementId, value) {
        const element = document.getElementById(elementId);
        element.textContent = `${value >= 0 ? '+' : ''}${value}%`;
        element.className = `metric-change ${value >= 0 ? 'positive' : 'negative'}`;
    }

    updateTables(data) {
        // Update Recent Orders Table
        const recentOrdersTable = document.getElementById('recentOrdersTable');
        recentOrdersTable.innerHTML = `
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${data.recentOrders.map(order => `
                    <tr>
                        <td>#${order.id}</td>
                        <td>${order.customer}</td>
                        <td>$${order.amount}</td>
                        <td>
                            <span class="status-badge ${order.status.toLowerCase()}">
                                ${order.status}
                            </span>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        `;

        // Update Top Customers Table
        const topCustomersTable = document.getElementById('topCustomersTable');
        topCustomersTable.innerHTML = `
            <thead>
                <tr>
                    <th>Customer</th>
                    <th>Orders</th>
                    <th>Total Spent</th>
                </tr>
            </thead>
            <tbody>
                ${data.topCustomers.map(customer => `
                    <tr>
                        <td>${customer.name}</td>
                        <td>${customer.orders}</td>
                        <td>$${customer.totalSpent}</td>
                    </tr>
                `).join('')}
            </tbody>
        `;
    }

    setupEventListeners() {
        document.querySelector('.apply-btn').addEventListener('click', () => {
            const startDate = document.getElementById('startDate').value;
            const endDate = document.getElementById('endDate').value;
            this.updateDateRange(startDate, endDate);
        });
    }

    async updateDateRange(startDate, endDate) {
        try {
            const response = await fetch(`/api/analytics/dashboard?start=${startDate}&end=${endDate}`);
            const data = await response.json();
            this.updateMetrics(data);
            this.updateCharts(data);
            this.updateTables(data);
        } catch (error) {
            console.error('Error updating analytics:', error);
        }
    }

    updateCharts(data) {
        // Update each chart with new data
        this.charts.sales.data.labels = data.salesChart.labels;
        this.charts.sales.data.datasets[0].data = data.salesChart.data;
        this.charts.sales.update();

        this.charts.products.data.labels = data.productsChart.labels;
        this.charts.products.data.datasets[0].data = data.productsChart.data;
        this.charts.products.update();

        this.charts.demographics.data.datasets[0].data = data.demographics;
        this.charts.demographics.update();

        this.charts.traffic.data.datasets[0].data = data.trafficSources;
        this.charts.traffic.update();
    }

    setupTimePeriodFilters() {
        const periodFilter = document.getElementById('periodFilter');
        periodFilter.addEventListener('change', () => {
            this.updateTimePeriod(periodFilter.value);
        });

        // Set default period to 'month'
        periodFilter.value = 'month';
        this.updateTimePeriod('month');
    }

    async updateTimePeriod(period) {
        try {
            const endDate = new Date();
            let startDate = new Date();

            switch(period) {
                case 'day':
                    startDate.setDate(endDate.getDate() - 7); // Last 7 days
                    break;
                case 'month':
                    startDate.setMonth(endDate.getMonth() - 1); // Last month
                    break;
                case 'year':
                    startDate.setFullYear(endDate.getFullYear() - 1); // Last year
                    break;
                case 'custom':
                    // Use date range picker values
                    return;
            }

            document.getElementById('startDate').value = this.formatDate(startDate);
            document.getElementById('endDate').value = this.formatDate(endDate);

            const response = await fetch(`/api/analytics/dashboard?start=${this.formatDate(startDate)}&end=${this.formatDate(endDate)}&period=${period}`);
            const data = await response.json();
            
            this.updateMetrics(data);
            this.updateCharts(data);
            this.updateTables(data);
            this.updatePeriodComparison(data.comparison);
        } catch (error) {
            console.error('Error updating time period:', error);
        }
    }

    formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    updatePeriodComparison(comparison) {
        const comparisonContainer = document.getElementById('periodComparison');
        comparisonContainer.innerHTML = `
            <div class="comparison-card">
                <h4>Previous Period Comparison</h4>
                <div class="comparison-metrics">
                    <div class="comparison-metric">
                        <span class="label">Sales</span>
                        <span class="value ${comparison.sales >= 0 ? 'positive' : 'negative'}">
                            ${comparison.sales >= 0 ? '+' : ''}${comparison.sales}%
                        </span>
                    </div>
                    <div class="comparison-metric">
                        <span class="label">Orders</span>
                        <span class="value ${comparison.orders >= 0 ? 'positive' : 'negative'}">
                            ${comparison.orders >= 0 ? '+' : ''}${comparison.orders}%
                        </span>
                    </div>
                    <div class="comparison-metric">
                        <span class="label">Users</span>
                        <span class="value ${comparison.users >= 0 ? 'positive' : 'negative'}">
                            ${comparison.users >= 0 ? '+' : ''}${comparison.users}%
                        </span>
                    </div>
                </div>
            </div>
        `;
    }
}

// Initialize the analytics dashboard
const analyticsDashboard = new AnalyticsDashboard(); 