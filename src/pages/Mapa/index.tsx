import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useState } from 'react';
import { FaMapMarkedAlt } from 'react-icons/fa';

const Mapa = () => {
  const [region, setRegion] = useState('');
  const [risk, setRisk] = useState<string | null>(null);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder logic
    setRisk(region ? 'Risco moderado' : null);
  };

  return (
    <Container className="py-5">
      {/* Hero Section */}
      <Row className="justify-content-center mb-5">
        <Col xs={12} md={10} lg={8} className="text-center">
          <FaMapMarkedAlt size={48} color="#17a2b8" className="mb-3" />
          <h1 className="display-4 fw-bold mb-2">Verifique o Risco da Sua Região</h1>
          <h2 className="h5 text-secondary mb-4">Consulte o risco de desastres na sua cidade ou bairro.</h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Form onSubmit={handleCheck}>
                <Form.Group className="mb-3">
                  <Form.Label>Digite sua cidade ou bairro</Form.Label>
                  <Form.Control type="text" value={region} onChange={e => setRegion(e.target.value)} placeholder="Ex: Centro, São Paulo" />
                </Form.Group>
                <Button type="submit" variant="primary" className="w-100">Verificar</Button>
              </Form>
              {risk && <div className="mt-3 alert alert-warning text-center">{risk}</div>}
            </Card.Body>
          </Card>
          <Card className="shadow-sm">
            <Card.Body>
              <div className="text-center text-muted">Mapa de risco em desenvolvimento...</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Mapa; 