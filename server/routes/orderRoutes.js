import express from 'express';
import {
    createOrder,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getMyOrders,
    getOrders,
    updateOrderStatus
} from '../controllers/orderController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, createOrder);
router.get('/myorders', authMiddleware, getMyOrders);
router.get('/:id', authMiddleware, getOrderById);
router.put('/:id/pay', authMiddleware, updateOrderToPaid);
router.put('/:id/deliver', authMiddleware, adminMiddleware, updateOrderToDelivered);
router.put('/:id/status', authMiddleware, adminMiddleware, updateOrderStatus);
router.get('/', authMiddleware, adminMiddleware, getOrders);

export default router; 