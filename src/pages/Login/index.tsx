import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useState } from 'react';
import { FaSignInAlt } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for authentication logic
    if (!email || !password) {
      setError('Preencha todos os campos.');
    } else {
      setError('');
      // Autenticação...
    }
  };

  return (
    <Container className="py-5">
      {/* Hero Section */}
      <Row className="justify-content-center mb-5">
        <Col xs={12} md={10} lg={8} className="text-center">
          <FaSignInAlt size={48} color="#007bff" className="mb-3" />
          <h1 className="display-4 fw-bold mb-2">Entrar</h1>
          <h2 className="h5 text-secondary mb-4">Acesse sua conta para utilizar todos os recursos.</h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Senha</Form.Label>
                  <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                </Form.Group>
                {error && <div className="alert alert-danger text-center">{error}</div>}
                <Button type="submit" variant="primary" className="w-100">Entrar</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login; 