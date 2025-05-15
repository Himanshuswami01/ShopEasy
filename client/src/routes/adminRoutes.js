import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminRoute from '../components/AdminRoute';
import AdminLayout from '../components/AdminLayout';
import Dashboard from '../pages/admin/Dashboard';
import ProductList from '../pages/admin/ProductList';
import ProductEdit from '../pages/admin/ProductEdit';
import OrderList from '../pages/admin/OrderList';
import UserList from '../pages/admin/UserList';
import UserEdit from '../pages/admin/UserEdit';

const AdminRoutes = () => {
    return (
        <Routes>
            <Route
                path="/admin/dashboard"
                element={
                    <AdminRoute>
                        <AdminLayout>
                            <Dashboard />
                        </AdminLayout>
                    </AdminRoute>
                }
            />
            <Route
                path="/admin/productlist"
                element={
                    <AdminRoute>
                        <AdminLayout>
                            <ProductList />
                        </AdminLayout>
                    </AdminRoute>
                }
            />
            <Route
                path="/admin/product/:id/edit"
                element={
                    <AdminRoute>
                        <AdminLayout>
                            <ProductEdit />
                        </AdminLayout>
                    </AdminRoute>
                }
            />
            <Route
                path="/admin/orderlist"
                element={
                    <AdminRoute>
                        <AdminLayout>
                            <OrderList />
                        </AdminLayout>
                    </AdminRoute>
                }
            />
            <Route
                path="/admin/userlist"
                element={
                    <AdminRoute>
                        <AdminLayout>
                            <UserList />
                        </AdminLayout>
                    </AdminRoute>
                }
            />
            <Route
                path="/admin/user/:id/edit"
                element={
                    <AdminRoute>
                        <AdminLayout>
                            <UserEdit />
                        </AdminLayout>
                    </AdminRoute>
                }
            />
        </Routes>
    );
};

export default AdminRoutes; 