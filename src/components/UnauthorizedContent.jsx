import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const UnauthorizedContent = ({ title, message }) => {
  return (
    <Container className="mt-5 pt-5">
      <Card className="text-center">
        <Card.Body>
          <Card.Title className="mb-4">{title}</Card.Title>
          <Card.Text className="mb-4">
            {message}
          </Card.Text>
          <div className="d-flex justify-content-center gap-3">
            <Button as={Link} to="/login" variant="primary">
              Fazer Login
            </Button>
            <Button as={Link} to="/register" variant="outline-primary">
              Criar Conta
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UnauthorizedContent; 