import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaWater, FaTools, FaQuestionCircle, FaMapMarkedAlt } from 'react-icons/fa';
import './Home.css';

const quickAccessItems = [
  {
    title: 'Aprenda sobre Enchentes',
    description: 'Informações importantes sobre como se prevenir e agir durante enchentes.',
    icon: FaWater,
    path: '/aprender/enchentes',
    color: '#007bff',
  },
  {
    title: 'Monte seu Kit de Emergência',
    description: 'Crie um kit personalizado baseado nas necessidades da sua família.',
    icon: FaTools,
    path: '/kit',
    color: '#28a745',
  },
  {
    title: 'Teste seus conhecimentos',
    description: 'Responda nosso quiz e descubra seu nível de preparação.',
    icon: FaQuestionCircle,
    path: '/quiz',
    color: '#ffc107',
  },
  {
    title: 'Verifique se sua área é de risco',
    description: 'Consulte o mapa de risco da sua região.',
    icon: FaMapMarkedAlt,
    path: '/mapa',
    color: '#17a2b8',
  },
];

export const Home = () => {
  return (
    <Container className="py-5">
      {/* Hero Section */}
      <Row className="justify-content-center mb-5">
        <Col xs={12} md={10} lg={8} className="text-center">
          <h1 className="display-3 fw-bold mb-2">Educação salva vidas</h1>
          <h2 className="h5 text-secondary mb-4">Saiba como agir antes, durante e depois de um desastre.</h2>
        </Col>
      </Row>

      {/* Quick Access Section */}
      <Row xs={1} md={2} lg={4} className="g-4 mb-5">
        {quickAccessItems.map((item) => (
          <Col key={item.title}>
            <Card className="h-100 shadow-sm home-card">
              <Card.Body className="d-flex flex-column align-items-center">
                <div className="mb-3">
                  <item.icon size={48} color={item.color} />
                </div>
                <Card.Title className="text-center h5 fw-bold">{item.title}</Card.Title>
                <Card.Text className="text-center flex-grow-1">{item.description}</Card.Text>
                <div className="text-center mt-3 w-100">
                  <Link to={item.path}>
                    <Button variant="primary" className="w-100">Saiba mais</Button>
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* News Section */}
      <Row className="mt-5">
        <Col xs={12} className="text-center">
          <h2 className="mb-4 fw-bold">Últimas Notícias e Alertas</h2>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Text>Carrossel de notícias em desenvolvimento...</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}; 