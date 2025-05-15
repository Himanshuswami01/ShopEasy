import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../components/PrivateRoute';
import Home from '../pages/Home';
import ProductList from '../pages/ProductList';
import ProductDetail from '../pages/ProductDetail';
import Cart from '../pages/Cart';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/Profile';
import Shipping from '../pages/Shipping';
import Payment from '../pages/Payment';
import PlaceOrder from '../pages/PlaceOrder';
import Order from '../pages/Order';
import AdminRoutes from './adminRoutes';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search/:keyword" element={<ProductList />} />
            <Route path="/page/:pageNumber" element={<ProductList />} />
            <Route
                path="/search/:keyword/page/:pageNumber"
                element={<ProductList />}
            />
            <Route path="/category/:category" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
                path="/profile"
                element={
                    <PrivateRoute>
                        <Profile />
                    </PrivateRoute>
                }
            />
            <Route
                path="/shipping"
                element={
                    <PrivateRoute>
                        <Shipping />
                    </PrivateRoute>
                }
            />
            <Route
                path="/payment"
                element={
                    <PrivateRoute>
                        <Payment />
                    </PrivateRoute>
                }
            />
            <Route
                path="/placeorder"
                element={
                    <PrivateRoute>
                        <PlaceOrder />
                    </PrivateRoute>
                }
            />
            <Route
                path="/order/:id"
                element={
                    <PrivateRoute>
                        <Order />
                    </PrivateRoute>
                }
            />
            <Route path="/admin/*" element={<AdminRoutes />} />
        </Routes>
    );
};

export default AppRoutes; 