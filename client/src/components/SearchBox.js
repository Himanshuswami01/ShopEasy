import React, { useState } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const SearchBox = () => {
    const [keyword, setKeyword] = useState('');
    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/search/${keyword}`);
        } else {
            navigate('/');
        }
    };

    return (
        <Form onSubmit={submitHandler} className="d-flex">
            <InputGroup>
                <Form.Control
                    type="text"
                    name="q"
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Search products..."
                    className="mr-sm-2 ml-sm-5"
                ></Form.Control>
                <InputGroup.Text
                    type="submit"
                    variant="outline-success"
                    className="p-2"
                >
                    <i className="fas fa-search"></i>
                </InputGroup.Text>
            </InputGroup>
        </Form>
    );
};

export default SearchBox; 