import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, ButtonGroup, Alert, Spinner } from 'react-bootstrap';
import { content } from '../services/api';

const DISASTER_TYPES = {
  FLOOD: { 
    name: 'Enchente', 
    color: 'info',
    icon: '🌊',
    bgColor: 'linear-gradient(135deg, #48CAE4 0%, #0096C7 100%)'
  },
  LANDSLIDE: { 
    name: 'Deslizamento', 
    color: 'warning',
    icon: '⛰️',
    bgColor: 'linear-gradient(135deg, #B45309 0%, #92400E 100%)'
  },
  WILDFIRE: { 
    name: 'Queimada', 
    color: 'danger',
    icon: '🔥',
    bgColor: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)'
  },
  DROUGHT: { 
    name: 'Seca', 
    color: 'warning',
    icon: '☀️',
    bgColor: 'linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%)'
  },
  STORM: { 
    name: 'Tempestade', 
    color: 'primary',
    icon: '⛈️',
    bgColor: 'linear-gradient(135deg, #1E40AF 0%, #1E3A8A 100%)'
  }
};

const LearnDisasters = () => {
  const [selectedType, setSelectedType] = useState('FLOOD');
  const [disasterContent, setDisasterContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showTips, setShowTips] = useState(null);

  useEffect(() => {
    loadContent();
  }, [selectedType]);

  const loadContent = async () => {
    try {
      setLoading(true);
      setError('');
      console.log(`Fetching content for disaster type: ${selectedType}`);
      const response = await content.getByDisasterType(selectedType);
      console.log('Content received from backend:', response.data);
      
      if (!response.data || response.data.length === 0) {
        setError(`Nenhuma informação encontrada para ${DISASTER_TYPES[selectedType].name}. Por favor, tente outro tipo de desastre.`);
        setDisasterContent([]);
      } else {
        setDisasterContent(response.data);
      }
    } catch (err) {
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      setError(`Erro ao carregar informações sobre ${DISASTER_TYPES[selectedType].name}. Por favor, tente novamente mais tarde.`);
      setDisasterContent([]);
    } finally {
      setLoading(false);
    }
  };

  const renderTipsSection = (tips, title, icon) => (
    <div className="tips-section p-4 rounded shadow-sm mb-4" style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
      <h4 className="mb-3 d-flex align-items-center">
        <span className="me-2">{icon}</span>
        {title}
      </h4>
      <ul className="list-unstyled">
        {tips.map((tip, index) => (
          <li key={index} className="mb-3 d-flex align-items-start">
            <span className="me-3 text-success">✓</span>
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  if (loading) {
    return (
      <Container className="mt-5 pt-5 text-center">
        <Spinner animation="border" role="status" variant={DISASTER_TYPES[selectedType].color}>
          <span className="visually-hidden">Carregando...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container fluid className="mt-5 pt-4 px-4">
      <Row className="justify-content-center mb-5">
        <Col md={10}>
          <div className="text-center">
            <h1 className="display-4 mb-4">
              {DISASTER_TYPES[selectedType].icon} Aprenda Sobre {DISASTER_TYPES[selectedType].name}
            </h1>
            <p className="lead mb-5">
              Entenda os riscos e aprenda como se preparar para diferentes tipos de desastres naturais
            </p>
          </div>

          <div className="text-center mb-5">
            <ButtonGroup className="flex-wrap">
              {Object.entries(DISASTER_TYPES).map(([type, info]) => (
                <Button
                  key={type}
                  variant={selectedType === type ? info.color : `outline-${info.color}`}
                  onClick={() => setSelectedType(type)}
                  className="px-4 py-2 d-flex align-items-center"
                  style={{ minWidth: '160px' }}
                >
                  <span className="me-2">{info.icon}</span>
                  {info.name}
                </Button>
              ))}
            </ButtonGroup>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          {disasterContent.map((disaster, index) => (
            <Card 
              key={index} 
              className="mb-5 border-0 overflow-hidden"
              style={{
                background: DISASTER_TYPES[selectedType].bgColor,
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
                    {disaster.imageUrl && (
                      <img
                        src={disaster.imageUrl}
                        alt={disaster.title}
                        className="img-fluid rounded shadow mb-4"
                        style={{ width: '100%', objectFit: 'cover' }}
                      />
                    )}
                  </Col>

                  <Col lg={6} className="p-4" style={{ background: 'rgba(255, 255, 255, 0.9)' }}>
                    <h2 className="mb-4">{disaster.title}</h2>
                    <div className="mb-4 lead" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                      {disaster.description}
                    </div>

                    <div className="d-grid gap-3 mb-4">
                      <Button
                        variant={`outline-${DISASTER_TYPES[selectedType].color}`}
                        onClick={() => setShowTips(showTips === 'before' ? null : 'before')}
                        className="d-flex align-items-center justify-content-center"
                      >
                        <span className="me-2">⚡</span>
                        O que fazer antes
                      </Button>
                      <Button
                        variant={`outline-${DISASTER_TYPES[selectedType].color}`}
                        onClick={() => setShowTips(showTips === 'during' ? null : 'during')}
                        className="d-flex align-items-center justify-content-center"
                      >
                        <span className="me-2">⚠️</span>
                        O que fazer durante
                      </Button>
                      <Button
                        variant={`outline-${DISASTER_TYPES[selectedType].color}`}
                        onClick={() => setShowTips(showTips === 'after' ? null : 'after')}
                        className="d-flex align-items-center justify-content-center"
                      >
                        <span className="me-2">🔄</span>
                        O que fazer depois
                      </Button>
                    </div>

                    {showTips === 'before' && disaster.beforeTips && (
                      renderTipsSection(disaster.beforeTips, 'O que fazer antes', '⚡')
                    )}
                    {showTips === 'during' && disaster.duringTips && (
                      renderTipsSection(disaster.duringTips, 'O que fazer durante', '⚠️')
                    )}
                    {showTips === 'after' && disaster.afterTips && (
                      renderTipsSection(disaster.afterTips, 'O que fazer depois', '🔄')
                    )}
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