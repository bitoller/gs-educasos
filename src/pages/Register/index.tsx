import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useState } from 'react';
import { FaUserPlus } from 'react-icons/fa';

const Register = () => {
  const [form, setForm] = useState({ nome: '', email: '', senha: '' });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome || !form.email || !form.senha) {
      setError('Preencha todos os campos.');
    } else {
      setError('');
      // Registro...
    }
  };

  return (
    <Container className="py-5">
      {/* Hero Section */}
      <Row className="justify-content-center mb-5">
        <Col xs={12} md={10} lg={8} className="text-center">
          <FaUserPlus size={48} color="#28a745" className="mb-3" />
          <h1 className="display-4 fw-bold mb-2">Registrar</h1>
          <h2 className="h5 text-secondary mb-4">Crie sua conta para acessar todos os recursos.</h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Nome</Form.Label>
                  <Form.Control type="text" name="nome" value={form.nome} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" name="email" value={form.email} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Senha</Form.Label>
                  <Form.Control type="password" name="senha" value={form.senha} onChange={handleChange} required />
                </Form.Group>
                {error && <div className="alert alert-danger text-center">{error}</div>}
                <Button type="submit" variant="primary" className="w-100">Registrar</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register; 