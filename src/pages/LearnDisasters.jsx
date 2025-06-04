import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, ButtonGroup, Alert, Spinner } from 'react-bootstrap';
import { content } from '../services/api';
import { Link } from 'react-router-dom';

const LearnDisasters = () => {
  const [disasterContent, setDisasterContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uniqueTypes, setUniqueTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const isAuthenticated = localStorage.getItem('token');

  useEffect(() => {
    loadAllContent();
  }, []);

  const loadAllContent = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await content.getAll();
      console.log('Content received from backend:', response.data);
      
      if (!response.data || response.data.length === 0) {
        setError('Nenhuma informação encontrada. Por favor, tente novamente mais tarde.');
        setDisasterContent([]);
      } else {
        // Extrair tipos únicos de desastres do conteúdo
        const types = [...new Set(response.data.map(item => item.disasterType))];
        setUniqueTypes(types);
        setSelectedType(types[0]); // Seleciona o primeiro tipo por padrão
        setDisasterContent(response.data);
      }
    } catch (err) {
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        url: err.config?.url
      });
      setError('Erro ao carregar informações. Por favor, tente novamente mais tarde.');
      setDisasterContent([]);
    } finally {
      setLoading(false);
    }
  };

  // Função para obter a cor do gradiente baseada no tipo de desastre
  const getGradient = (type) => {
    const gradients = {
      ENCHENTE: 'linear-gradient(135deg, #48CAE4 0%, #0096C7 100%)',
      TERREMOTO: 'linear-gradient(135deg, #B45309 0%, #92400E 100%)',
      INCENDIO: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)',
      FURACAO: 'linear-gradient(135deg, #1E40AF 0%, #1E3A8A 100%)',
      TORNADO: 'linear-gradient(135deg, #1E40AF 0%, #1E3A8A 100%)',
      default: 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)'
    };
    return gradients[type] || gradients.default;
  };

  // Função para obter o ícone baseado no tipo de desastre
  const getIcon = (type) => {
    const icons = {
      ENCHENTE: '🌊',
      TERREMOTO: '🏚️',
      INCENDIO: '🔥',
      FURACAO: '🌪️',
      TORNADO: '🌪️',
      default: '⚠️'
    };
    return icons[type] || icons.default;
  };

  // Função para obter a variante do botão baseada no tipo de desastre
  const getButtonVariant = (type) => {
    const variants = {
      ENCHENTE: 'info',
      TERREMOTO: 'warning',
      INCENDIO: 'danger',
      FURACAO: 'primary',
      TORNADO: 'info',
      default: 'secondary'
    };
    return variants[type] || variants.default;
  };

  const renderAuthButtons = () => (
    <div className="text-center mb-4">
      <Alert variant="info" className="d-flex flex-column align-items-center">
        <p className="mb-3">Para acessar os quizzes e testar seus conhecimentos, faça login ou cadastre-se:</p>
        <div className="d-flex gap-3">
          <Link to="/login">
            <Button variant="primary">
              Fazer Login
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="outline-primary">
              Cadastrar-se
            </Button>
          </Link>
        </div>
      </Alert>
    </div>
  );

  if (loading) {
    return (
      <Container className="mt-5 pt-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Carregando...</span>
        </Spinner>
      </Container>
    );
  }

  const filteredContent = selectedType 
    ? disasterContent.filter(item => item.disasterType === selectedType)
    : disasterContent;

  return (
    <Container fluid className="mt-5 pt-4 px-4">
      <Row className="justify-content-center mb-5">
        <Col md={10}>
          <div className="text-center">
            <h1 className="display-4 mb-4">
              {selectedType ? `${getIcon(selectedType)} Aprenda Sobre ${selectedType}` : 'Aprenda Sobre Desastres Naturais'}
            </h1>
            <p className="lead mb-5">
              Entenda os riscos e aprenda como se preparar para diferentes tipos de desastres naturais
            </p>
          </div>

          <div className="text-center mb-5">
            <ButtonGroup className="flex-wrap">
              {uniqueTypes.map((type) => (
                <Button
                  key={type}
                  variant={selectedType === type ? getButtonVariant(type) : `outline-${getButtonVariant(type)}`}
                  onClick={() => setSelectedType(type)}
                  className="px-4 py-2 d-flex align-items-center"
                  style={{ minWidth: '160px' }}
                >
                  <span className="me-2">{getIcon(type)}</span>
                  {type}
                </Button>
              ))}
            </ButtonGroup>
          </div>

          {!isAuthenticated && renderAuthButtons()}

          {error && <Alert variant="danger">{error}</Alert>}

          {filteredContent.map((disaster, index) => (
            <Card 
              key={index} 
              className="mb-5 border-0 overflow-hidden"
              style={{
                background: getGradient(disaster.disasterType),
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
              }}
            >
              <Card.Body className="p-0">
                <Row className="g-0">
                  <Col lg={6} className="p-4">
                    <div className="ratio ratio-16x9 mb-4 rounded overflow-hidden shadow">
                      <iframe
                        src={disaster.videoUrl}
                        title={disaster.title}
                        allowFullScreen
                        className="rounded"
                      ></iframe>
                    </div>
                  </Col>

                  <Col lg={6} className="p-4" style={{ background: 'rgba(255, 255, 255, 0.9)' }}>
                    <h2 className="mb-4">{disaster.title}</h2>
                    <div className="mb-4 lead" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                      {disaster.description}
                    </div>

                    <div className="d-grid gap-3 mb-4">
                      {isAuthenticated ? (
                        <Button
                          variant="primary"
                          href={`/quizzes?type=${disaster.disasterType}`}
                          className="d-flex align-items-center justify-content-center"
                        >
                          <span className="me-2">📝</span>
                          Fazer Quiz sobre {disaster.disasterType}
                        </Button>
                      ) : (
                        <Button
                          variant="primary"
                          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                          className="d-flex align-items-center justify-content-center"
                        >
                          <span className="me-2">📝</span>
                          Faça login para acessar o Quiz
                        </Button>
                      )}
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default LearnDisasters; 