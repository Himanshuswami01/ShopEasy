export class BillGenerator {
    generateBillHTML(cart, customerInfo) {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Invoice - Fashion Store</title>
                <style>
                    ${this.getBillStyles()}
                </style>
            </head>
            <body>
                <div class="invoice">
                    <div class="invoice-header">
                        <div class="logo">
                            <h1>Fashion Store</h1>
                        </div>
                        <div class="invoice-info">
                            <h2>INVOICE</h2>
                            <p>Invoice #: INV-${Date.now()}</p>
                            <p>Date: ${new Date().toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div class="customer-info">
                        <div class="billing-to">
                            <h3>Bill To:</h3>
                            <p>${customerInfo.name}</p>
                            <p>${customerInfo.address}</p>
                            <p>${customerInfo.email}</p>
                            <p>${customerInfo.phone}</p>
                        </div>
                        <div class="shipping-to">
                            <h3>Ship To:</h3>
                            <p>${customerInfo.shippingAddress}</p>
                        </div>
                    </div>

                    <table class="items-table">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${cart.items.map(item => `
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
                                <td>$${cart.subtotal.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td colspan="3">Shipping</td>
                                <td>$${cart.shipping.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td colspan="3">Tax</td>
                                <td>$${cart.tax.toFixed(2)}</td>
                            </tr>
                            <tr class="total">
                                <td colspan="3">Total</td>
                                <td>$${cart.total.toFixed(2)}</td>
                            </tr>
                        </tfoot>
                    </table>

                    <div class="invoice-footer">
                        <p>Thank you for your business!</p>
                        <p>Terms & Conditions Apply</p>
                    </div>
                </div>
            </body>
            </html>
        `;
    }

    getBillStyles() {
        return `
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .invoice { max-width: 800px; margin: auto; }
            .invoice-header { display: flex; justify-content: space-between; margin-bottom: 40px; }
            .logo h1 { margin: 0; color: #333; }
            .invoice-info { text-align: right; }
            .customer-info { display: flex; justify-content: space-between; margin-bottom: 40px; }
            .items-table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
            .items-table th, .items-table td { padding: 10px; border-bottom: 1px solid #ddd; text-align: left; }
            .items-table th { background: #f5f5f5; }
            .total td { font-weight: bold; font-size: 1.1em; }
            .invoice-footer { text-align: center; color: #666; }
        `;
    }
} 