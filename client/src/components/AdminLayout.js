import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import AdminNav from './AdminNav';

const AdminLayout = ({ children }) => {
    return (
        <Container fluid>
            <Row>
                <Col md={3} lg={2} className="d-md-block bg-light sidebar">
                    <div className="position-sticky pt-3">
                        <AdminNav />
                    </div>
                </Col>
                <Col md={9} lg={10} className="ms-sm-auto px-md-4">
                    {children}
                </Col>
            </Row>
        </Container>
    );
};

export default AdminLayout; 