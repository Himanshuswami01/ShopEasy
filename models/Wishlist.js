import { query } from '../config/database.js';

export class Wishlist {
    static async findByUserId(userId) {
        const sql = `
            SELECT w.*, 
                   p.name, p.price, p.image_url,
                   p.stock_quantity, p.status
            FROM wishlist w
            JOIN products p ON w.product_id = p.product_id
            WHERE w.user_id = ?
            ORDER BY w.added_at DESC
        `;
        return await query(sql, [userId]);
    }

    static async addItem(userId, productId) {
        // Check if item already exists in wishlist
        const exists = await this.checkExists(userId, productId);
        if (exists) return false;

        const sql = `
            INSERT INTO wishlist (user_id, product_id)
            VALUES (?, ?)
        `;
        return await query(sql, [userId, productId]);
    }

    static async removeItem(userId, productId) {
        const sql = `
            DELETE FROM wishlist 
            WHERE user_id = ? AND product_id = ?
        `;
        return await query(sql, [userId, productId]);
    }

    static async checkExists(userId, productId) {
        const sql = `
            SELECT * FROM wishlist 
            WHERE user_id = ? AND product_id = ?
        `;
        const [item] = await query(sql, [userId, productId]);
        return !!item;
    }

    static async moveToCart(userId, productId) {
        const product = await query(
            'SELECT * FROM products WHERE product_id = ?',
            [productId]
        );
        
        if (product) {
            await Cart.addItem(userId, productId, 1);
            await this.removeItem(userId, productId);
            return true;
        }
        return false;
    }
} 