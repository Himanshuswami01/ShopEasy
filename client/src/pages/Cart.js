import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Row,
    Col,
    ListGroup,
    Image,
    Form,
    Button,
    Card,
    Alert
} from 'react-bootstrap';
import { addToCart, removeFromCart, updateCartItem } from '../actions/cartActions';
import { applyCoupon } from '../actions/cartActions';

const Cart = () => {
    const [couponCode, setCouponCode] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const cart = useSelector((state) => state.cart);
    const { cartItems, error: couponError } = cart;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id));
    };

    const updateCartHandler = (id, qty) => {
        dispatch(updateCartItem(id, qty));
    };

    const applyCouponHandler = (e) => {
        e.preventDefault();
        dispatch(applyCoupon(couponCode));
    };

    const checkoutHandler = () => {
        if (!userInfo) {
            navigate('/login?redirect=shipping');
        } else {
            navigate('/shipping');
        }
    };

    return (
        <Row>
            <Col md={8}>
                <h1>Shopping Cart</h1>
                {cartItems.length === 0 ? (
                    <Alert variant="info">
                        Your cart is empty <Link to="/">Go Back</Link>
                    </Alert>
                ) : (
                    <ListGroup variant="flush">
                        {cartItems.map((item) => (
                            <ListGroup.Item key={item._id}>
                                <Row>
                                    <Col md={2}>
                                        <Image src={item.image} alt={item.name} fluid rounded />
                                    </Col>
                                    <Col md={3}>
                                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                                    </Col>
                                    <Col md={2}>
                                        Color: {item.color}
                                    </Col>
                                    <Col md={2}>
                                        Size: {item.size}
                                    </Col>
                                    <Col md={2}>
                                        ${item.price}
                                    </Col>
                                    <Col md={1}>
                                        <Form.Select
                                            value={item.quantity}
                                            onChange={(e) => updateCartHandler(item._id, Number(e.target.value))}
                                        >
                                            {[...Array(item.product.stock).keys()].map((x) => (
                                                <option key={x + 1} value={x + 1}>
                                                    {x + 1}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Col>
                                    <Col md={1}>
                                        <Button
                                            type="button"
                                            variant="light"
                                            onClick={() => removeFromCartHandler(item._id)}
                                        >
                                            <i className="fas fa-trash"></i>
                                        </Button>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </Col>
            <Col md={4}>
                <Card>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <h2>Order Summary</h2>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Items:</Col>
                                <Col>${cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Shipping:</Col>
                                <Col>${cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) > 100 ? '0.00' : '10.00'}</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Tax:</Col>
                                <Col>${(cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) * 0.18).toFixed(2)}</Col>
                            </Row>
                        </ListGroup.Item>
                        {cart.couponApplied && (
                            <ListGroup.Item>
                                <Row>
                                    <Col>Discount:</Col>
                                    <Col>-${(cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) * (cart.couponApplied.discount / 100)).toFixed(2)}</Col>
                                </Row>
                            </ListGroup.Item>
                        )}
                        <ListGroup.Item>
                            <Row>
                                <Col>Total:</Col>
                                <Col>
                                    <strong>
                                        ${(
                                            cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) +
                                            (cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) > 100 ? 0 : 10) +
                                            (cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) * 0.18) -
                                            (cart.couponApplied ? cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) * (cart.couponApplied.discount / 100) : 0)
                                        ).toFixed(2)}
                                    </strong>
                                </Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Form onSubmit={applyCouponHandler}>
                                <Row>
                                    <Col>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter coupon code"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                        />
                                    </Col>
                                    <Col>
                                        <Button type="submit" variant="outline-primary">
                                            Apply
                                        </Button>
                                    </Col>
                                </Row>
                                {couponError && (
                                    <Alert variant="danger" className="mt-2">
                                        {couponError}
                                    </Alert>
                                )}
                            </Form>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Button
                                type="button"
                                className="btn-block"
                                disabled={cartItems.length === 0}
                                onClick={checkoutHandler}
                            >
                                Proceed to Checkout
                            </Button>
                        </ListGroup.Item>
                    </ListGroup>
                </Card>
            </Col>
        </Row>
    );
};

export default Cart; 