import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index.js';
import { connectDB } from './config/database.js';
import errorHandler from './middleware/errorHandler.js';
import authMiddleware from './middleware/authMiddleware.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', routes.authRoutes);
app.use('/api/products', routes.productRoutes);
app.use('/api/categories', routes.categoryRoutes);
app.use('/api/cart', authMiddleware, routes.cartRoutes);
app.use('/api/orders', authMiddleware, routes.orderRoutes);
app.use('/api/users', authMiddleware, routes.userRoutes);
app.use('/api/wishlist', authMiddleware, routes.wishlistRoutes);

// Add a basic root route if missing
app.get('/', (req, res) => {
  res.send('Server is running ✅');
});

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}); 