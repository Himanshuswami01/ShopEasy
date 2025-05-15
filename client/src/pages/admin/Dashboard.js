import React, { useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { listProducts } from '../../actions/productActions';
import { listOrders } from '../../actions/orderActions';
import { listUsers } from '../../actions/userActions';

const Dashboard = () => {
    const dispatch = useDispatch();

    const productList = useSelector((state) => state.productList);
    const { products } = productList;

    const orderList = useSelector((state) => state.orderList);
    const { orders } = orderList;

    const userList = useSelector((state) => state.userList);
    const { users } = userList;

    useEffect(() => {
        dispatch(listProducts());
        dispatch(listOrders());
        dispatch(listUsers());
    }, [dispatch]);

    const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);
    const totalOrders = orders.length;
    const totalProducts = products.length;
    const totalUsers = users.length;

    const recentOrders = orders.slice(-5).reverse();
    const lowStockProducts = products.filter((product) => product.countInStock < 10);

    return (
        <>
            <h1 className="my-3">Dashboard</h1>
            <Row>
                <Col md={3}>
                    <Card className="my-3 p-3 rounded">
                        <Card.Body>
                            <Card.Title as="h3">${totalRevenue.toFixed(2)}</Card.Title>
                            <Card.Text>Total Revenue</Card.Text>
                            <Link to="/admin/orderlist">View Details</Link>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="my-3 p-3 rounded">
                        <Card.Body>
                            <Card.Title as="h3">{totalOrders}</Card.Title>
                            <Card.Text>Total Orders</Card.Text>
                            <Link to="/admin/orderlist">View Details</Link>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="my-3 p-3 rounded">
                        <Card.Body>
                            <Card.Title as="h3">{totalProducts}</Card.Title>
                            <Card.Text>Total Products</Card.Text>
                            <Link to="/admin/productlist">View Details</Link>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="my-3 p-3 rounded">
                        <Card.Body>
                            <Card.Title as="h3">{totalUsers}</Card.Title>
                            <Card.Text>Total Users</Card.Text>
                            <Link to="/admin/userlist">View Details</Link>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col md={6}>
                    <Card className="my-3 p-3 rounded">
                        <Card.Body>
                            <Card.Title>Recent Orders</Card.Title>
                            <Card.Text>
                                {recentOrders.map((order) => (
                                    <div key={order._id} className="my-2">
                                        <strong>Order #{order._id}</strong> - ${order.totalPrice} -{' '}
                                        {order.isPaid ? 'Paid' : 'Not Paid'}
                                    </div>
                                ))}
                            </Card.Text>
                            <Link to="/admin/orderlist">View All Orders</Link>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="my-3 p-3 rounded">
                        <Card.Body>
                            <Card.Title>Low Stock Products</Card.Title>
                            <Card.Text>
                                {lowStockProducts.map((product) => (
                                    <div key={product._id} className="my-2">
                                        <strong>{product.name}</strong> - {product.countInStock} in stock
                                    </div>
                                ))}
                            </Card.Text>
                            <Link to="/admin/productlist">View All Products</Link>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default Dashboard; 