import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Nav,
  Alert,
  Badge,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { kits, auth } from "../services/api";
import { FaUser, FaMedkit, FaQuestionCircle, FaEye } from "react-icons/fa";
import "../styles/dashboard.css";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [userKits, setUserKits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      if (activeTab === "kits") {
        const kitsResponse = await kits.getAll();
        const processedKits = Array.isArray(kitsResponse.data)
          ? kitsResponse.data.map((kit) => ({
              ...kit,
              id: kit.id || kit.kitId,
              kitId: kit.kitId || kit.id,
              numResidents: kit.numResidents || kit.residents || 0,
              houseType: kit.houseType || "OUTRO",
              region: kit.region || "SUDESTE",
            }))
          : [];
        setUserKits(processedKits);
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
            <p className="mb-4" style={{ color: "#f1f1f1" }}>
              {userData.email}
            </p>
            <div className="mb-4">
              <strong>Último acesso:</strong> {new Date().toLocaleDateString()}
            </div>
            <hr className="my-4" />
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );

  const renderKits = () => (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 style={{ color: "#f8f9fa" }}>Meus Kits de Emergência</h4>
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
                  <Card.Subtitle className="mb-3 ">{kit.region}</Card.Subtitle>
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

  const renderQuizzes = () => (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 style={{ color: "#f8f9fa" }}>Meus Quizzes</h4>
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
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1a1c2e 0%, #16213e 100%)",
      }}
    >
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
    </div>
  );
};

export default UserDashboard;
