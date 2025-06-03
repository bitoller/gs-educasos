import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { kits } from '../services/api';
import UnauthorizedContent from '../components/UnauthorizedContent';

const EmergencyKits = () => {
  const [userKits, setUserKits] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadKits();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadKits = async () => {
    try {
      const response = await kits.getAll();
      setUserKits(response.data);
    } catch (err) {
      console.error('Error loading kits:', err);
      setError('Erro ao carregar os kits de emergência.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <UnauthorizedContent 
        title="Kits de Emergência"
        message="Faça login para criar e gerenciar seus kits de emergência personalizados. 
                Com uma conta, você pode salvar diferentes kits para diferentes situações e 
                receber recomendações baseadas no seu perfil."
      />
    );
  }

  if (loading) {
    return (
      <Container className="mt-5 pt-5">
        <div className="text-center">Carregando kits...</div>
      </Container>
    );
  }

  return (
    <Container className="mt-5 pt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Seus Kits de Emergência</h2>
        <Button as={Link} to="/emergency-kits/new" variant="primary">
          Criar Novo Kit
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {userKits.length === 0 ? (
        <Card className="text-center p-5">
          <Card.Body>
            <Card.Title>Nenhum Kit Encontrado</Card.Title>
            <Card.Text>
              Você ainda não tem nenhum kit de emergência. 
              Que tal criar seu primeiro kit agora?
            </Card.Text>
            <Button as={Link} to="/emergency-kits/new" variant="primary">
              Criar Primeiro Kit
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {userKits.map((kit) => (
            <Col key={kit.kitId}>
              <Card>
                <Card.Body>
                  <Card.Title>Kit {kit.kitId}</Card.Title>
                  <Card.Text>
                    <strong>Tipo de Residência:</strong> {kit.houseType}<br />
                    <strong>Região:</strong> {kit.region}<br />
                    <strong>Moradores:</strong> {kit.numResidents}
                  </Card.Text>
                  <div className="d-flex gap-2">
                    <Button variant="outline-primary" size="sm">
                      Ver Detalhes
                    </Button>
                    <Button variant="outline-danger" size="sm">
                      Excluir
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default EmergencyKits; 