import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import { saveShippingAddress } from '../actions/cartActions';

const Shipping = () => {
    const cart = useSelector((state) => state.cart);
    const { shippingAddress } = cart;

    const [address, setAddress] = useState(shippingAddress.address || '');
    const [city, setCity] = useState(shippingAddress.city || '');
    const [state, setState] = useState(shippingAddress.state || '');
    const [country, setCountry] = useState(shippingAddress.country || '');
    const [zipCode, setZipCode] = useState(shippingAddress.zipCode || '');
    const [phone, setPhone] = useState(shippingAddress.phone || '');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(saveShippingAddress({
            address,
            city,
            state,
            country,
            zipCode,
            phone
        }));
        navigate('/payment');
    };

    return (
        <FormContainer>
            <h1>Shipping</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group className="my-3" controlId="address">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter address"
                        value={address}
                        required
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="my-3" controlId="city">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter city"
                        value={city}
                        required
                        onChange={(e) => setCity(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="my-3" controlId="state">
                    <Form.Label>State</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter state"
                        value={state}
                        required
                        onChange={(e) => setState(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="my-3" controlId="country">
                    <Form.Label>Country</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter country"
                        value={country}
                        required
                        onChange={(e) => setCountry(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="my-3" controlId="zipCode">
                    <Form.Label>Zip Code</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter zip code"
                        value={zipCode}
                        required
                        onChange={(e) => setZipCode(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="my-3" controlId="phone">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter phone number"
                        value={phone}
                        required
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </Form.Group>

                <Button type="submit" variant="primary">
                    Continue
                </Button>
            </Form>
        </FormContainer>
    );
};

export default Shipping; 