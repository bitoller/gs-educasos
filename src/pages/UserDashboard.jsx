import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Nav, Alert, Badge, ProgressBar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { kits, content } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { FaUser, FaMedkit, FaBook, FaQuestionCircle, FaEdit, FaEye, FaRedo } from 'react-icons/fa';
import '../styles/dashboard.css';

const UserDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [userKits, setUserKits] = useState([]);
  const [learningProgress, setLearningProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Dashboard do Usuário - Disaster Awareness';
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
        const progress = contentResponse.data.map(item => ({
          ...item,
          progress: Math.floor(Math.random() * 100)
        }));
        setLearningProgress(progress);
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Erro ao carregar dados do dashboard. Por favor, tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const renderProfile = () => (
    <Card className="shadow-sm">
      <Card.Body>
        <Row>
          <Col md={4} className="text-center mb-4">
            <div 
              className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center" 
              style={{ width: '150px', height: '150px', fontSize: '3rem' }}
              role="img"
              aria-label={`Avatar de ${user.name}`}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
          </Col>
          <Col md={8}>
            <h3 className="mb-3">{user.name}</h3>
            <p className="text-muted mb-4">{user.email}</p>
            <hr className="my-4" />
            <h5 className="mb-4">Informações Pessoais</h5>
            <Row className="mb-4">
              <Col sm={6}>
                <dl>
                  <dt>Região</dt>
                  <dd>{user.region || 'Não informado'}</dd>
                  <dt>Cidade</dt>
                  <dd>{user.city || 'Não informado'}</dd>
                </dl>
              </Col>
              <Col sm={6}>
                <dl>
                  <dt>Membro desde</dt>
                  <dd>{new Date(user.createdAt).toLocaleDateString()}</dd>
                  <dt>Último acesso</dt>
                  <dd>{new Date().toLocaleDateString()}</dd>
                </dl>
              </Col>
            </Row>
            <Button 
              variant="primary"
              as={Link} 
              to="/profile/edit"
              className="d-flex align-items-center gap-2"
              aria-label="Editar perfil"
            >
              <FaEdit /> Editar Perfil
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
        <Button 
          as={Link} 
          to="/emergency-kits/new" 
          variant="success"
          className="d-flex align-items-center gap-2"
          aria-label="Criar novo kit de emergência"
        >
          <FaMedkit /> Criar Novo Kit
        </Button>
      </div>
      {userKits.length === 0 ? (
        <Alert variant="info" role="alert">
          <p className="mb-0">Você ainda não possui nenhum kit de emergência.</p>
          <Link to="/emergency-kits/new" className="alert-link">Crie seu primeiro kit agora!</Link>
        </Alert>
      ) : (
        <Row>
          {userKits.map(kit => (
            <Col md={6} lg={4} key={kit.kitId} className="mb-4">
              <Card className="h-100 shadow-sm hover-effect">
                <Card.Body>
                  <Card.Title className="h5 mb-3">{kit.houseType}</Card.Title>
                  <Card.Subtitle className="mb-3 text-muted">
                    {kit.region}
                  </Card.Subtitle>
                  <Card.Text>
                    <Badge bg="info" className="mb-3">
                      {kit.numResidents} {kit.numResidents === 1 ? 'morador' : 'moradores'}
                    </Badge>
                  </Card.Text>
                  <Button
                    as={Link}
                    to={`/emergency-kits/${kit.kitId}`}
                    variant="outline-primary"
                    className="d-flex align-items-center gap-2"
                    aria-label={`Ver detalhes do kit ${kit.houseType}`}
                  >
                    <FaEye /> Ver Detalhes
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
        <Card key={item.contentId} className="mb-3 shadow-sm hover-effect">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">{item.title}</h5>
              <Badge 
                bg={item.progress === 100 ? 'success' : 'primary'}
                aria-label={`Progresso: ${item.progress}%`}
              >
                {item.progress}%
              </Badge>
            </div>
            <ProgressBar
              now={item.progress}
              variant={item.progress === 100 ? 'success' : 'primary'}
              className="mb-3"
              aria-label={`Barra de progresso: ${item.progress}%`}
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
                className="d-flex align-items-center gap-2"
                aria-label={item.progress === 100 ? 'Revisar conteúdo' : 'Continuar aprendizado'}
              >
                {item.progress === 100 ? (
                  <>
                    <FaRedo /> Revisar
                  </>
                ) : (
                  <>
                    <FaBook /> Continuar
                  </>
                )}
              </Button>
            </div>
          </Card.Body>
        </Card>
      ))}
    </>
  );

  const renderQuizzes = () => (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Meus Quizzes</h4>
        <Button 
          as={Link} 
          to="/quizzes" 
          variant="success"
          className="d-flex align-items-center gap-2"
          aria-label="Fazer novo quiz"
        >
          <FaQuestionCircle /> Fazer Novo Quiz
        </Button>
      </div>

      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center shadow-sm hover-effect">
            <Card.Body>
              <h2 className="mb-0">{user.score || 0}</h2>
              <Card.Text>Pontuação Total</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center shadow-sm hover-effect">
            <Card.Body>
              <h2 className="mb-0">{user.completedQuizzes || 0}</h2>
              <Card.Text>Quizzes Completados</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center shadow-sm hover-effect">
            <Card.Body>
              <h2 className="mb-0">{user.averageScore || 0}%</h2>
              <Card.Text>Média de Acertos</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <Card.Header>
          <h5 className="mb-0">Histórico de Quizzes</h5>
        </Card.Header>
        <Card.Body>
          {user.quizHistory && user.quizHistory.length > 0 ? (
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th scope="col">Quiz</th>
                    <th scope="col">Pontuação</th>
                    <th scope="col">Data</th>
                    <th scope="col">Status</th>
                    <th scope="col">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {user.quizHistory.map((quiz) => (
                    <tr key={quiz.id}>
                      <td>{quiz.title}</td>
                      <td>{quiz.score}%</td>
                      <td>{new Date(quiz.completedAt).toLocaleDateString()}</td>
                      <td>
                        <Badge 
                          bg={quiz.score >= 70 ? 'success' : 'warning'}
                          aria-label={quiz.score >= 70 ? 'Aprovado' : 'Precisa Melhorar'}
                        >
                          {quiz.score >= 70 ? 'Aprovado' : 'Precisa Melhorar'}
                        </Badge>
                      </td>
                      <td>
                        <Button
                          as={Link}
                          to={`/quiz/${quiz.quizId}`}
                          variant="outline-primary"
                          size="sm"
                          className="d-flex align-items-center gap-2"
                          aria-label="Tentar quiz novamente"
                        >
                          <FaRedo /> Tentar Novamente
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <Alert variant="info" role="alert">
              <p className="mb-0">Você ainda não completou nenhum quiz.</p>
              <Link to="/quizzes" className="alert-link">Comece agora!</Link>
            </Alert>
          )}
        </Card.Body>
      </Card>
    </>
  );

  return (
    <Container className="mt-5 pt-5">
      <h2 className="mb-4 visually-hidden">Meu Dashboard</h2>

      {error && (
        <Alert variant="danger" role="alert" dismissible>
          {error}
        </Alert>
      )}

      <Card className="shadow">
        <Card.Body>
          <Nav 
            variant="tabs" 
            activeKey={activeTab} 
            onSelect={setActiveTab}
            className="mb-4"
            role="tablist"
          >
            <Nav.Item role="presentation">
              <Nav.Link 
                eventKey="profile"
                className="d-flex align-items-center gap-2"
                role="tab"
                aria-selected={activeTab === 'profile'}
              >
                <FaUser /> Perfil
              </Nav.Link>
            </Nav.Item>
            <Nav.Item role="presentation">
              <Nav.Link 
                eventKey="kits"
                className="d-flex align-items-center gap-2"
                role="tab"
                aria-selected={activeTab === 'kits'}
              >
                <FaMedkit /> Kits
              </Nav.Link>
            </Nav.Item>
            <Nav.Item role="presentation">
              <Nav.Link 
                eventKey="learning"
                className="d-flex align-items-center gap-2"
                role="tab"
                aria-selected={activeTab === 'learning'}
              >
                <FaBook /> Aprendizagem
              </Nav.Link>
            </Nav.Item>
            <Nav.Item role="presentation">
              <Nav.Link 
                eventKey="quizzes"
                className="d-flex align-items-center gap-2"
                role="tab"
                aria-selected={activeTab === 'quizzes'}
              >
                <FaQuestionCircle /> Quizzes
              </Nav.Link>
            </Nav.Item>
          </Nav>

          {loading ? (
            <div className="text-center p-5">
              <div 
                className="spinner-border text-primary" 
                role="status"
                style={{ width: '3rem', height: '3rem' }}
              >
                <span className="visually-hidden">Carregando...</span>
              </div>
            </div>
          ) : (
            <div role="tabpanel">
              {activeTab === 'profile' && renderProfile()}
              {activeTab === 'kits' && renderKits()}
              {activeTab === 'learning' && renderLearning()}
              {activeTab === 'quizzes' && renderQuizzes()}
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UserDashboard; 