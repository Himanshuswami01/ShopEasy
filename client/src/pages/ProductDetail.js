import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Row,
    Col,
    Image,
    ListGroup,
    Button,
    Form,
    Card,
    Badge
} from 'react-bootstrap';
import Rating from '../components/Rating';
import { addToCart } from '../actions/cartActions';
import { createProductReview } from '../actions/productActions';
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants';

const ProductDetail = () => {
    const [qty, setQty] = useState(1);
    const [color, setColor] = useState('');
    const [size, setSize] = useState('');
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const productDetails = useSelector((state) => state.productDetails);
    const { loading, error, product } = productDetails;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const productReviewCreate = useSelector((state) => state.productReviewCreate);
    const {
        loading: loadingReview,
        error: errorReview,
        success: successReview,
    } = productReviewCreate;

    useEffect(() => {
        if (successReview) {
            setRating(0);
            setComment('');
            dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
        }
    }, [dispatch, successReview]);

    const addToCartHandler = () => {
        if (!color || !size) {
            alert('Please select color and size');
            return;
        }
        dispatch(addToCart(id, qty, color, size));
        navigate('/cart');
    };

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(createProductReview(id, { rating, comment }));
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Row>
            <Col md={6}>
                <Image src={product.images[0].url} alt={product.name} fluid />
            </Col>
            <Col md={3}>
                <ListGroup variant="flush">
                    <ListGroup.Item>
                        <h3>{product.name}</h3>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Rating
                            value={product.rating}
                            text={`${product.numReviews} reviews`}
                        />
                    </ListGroup.Item>
                    <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
                    <ListGroup.Item>
                        Description: {product.description}
                    </ListGroup.Item>
                </ListGroup>
            </Col>
            <Col md={3}>
                <Card>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <Row>
                                <Col>Price:</Col>
                                <Col>
                                    <strong>${product.price}</strong>
                                </Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Status:</Col>
                                <Col>
                                    {product.stock > 0 ? (
                                        <Badge bg="success">In Stock</Badge>
                                    ) : (
                                        <Badge bg="danger">Out of Stock</Badge>
                                    )}
                                </Col>
                            </Row>
                        </ListGroup.Item>

                        {product.stock > 0 && (
                            <>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Color:</Col>
                                        <Col>
                                            <Form.Select
                                                value={color}
                                                onChange={(e) => setColor(e.target.value)}
                                            >
                                                <option value="">Select Color</option>
                                                {product.colors.map((c) => (
                                                    <option key={c.code} value={c.name}>
                                                        {c.name}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <Row>
                                        <Col>Size:</Col>
                                        <Col>
                                            <Form.Select
                                                value={size}
                                                onChange={(e) => setSize(e.target.value)}
                                            >
                                                <option value="">Select Size</option>
                                                {product.sizes.map((s) => (
                                                    <option key={s} value={s}>
                                                        {s}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <Row>
                                        <Col>Qty:</Col>
                                        <Col>
                                            <Form.Select
                                                value={qty}
                                                onChange={(e) => setQty(Number(e.target.value))}
                                            >
                                                {[...Array(product.stock).keys()].map((x) => (
                                                    <option key={x + 1} value={x + 1}>
                                                        {x + 1}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <Button
                                        onClick={addToCartHandler}
                                        className="btn-block"
                                        type="button"
                                        disabled={!color || !size}
                                    >
                                        Add to Cart
                                    </Button>
                                </ListGroup.Item>
                            </>
                        )}
                    </ListGroup>
                </Card>
            </Col>
        </Row>
        <Row>
            <Col md={6}>
                <h2>Reviews</h2>
                {product.reviews.length === 0 && <div>No Reviews</div>}
                <ListGroup variant="flush">
                    {product.reviews.map((review) => (
                        <ListGroup.Item key={review._id}>
                            <strong>{review.name}</strong>
                            <Rating value={review.rating} text="" />
                            <p>{review.createdAt.substring(0, 10)}</p>
                            <p>{review.comment}</p>
                        </ListGroup.Item>
                    ))}
                    <ListGroup.Item>
                        <h2>Write a Customer Review</h2>
                        {errorReview && (
                            <div className="alert alert-danger">{errorReview}</div>
                        )}
                        {userInfo ? (
                            <Form onSubmit={submitHandler}>
                                <Form.Group className="my-3" controlId="rating">
                                    <Form.Label>Rating</Form.Label>
                                    <Form.Select
                                        value={rating}
                                        onChange={(e) => setRating(Number(e.target.value))}
                                    >
                                        <option value="">Select...</option>
                                        <option value="1">1 - Poor</option>
                                        <option value="2">2 - Fair</option>
                                        <option value="3">3 - Good</option>
                                        <option value="4">4 - Very Good</option>
                                        <option value="5">5 - Excellent</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="my-3" controlId="comment">
                                    <Form.Label>Comment</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        row="3"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                    />
                                </Form.Group>
                                <Button
                                    disabled={loadingReview}
                                    type="submit"
                                    variant="primary"
                                >
                                    Submit
                                </Button>
                            </Form>
                        ) : (
                            <div>
                                Please <a href="/login">sign in</a> to write a review
                            </div>
                        )}
                    </ListGroup.Item>
                </ListGroup>
            </Col>
        </Row>
    );
};

export default ProductDetail; 