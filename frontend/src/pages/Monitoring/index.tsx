import { Container, Row, Col, Card } from 'react-bootstrap';

export const Monitoring = () => {
  return (
    <Container className="py-4">
      <h2 className="mb-4">Painel de Monitoramento</h2>
      <Row xs={1} md={2} lg={3} className="g-4">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Alertas Ativos</Card.Title>
              <Card.Text className="h3">3</Card.Text>
              <Card.Text className="text-success">
                <i className="bi bi-arrow-up"></i> 23.36%
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Áreas de Risco</Card.Title>
              <Card.Text className="h3">12</Card.Text>
              <Card.Text className="text-danger">
                <i className="bi bi-arrow-down"></i> 9.05%
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Usuários Ativos</Card.Title>
              <Card.Text className="h3">245</Card.Text>
              <Card.Text className="text-success">
                <i className="bi bi-arrow-up"></i> 12.5%
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}; 