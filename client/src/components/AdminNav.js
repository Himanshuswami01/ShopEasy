import React from 'react';
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const AdminNav = () => {
    return (
        <Nav className="flex-column">
            <LinkContainer to="/admin/dashboard">
                <Nav.Link>
                    <i className="fas fa-tachometer-alt"></i> Dashboard
                </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/admin/productlist">
                <Nav.Link>
                    <i className="fas fa-box"></i> Products
                </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/admin/orderlist">
                <Nav.Link>
                    <i className="fas fa-shopping-cart"></i> Orders
                </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/admin/userlist">
                <Nav.Link>
                    <i className="fas fa-users"></i> Users
                </Nav.Link>
            </LinkContainer>
        </Nav>
    );
};

export default AdminNav; 