import { Container, Row, Col, Card } from 'react-bootstrap';

const disasterTopics = [
  {
    title: 'Enchentes',
    description: 'Saiba como se preparar, agir e se recuperar de enchentes.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    link: '/aprender/enchentes',
  },
  {
    title: 'Deslizamentos',
    description: 'Entenda os riscos e as medidas preventivas para deslizamentos de terra.',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
    link: '/aprender/deslizamentos',
  },
  {
    title: 'Incêndios',
    description: 'Dicas de prevenção e o que fazer em caso de incêndios urbanos ou florestais.',
    image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=400&q=80',
    link: '/aprender/incendios',
  },
  {
    title: 'Outros Desastres',
    description: 'Veja informações sobre outros tipos de desastres naturais e tecnológicos.',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    link: '/aprender/outros',
  },
];

const Aprender = () => (
  <Container className="py-5">
    <h1 className="mb-4 fw-bold text-center">Aprenda sobre Desastres</h1>
    <Row xs={1} md={2} lg={4} className="g-4">
      {disasterTopics.map((topic) => (
        <Col key={topic.title}>
          <Card className="h-100 shadow-sm">
            <Card.Img variant="top" src={topic.image} alt={topic.title} style={{ height: 180, objectFit: 'cover' }} />
            <Card.Body className="d-flex flex-column">
              <Card.Title className="fw-bold">{topic.title}</Card.Title>
              <Card.Text className="flex-grow-1">{topic.description}</Card.Text>
              <a href={topic.link} className="btn btn-primary mt-2 w-100">Saiba mais</a>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  </Container>
);

export default Aprender; 