import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Nav,
  Alert,
  Badge,
  ProgressBar,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { kits, content, auth } from "../services/api";
import {
  FaUser,
  FaMedkit,
  FaBook,
  FaQuestionCircle,
  FaEdit,
  FaEye,
  FaRedo,
} from "react-icons/fa";
import "../styles/dashboard.css";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [userKits, setUserKits] = useState([]);
  const [learningProgress, setLearningProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Dashboard do Usuário - Disaster Awareness";
    loadData();
  }, [activeTab]);

  const refreshUserData = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        navigate("/login");
        return;
      }

      const localData = JSON.parse(storedUser);
      setUserData(localData);

      if (activeTab === "quizzes") {
        const response = await auth.getUserData();
        setUserData(response.data);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUserData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      if (activeTab === "kits") {
        const kitsResponse = await kits.getAll();
        setUserKits(
          kitsResponse.data.filter((kit) => kit.userId === userData.id)
        );
      } else if (activeTab === "learning") {
        const contentResponse = await content.getAll();
        const progress = contentResponse.data.map((item) => ({
          ...item,
          progress: Math.floor(Math.random() * 100),
        }));
        setLearningProgress(progress);
      }
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setError(
        "Erro ao carregar dados do dashboard. Por favor, tente novamente mais tarde."
      );
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
              style={{ width: "150px", height: "150px", fontSize: "3rem" }}
              role="img"
              aria-label={`Avatar de ${userData.name}`}
            >
              {userData.name.charAt(0).toUpperCase()}
            </div>
          </Col>
          <Col md={8}>
            <h3 className="mb-3">{userData.name}</h3>
            <p className="text-muted mb-4">{userData.email}</p>
            <hr className="my-4" />
            <h5 className="mb-4">Informações Pessoais</h5>
            <Row className="mb-4">
              <Col sm={6}>
                <dl>
                  <dt>Região</dt>
                  <dd>{userData.region || "Não informado"}</dd>
                  <dt>Cidade</dt>
                  <dd>{userData.city || "Não informado"}</dd>
                </dl>
              </Col>
              <Col sm={6}>
                <dl>
                  <dt>Membro desde</dt>
                  <dd>{new Date(userData.createdAt).toLocaleDateString()}</dd>
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
          <p className="mb-0">
            Você ainda não possui nenhum kit de emergência.
          </p>
          <Link to="/emergency-kits/new" className="alert-link">
            Crie seu primeiro kit agora!
          </Link>
        </Alert>
      ) : (
        <Row>
          {userKits.map((kit) => (
            <Col md={6} lg={4} key={kit.kitId} className="mb-4">
              <Card className="h-100 shadow-sm hover-effect">
                <Card.Body>
                  <Card.Title className="h5 mb-3">{kit.houseType}</Card.Title>
                  <Card.Subtitle className="mb-3 text-muted">
                    {kit.region}
                  </Card.Subtitle>
                  <Card.Text>
                    <Badge bg="info" className="mb-3">
                      {kit.numResidents}{" "}
                      {kit.numResidents === 1 ? "morador" : "moradores"}
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
      {learningProgress.map((item) => (
        <Card key={item.contentId} className="mb-3 shadow-sm hover-effect">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">{item.title}</h5>
              <Badge
                bg={item.progress === 100 ? "success" : "primary"}
                aria-label={`Progresso: ${item.progress}%`}
              >
                {item.progress}%
              </Badge>
            </div>
            <ProgressBar
              now={item.progress}
              variant={item.progress === 100 ? "success" : "primary"}
              className="mb-3"
              aria-label={`Barra de progresso: ${item.progress}%`}
            />
            <div className="d-flex justify-content-between align-items-center">
              <small className="text-muted">Tipo: {item.disasterType}</small>
              <Button
                as={Link}
                to={`/learn/${item.contentId}`}
                variant="outline-primary"
                size="sm"
                className="d-flex align-items-center gap-2"
                aria-label={
                  item.progress === 100
                    ? "Revisar conteúdo"
                    : "Continuar aprendizado"
                }
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
      </div>
      <Card className="shadow-sm">
        <Card.Body>
          {" "}
          <div className="mb-4 text-center">
            <h5>Pontuação Total</h5>
            <h2>{userData?.score || userData?.totalScore || 0} pontos</h2>
          </div>
          <Link to="/quizzes" className="btn btn-primary">
            Ver Todos os Quizzes
          </Link>
        </Card.Body>
      </Card>
    </>
  );

  if (loading && !userData) {
    return (
      <Container className="mt-4">
        <Alert variant="info">Carregando dados do usuário...</Alert>
      </Container>
    );
  }
  return (
    <Container className="pt-3 pb-5">
      <Row className="mb-4">
        <Col>
          <h2 className="mb-4">Dashboard</h2>
          <Nav variant="tabs" className="mb-4" activeKey={activeTab}>
            <Nav.Item>
              <Nav.Link
                eventKey="profile"
                onClick={() => setActiveTab("profile")}
                className="d-flex align-items-center gap-2"
              >
                <FaUser /> Perfil
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="kits"
                onClick={() => setActiveTab("kits")}
                className="d-flex align-items-center gap-2"
              >
                <FaMedkit /> Kits
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="learning"
                onClick={() => setActiveTab("learning")}
                className="d-flex align-items-center gap-2"
              >
                <FaBook /> Aprendizado
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="quizzes"
                onClick={() => {
                  setActiveTab("quizzes");
                  loadData();
                }}
                className="d-flex align-items-center gap-2"
              >
                <FaQuestionCircle /> Quizzes
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      ) : (
        <Row>
          <Col>
            {activeTab === "profile" && renderProfile()}
            {activeTab === "kits" && renderKits()}
            {activeTab === "learning" && renderLearning()}
            {activeTab === "quizzes" && renderQuizzes()}
          </Col>
        </Row>
      )}

      {error && (
        <Alert variant="warning" className="mt-4">
          {error}
        </Alert>
      )}
    </Container>
  );
};

export default UserDashboard;
