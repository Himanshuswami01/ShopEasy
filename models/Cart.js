// Add these methods to the Cart class

static async addBulkItems(cartId, items) {
    return await transaction(async (connection) => {
        const sql = `
            INSERT INTO cart_items 
            (cart_id, product_id, variant_id, quantity)
            VALUES (?, ?, ?, ?)
        `;

        for (const item of items) {
            await connection.execute(sql, [
                cartId,
                item.productId,
                item.variantId,
                item.quantity
            ]);
        }
    });
}

static async getCartSummary(cartId) {
    const sql = `
        SELECT 
            COUNT(DISTINCT ci.cart_item_id) as total_items,
            SUM(ci.quantity) as total_quantity,
            SUM(p.price * ci.quantity) as subtotal,
            GROUP_CONCAT(DISTINCT c.name) as categories
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.product_id
        LEFT JOIN categories c ON p.category_id = c.category_id
        WHERE ci.cart_id = ?
        GROUP BY ci.cart_id
    `;
    const [summary] = await query(sql, [cartId]);
    return summary;
}

static async validateStock(cartId) {
    const sql = `
        SELECT ci.*, p.stock_quantity, p.name
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.product_id
        WHERE ci.cart_id = ?
        AND ci.quantity > p.stock_quantity
    `;
    return await query(sql, [cartId]);
}

static async moveToWishlist(cartItemId, userId) {
    const [cartItem] = await query(
        'SELECT product_id FROM cart_items WHERE cart_item_id = ?',
        [cartItemId]
    );

    if (cartItem) {
        await transaction(async (connection) => {
            await connection.execute(
                'INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)',
                [userId, cartItem.product_id]
            );
            await connection.execute(
                'DELETE FROM cart_items WHERE cart_item_id = ?',
                [cartItemId]
            );
        });
        return true;
    }
    return false;
}

static async applyCoupon(cartId, couponCode) {
    // This would typically validate against a coupons table
    const [coupon] = await query(
        'SELECT * FROM coupons WHERE code = ? AND status = "active"',
        [couponCode]
    );

    if (coupon) {
        const cartTotal = await this.getCartTotal(cartId);
        const discount = this.calculateDiscount(cartTotal, coupon);
        
        await query(
            'UPDATE cart SET discount_amount = ? WHERE cart_id = ?',
            [discount, cartId]
        );

        return { success: true, discount };
    }
    return { success: false, message: 'Invalid coupon code' };
}

static async saveForLater(cartItemId) {
    const sql = `
        UPDATE cart_items 
        SET saved_for_later = true
        WHERE cart_item_id = ?
    `;
    return await query(sql, [cartItemId]);
}

static async getSavedItems(cartId) {
    const sql = `
        SELECT ci.*, p.name, p.price, p.image_url
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.product_id
        WHERE ci.cart_id = ? AND ci.saved_for_later = true
    `;
    return await query(sql, [cartId]);
}

static async mergeCarts(sourceCartId, targetCartId) {
    return await transaction(async (connection) => {
        // Get items from source cart
        const items = await connection.execute(`
            SELECT product_id, variant_id, quantity
            FROM cart_items
            WHERE cart_id = ?
        `, [sourceCartId]);

        // Add items to target cart
        for (const item of items[0]) {
            await this.addItem(targetCartId, item.product_id, item.quantity, item.variant_id);
        }

        // Delete source cart
        await connection.execute(
            'DELETE FROM cart WHERE cart_id = ?',
            [sourceCartId]
        );
    });
} 