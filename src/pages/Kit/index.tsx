import { Container, Row, Col, Card, Form, Button, ListGroup } from 'react-bootstrap';
import { useState } from 'react';
import { FaTools } from 'react-icons/fa';

const defaultKit = [
  'Água potável',
  'Alimentos não perecíveis',
  'Lanterna e pilhas',
  'Documentos pessoais',
  'Kit de primeiros socorros',
  'Rádio portátil',
  'Produtos de higiene',
];

const Kit = () => {
  const [residents, setResidents] = useState(1);
  const [hasChildren, setHasChildren] = useState(false);
  const [hasElderly, setHasElderly] = useState(false);
  const [hasPets, setHasPets] = useState(false);

  // You can expand this logic for more dynamic recommendations
  const recommended = [...defaultKit];
  if (hasChildren) recommended.push('Fraldas e itens infantis');
  if (hasElderly) recommended.push('Medicamentos de uso contínuo');
  if (hasPets) recommended.push('Ração e itens para pets');

  return (
    <Container className="py-5">
      {/* Hero Section */}
      <Row className="justify-content-center mb-5">
        <Col xs={12} md={10} lg={8} className="text-center">
          <FaTools size={48} color="#28a745" className="mb-3" />
          <h1 className="display-4 fw-bold mb-2">Monte seu Kit de Emergência</h1>
          <h2 className="h5 text-secondary mb-4">Personalize seu kit de acordo com as necessidades da sua família.</h2>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Número de moradores</Form.Label>
                  <Form.Control type="number" min={1} value={residents} onChange={e => setResidents(Number(e.target.value))} />
                </Form.Group>
                <Form.Check type="checkbox" label="Possui crianças?" checked={hasChildren} onChange={e => setHasChildren(e.target.checked)} />
                <Form.Check type="checkbox" label="Possui idosos?" checked={hasElderly} onChange={e => setHasElderly(e.target.checked)} />
                <Form.Check type="checkbox" label="Possui animais de estimação?" checked={hasPets} onChange={e => setHasPets(e.target.checked)} />
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="fw-bold mb-3">Itens recomendados</Card.Title>
              <ListGroup>
                {recommended.map(item => (
                  <ListGroup.Item key={item}>{item}</ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Kit; 