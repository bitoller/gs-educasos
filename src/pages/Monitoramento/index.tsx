import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaChartLine } from 'react-icons/fa';

const Monitoramento = () => (
  <Container className="py-5">
    {/* Hero Section */}
    <Row className="justify-content-center mb-5">
      <Col xs={12} md={10} lg={8} className="text-center">
        <FaChartLine size={48} color="#007bff" className="mb-3" />
        <h1 className="display-4 fw-bold mb-2">Painel de Monitoramento</h1>
        <h2 className="h5 text-secondary mb-4">Acompanhe alertas e estatísticas em tempo real.</h2>
      </Col>
    </Row>
    <Row className="mb-4">
      <Col md={6}>
        <Card className="shadow-sm mb-4">
          <Card.Body>
            <Card.Title className="fw-bold">Alertas em Tempo Real</Card.Title>
            <Card.Text className="text-muted">Nenhum alerta ativo no momento.</Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col md={6}>
        <Card className="shadow-sm mb-4">
          <Card.Body>
            <Card.Title className="fw-bold">Estatísticas</Card.Title>
            <Card.Text className="text-muted">Estatísticas de desastres em desenvolvimento...</Card.Text>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </Container>
);

export default Monitoramento; 