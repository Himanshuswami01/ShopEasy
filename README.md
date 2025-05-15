# Fashion Store E-commerce Website

A modern e-commerce platform for fashion products built with Node.js, Express, MongoDB, and React.

## Features

- User authentication and authorization
- Product catalog with search and filtering
- Shopping cart functionality
- Order management
- Payment integration with Razorpay
- Admin dashboard
- Responsive design
- Product reviews and ratings
- Coupon system
- Order tracking

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn
- Razorpay account for payments

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/fashion-store.git
cd fashion-store
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file in the root directory and add the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fashion-store
JWT_SECRET=your_jwt_secret_key_here
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
NODE_ENV=development
```

4. Start the development server:
```bash
npm run dev
```

5. For full-stack development (both backend and frontend):
```bash
npm run dev:full
```

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/profile - Get user profile
- PUT /api/auth/profile - Update user profile

### Products
- GET /api/products - Get all products
- GET /api/products/:id - Get single product
- POST /api/products - Create product (Admin)
- PUT /api/products/:id - Update product (Admin)
- DELETE /api/products/:id - Delete product (Admin)
- POST /api/products/:id/reviews - Create product review

### Cart
- GET /api/cart - Get user cart
- POST /api/cart - Add item to cart
- PUT /api/cart/:itemId - Update cart item
- DELETE /api/cart/:itemId - Remove item from cart
- DELETE /api/cart - Clear cart
- POST /api/cart/coupon - Apply coupon

### Orders
- POST /api/orders - Create order
- GET /api/orders/myorders - Get user orders
- GET /api/orders/:id - Get order by ID
- PUT /api/orders/:id/pay - Update order to paid
- PUT /api/orders/:id/deliver - Update order to delivered (Admin)
- PUT /api/orders/:id/status - Update order status (Admin)
- GET /api/orders - Get all orders (Admin)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

himanshu swami - himanshuswamiccc@gmail.com
Project Link: https://github.com/Himanshuswami/fashion-store 
