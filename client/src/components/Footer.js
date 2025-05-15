import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-dark text-light py-4 mt-auto">
            <Container>
                <Row>
                    <Col md={4}>
                        <h5>About Us</h5>
                        <p>
                            We are a leading e-commerce platform dedicated to providing
                            high-quality products and excellent customer service.
                        </p>
                    </Col>
                    <Col md={4}>
                        <h5>Quick Links</h5>
                        <ul className="list-unstyled">
                            <li>
                                <Link to="/" className="text-light">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/cart" className="text-light">
                                    Cart
                                </Link>
                            </li>
                            <li>
                                <Link to="/login" className="text-light">
                                    Login
                                </Link>
                            </li>
                            <li>
                                <Link to="/register" className="text-light">
                                    Register
                                </Link>
                            </li>
                        </ul>
                    </Col>
                    <Col md={4}>
                        <h5>Contact Us</h5>
                        <ul className="list-unstyled">
                            <li>
                                <i className="fas fa-phone"></i> +1 234 567 8900
                            </li>
                            <li>
                                <i className="fas fa-envelope"></i>{' '}
                                support@ecommerce.com
                            </li>
                            <li>
                                <i className="fas fa-map-marker-alt"></i> 123 Street
                                Name, City, Country
                            </li>
                        </ul>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col className="text-center">
                        <p className="mb-0">
                            &copy; {new Date().getFullYear()} E-Commerce. All rights
                            reserved.
                        </p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer; 