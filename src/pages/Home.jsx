import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt, faFirstAid, faInfoCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="hero-section text-white text-center d-flex align-items-center">
        <Container>
          <h1 className="display-3 fw-bold mb-4">Mantenha-se Seguro, Mantenha-se Preparado</h1>
          <p className="lead mb-4">
            Informe-se sobre desastres naturais e aprenda como se preparar e proteger seus entes queridos.
          </p>
          <Button as={Link} to="/emergency-kits" variant="light" size="lg" className="me-3">
            Monte seu Kit de Emergência
          </Button>
          <Button as={Link} to="/learn" variant="outline-light" size="lg">
            Aprenda Sobre Desastres
          </Button>
        </Container>
      </div>

      {/* Features Section */}
      <Container className="py-5">
        <h2 className="text-center mb-5">Por que Escolher Nossa Plataforma?</h2>
        <Row className="g-4">
          <Col md={3}>
            <Card className="h-100 text-center feature-card">
              <Card.Body>
                <FontAwesomeIcon icon={faShieldAlt} size="3x" className="mb-3 text-primary" />
                <Card.Title>Proteção</Card.Title>
                <Card.Text>
                  Aprenda como proteger você e sua família durante emergências.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="h-100 text-center feature-card">
              <Card.Body>
                <FontAwesomeIcon icon={faFirstAid} size="3x" className="mb-3 text-danger" />
                <Card.Title>Kits de Emergência</Card.Title>
                <Card.Text>
                  Receba recomendações personalizadas de kits de emergência baseadas nas suas necessidades.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="h-100 text-center feature-card">
              <Card.Body>
                <FontAwesomeIcon icon={faInfoCircle} size="3x" className="mb-3 text-info" />
                <Card.Title>Informação</Card.Title>
                <Card.Text>
                  Acesse informações completas sobre diversos tipos de desastres.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="h-100 text-center feature-card">
              <Card.Body>
                <FontAwesomeIcon icon={faExclamationTriangle} size="3x" className="mb-3 text-warning" />
                <Card.Title>Alertas</Card.Title>
                <Card.Text>
                  Mantenha-se atualizado com alertas em tempo real sobre possíveis desastres.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Call to Action Section */}
      <div className="cta-section text-white text-center py-5">
        <Container>
          <h2 className="mb-4">Pronto para Começar?</h2>
          <p className="lead mb-4">
            Junte-se à nossa comunidade e tenha acesso a informações vitais que podem salvar vidas.
          </p>
          <Button as={Link} to="/register" variant="light" size="lg">
            Cadastre-se Agora
          </Button>
        </Container>
      </div>
    </div>
  );
};

export default Home; 