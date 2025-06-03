import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Nav, Alert, Badge, ProgressBar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { kits, content } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const UserDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [userKits, setUserKits] = useState([]);
  const [learningProgress, setLearningProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      if (activeTab === 'kits') {
        const kitsResponse = await kits.getAll();
        setUserKits(kitsResponse.data.filter(kit => kit.userId === user.id));
      } else if (activeTab === 'learning') {
        const contentResponse = await content.getAll();
        // Simula o progresso do usuário (isso deve vir do backend em produção)
        const progress = contentResponse.data.map(item => ({
          ...item,
          progress: Math.floor(Math.random() * 100)
        }));
        setLearningProgress(progress);
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Erro ao carregar dados do dashboard.');
    } finally {
      setLoading(false);
    }
  };

  const renderProfile = () => (
    <Card>
      <Card.Body>
        <Row>
          <Col md={4} className="text-center mb-4">
            <div className="rounded-circle bg-secondary text-white d-inline-flex align-items-center justify-content-center" style={{ width: '150px', height: '150px', fontSize: '3rem' }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
          </Col>
          <Col md={8}>
            <h3>{user.name}</h3>
            <p className="text-muted">{user.email}</p>
            <hr />
            <h5>Informações Pessoais</h5>
            <Row>
              <Col sm={6}>
                <p><strong>Região:</strong> {user.region || 'Não informado'}</p>
                <p><strong>Cidade:</strong> {user.city || 'Não informado'}</p>
              </Col>
              <Col sm={6}>
                <p><strong>Membro desde:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                <p><strong>Último acesso:</strong> {new Date().toLocaleDateString()}</p>
              </Col>
            </Row>
            <Button variant="outline-primary" as={Link} to="/profile/edit">
              Editar Perfil
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );

  const renderKits = () => (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Meus Kits de Emergência</h4>
        <Button as={Link} to="/emergency-kits/new" variant="success">
          Criar Novo Kit
        </Button>
      </div>
      {userKits.length === 0 ? (
        <Alert variant="info">
          Você ainda não possui nenhum kit de emergência.{' '}
          <Link to="/emergency-kits/new">Crie seu primeiro kit agora!</Link>
        </Alert>
      ) : (
        <Row>
          {userKits.map(kit => (
            <Col md={6} lg={4} key={kit.kitId} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{kit.houseType}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {kit.region}
                  </Card.Subtitle>
                  <Card.Text>
                    <Badge bg="info">{kit.numResidents} moradores</Badge>
                  </Card.Text>
                  <Button
                    as={Link}
                    to={`/emergency-kits/${kit.kitId}`}
                    variant="outline-primary"
                    size="sm"
                  >
                    Ver Detalhes
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </>
  );

  const renderLearning = () => (
    <>
      <h4 className="mb-4">Meu Progresso de Aprendizagem</h4>
      {learningProgress.map(item => (
        <Card key={item.contentId} className="mb-3">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="mb-0">{item.title}</h5>
              <Badge bg={item.progress === 100 ? 'success' : 'primary'}>
                {item.progress}%
              </Badge>
            </div>
            <ProgressBar
              now={item.progress}
              variant={item.progress === 100 ? 'success' : 'primary'}
              className="mb-3"
            />
            <div className="d-flex justify-content-between align-items-center">
              <small className="text-muted">
                Tipo: {item.disasterType}
              </small>
              <Button
                as={Link}
                to={`/learn/${item.contentId}`}
                variant="outline-primary"
                size="sm"
              >
                {item.progress === 100 ? 'Revisar' : 'Continuar'}
              </Button>
            </div>
          </Card.Body>
        </Card>
      ))}
    </>
  );

  return (
    <Container className="mt-5 pt-5">
      <h2 className="mb-4">Meu Dashboard</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card>
        <Card.Header>
          <Nav variant="tabs">
            <Nav.Item>
              <Nav.Link
                active={activeTab === 'profile'}
                onClick={() => setActiveTab('profile')}
              >
                Perfil
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={activeTab === 'kits'}
                onClick={() => setActiveTab('kits')}
              >
                Kits de Emergência
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={activeTab === 'learning'}
                onClick={() => setActiveTab('learning')}
              >
                Progresso
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Card.Header>
        <Card.Body>
          {activeTab === 'profile' && renderProfile()}
          {activeTab === 'kits' && renderKits()}
          {activeTab === 'learning' && renderLearning()}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UserDashboard; 