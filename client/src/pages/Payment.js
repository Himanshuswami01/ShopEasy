import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '../actions/cartActions';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const Payment = () => {
    const stripe = useStripe();
    const elements = useElements();
    const cart = useSelector((state) => state.cart);
    const { shippingAddress } = cart;
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const [paymentMethod, setPaymentMethod] = useState('Stripe');
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    if (!shippingAddress.address) {
        navigate('/shipping');
    }

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setProcessing(true);

        try {
            const { error, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: elements.getElement(CardElement),
            });

            if (error) {
                setError(error.message);
                setProcessing(false);
                return;
            }

            dispatch(savePaymentMethod(paymentMethod.id));
            navigate('/placeorder');
        } catch (err) {
            setError('An error occurred while processing your payment.');
            setProcessing(false);
        }
    };

    return (
        <FormContainer>
            <CheckoutSteps step1 step2 step3 />
            <h1>Payment</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group>
                    <Form.Label as="legend">Select Method</Form.Label>
                    <Col>
                        <Form.Check
                            type="radio"
                            label="Stripe or Credit Card"
                            id="Stripe"
                            name="paymentMethod"
                            value="Stripe"
                            checked
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                    </Col>
                </Form.Group>

                <Form.Group className="my-3">
                    <Form.Label>Card Details</Form.Label>
                    <CardElement
                        options={{
                            style: {
                                base: {
                                    fontSize: '16px',
                                    color: '#424770',
                                    '::placeholder': {
                                        color: '#aab7c4',
                                    },
                                },
                                invalid: {
                                    color: '#9e2146',
                                },
                            },
                        }}
                    />
                </Form.Group>

                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}

                <Button
                    type="submit"
                    variant="primary"
                    disabled={!stripe || processing}
                >
                    {processing ? 'Processing...' : 'Pay Now'}
                </Button>
            </Form>
        </FormContainer>
    );
};

export default Payment; 