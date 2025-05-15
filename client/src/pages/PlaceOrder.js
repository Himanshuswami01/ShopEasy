import React, { useEffect, useState } from 'react';
import { Row, Col, ListGroup, Image, Button, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import { createOrder } from '../actions/orderActions';
import { ORDER_CREATE_RESET } from '../constants/orderConstants';
import { clearCart } from '../actions/cartActions';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const PlaceOrder = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cart = useSelector((state) => state.cart);
    const orderCreate = useSelector((state) => state.orderCreate);
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);

    const { cartItems, shippingAddress, paymentMethod } = cart;
    const { success, error: orderError } = orderCreate;

    const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
    const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

    useEffect(() => {
        if (success) {
            navigate(`/order/${orderCreate.order._id}`);
            dispatch({ type: ORDER_CREATE_RESET });
            dispatch(clearCart());
        }
    }, [success, navigate, dispatch]);

    const placeOrderHandler = async () => {
        setProcessing(true);
        try {
            const stripe = await stripePromise;
            const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
                paymentMethod,
                {
                    payment_method: paymentMethod,
                    amount: totalPrice * 100, // Convert to cents
                    currency: 'usd',
                }
            );

            if (stripeError) {
                setError(stripeError.message);
                setProcessing(false);
                return;
            }

            dispatch(createOrder({
                orderItems: cartItems,
                shippingAddress,
                paymentMethod,
                paymentResult: {
                    id: paymentIntent.id,
                    status: paymentIntent.status,
                    update_time: new Date().toISOString(),
                    email_address: userInfo.email,
                },
                itemsPrice,
                shippingPrice,
                taxPrice,
                totalPrice,
            }));
        } catch (err) {
            setError('An error occurred while processing your payment.');
            setProcessing(false);
        }
    };

    return (
        <>
            <CheckoutSteps step1 step2 step3 step4 />
            <Row>
                <Col md={8}>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p>
                                <strong>Address:</strong>
                                {shippingAddress.address}, {shippingAddress.city}{' '}
                                {shippingAddress.state}, {shippingAddress.country}{' '}
                                {shippingAddress.zipCode}
                            </p>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <p>
                                <strong>Method: </strong>
                                {paymentMethod}
                            </p>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            {cartItems.length === 0 ? (
                                <Message>Your cart is empty</Message>
                            ) : (
                                <ListGroup variant="flush">
                                    {cartItems.map((item, index) => (
                                        <ListGroup.Item key={index}>
                                            <Row>
                                                <Col md={1}>
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        fluid
                                                        rounded
                                                    />
                                                </Col>
                                                <Col>
                                                    <p>{item.name}</p>
                                                </Col>
                                                <Col md={4}>
                                                    {item.qty} x ${item.price} = ${item.qty * item.price}
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={4}>
                    <Card>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <h2>Order Summary</h2>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Items</Col>
                                    <Col>${itemsPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping</Col>
                                    <Col>${shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax</Col>
                                    <Col>${taxPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Total</Col>
                                    <Col>${totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                {error && <Message variant="danger">{error}</Message>}
                                {orderError && <Message variant="danger">{orderError}</Message>}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Button
                                    type="button"
                                    className="btn-block"
                                    disabled={cartItems.length === 0 || processing}
                                    onClick={placeOrderHandler}
                                >
                                    {processing ? 'Processing...' : 'Place Order'}
                                </Button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default PlaceOrder; 