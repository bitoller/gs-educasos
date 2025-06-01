import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useState } from 'react';
import { FaEnvelope } from 'react-icons/fa';

const Contato = () => {
  const [form, setForm] = useState({ nome: '', email: '', mensagem: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <Container className="py-5">
      {/* Hero Section */}
      <Row className="justify-content-center mb-5">
        <Col xs={12} md={10} lg={8} className="text-center">
          <FaEnvelope size={48} color="#007bff" className="mb-3" />
          <h1 className="display-4 fw-bold mb-2">Contato & Sugestões</h1>
          <h2 className="h5 text-secondary mb-4">Envie sua mensagem ou sugestão para nossa equipe.</h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-sm mb-4">
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
                  <Form.Label>Mensagem</Form.Label>
                  <Form.Control as="textarea" name="mensagem" value={form.mensagem} onChange={handleChange} rows={4} required />
                </Form.Group>
                <Button type="submit" variant="primary" className="w-100">Enviar</Button>
                {submitted && <div className="mt-3 alert alert-success text-center">Mensagem enviada com sucesso!</div>}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Contato; 