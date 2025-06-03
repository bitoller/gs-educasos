import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, ButtonGroup, Alert, Spinner } from 'react-bootstrap';
import { content } from '../services/api';

const DISASTER_TYPES = {
  FLOOD: { name: 'Enchente', color: 'info' },
  LANDSLIDE: { name: 'Deslizamento', color: 'warning' },
  WILDFIRE: { name: 'Queimada', color: 'danger' },
  DROUGHT: { name: 'Seca', color: 'warning' },
  STORM: { name: 'Tempestade', color: 'primary' }
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
      const response = await content.getByDisasterType(selectedType);
      setDisasterContent(response.data);
    } catch (err) {
      console.error('Error loading disaster content:', err);
      setError('Erro ao carregar informações sobre o desastre.');
    } finally {
      setLoading(false);
    }
  };

  const renderTipsSection = (tips, title) => (
    <div className="tips-section p-4 bg-light rounded">
      <h4 className="mb-3">{title}</h4>
      <ul className="list-unstyled">
        {tips.map((tip, index) => (
          <li key={index} className="mb-2">
            <i className="bi bi-check2-circle text-success me-2"></i>
            {tip}
          </li>
        ))}
      </ul>
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

  return (
    <Container className="mt-5 pt-5">
      <h2 className="text-center mb-4">Aprenda Sobre Desastres</h2>
      
      {/* Filtros */}
      <div className="text-center mb-5">
        <ButtonGroup>
          {Object.entries(DISASTER_TYPES).map(([type, info]) => (
            <Button
              key={type}
              variant={selectedType === type ? info.color : `outline-${info.color}`}
              onClick={() => setSelectedType(type)}
              className="px-4"
            >
              {info.name}
            </Button>
          ))}
        </ButtonGroup>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {disasterContent.map((disaster, index) => (
        <Card key={index} className="mb-5 border-0 shadow-sm">
          <Card.Body>
            <Row>
              {/* Vídeo e Imagem */}
              <Col lg={6}>
                <div className="ratio ratio-16x9 mb-4">
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
                    className="img-fluid rounded mb-4"
                  />
                )}
              </Col>

              {/* Conteúdo */}
              <Col lg={6}>
                <h3 className="mb-4">{disaster.title}</h3>
                <div className="mb-4 lead">{disaster.description}</div>

                {/* Botões de Dicas */}
                <div className="d-grid gap-3">
                  <Button
                    variant="outline-primary"
                    onClick={() => setShowTips(showTips === 'before' ? null : 'before')}
                  >
                    O que fazer antes
                  </Button>
                  <Button
                    variant="outline-warning"
                    onClick={() => setShowTips(showTips === 'during' ? null : 'during')}
                  >
                    O que fazer durante
                  </Button>
                  <Button
                    variant="outline-success"
                    onClick={() => setShowTips(showTips === 'after' ? null : 'after')}
                  >
                    O que fazer depois
                  </Button>
                </div>

                {/* Seções de Dicas */}
                {showTips === 'before' && disaster.beforeTips && (
                  renderTipsSection(disaster.beforeTips, 'O que fazer antes')
                )}
                {showTips === 'during' && disaster.duringTips && (
                  renderTipsSection(disaster.duringTips, 'O que fazer durante')
                )}
                {showTips === 'after' && disaster.afterTips && (
                  renderTipsSection(disaster.afterTips, 'O que fazer depois')
                )}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default LearnDisasters; 