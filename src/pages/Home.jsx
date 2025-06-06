import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Spinner,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShieldAlt,
  faFirstAid,
  faInfoCircle,
  faExclamationTriangle,
  faTrophy,
  faMedal,
  faStar,
  faArrowRight,
  faGlobe,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { leaderboard } from "../services/api";
import { motion } from "framer-motion";

const Home = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    users: "10K+",
    lessons: "50+",
    countries: "25+",
  });

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const response = await leaderboard.get();
      setLeaders(response.data);
    } catch (error) {
      console.error("Erro ao carregar o ranking:", error);
    } finally {
      setLoading(false);
    }
  };

  const getMedalIcon = (position) => {
    switch (position) {
      case 0:
        return <FontAwesomeIcon icon={faTrophy} className="text-warning" />;
      case 1:
        return <FontAwesomeIcon icon={faMedal} className="text-secondary" />;
      case 2:
        return <FontAwesomeIcon icon={faMedal} className="text-bronze" />;
      default:
        return <FontAwesomeIcon icon={faStar} className="text-info" />;
    }
  };

  return (
    <div className="home-page">
      <motion.div
        className="hero-section text-white text-center d-flex align-items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Container>
          <motion.h1
            className="display-3 fw-bold mb-4"
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Mantenha-se Seguro, Mantenha-se Preparado
          </motion.h1>
          <motion.p
            className="lead mb-4"
            initial={{ y: -30 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Informe-se sobre desastres naturais e aprenda como se preparar e
            proteger seus entes queridos.
          </motion.p>
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="d-flex justify-content-center gap-3 flex-wrap"
          >
            <Button
              as={Link}
              to="/emergency-kits"
              variant="primary"
              size="lg"
              className="px-4"
            >
              Monte seu Kit de Emergência{" "}
              <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
            </Button>
            <Button
              as={Link}
              to="/learn"
              variant="outline-light"
              size="lg"
              className="px-4"
            >
              Aprenda Sobre Desastres{" "}
              <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
            </Button>
          </motion.div>

          <motion.div
            className="mt-5 pt-5"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <Row className="justify-content-center">
              <Col md={4} className="text-center mb-4 mb-md-0">
                <div className="stat-item">
                  <FontAwesomeIcon icon={faUsers} className="display-4 mb-3" />
                  <h3 className="h2 mb-2">{stats.users}</h3>
                  <p className="text-secondary mb-0">Usuários Ativos</p>
                </div>
              </Col>
              <Col md={4} className="text-center mb-4 mb-md-0">
                <div className="stat-item">
                  <FontAwesomeIcon
                    icon={faInfoCircle}
                    className="display-4 mb-3"
                  />
                  <h3 className="h2 mb-2">{stats.lessons}</h3>
                  <p className="text-secondary mb-0">Lições Disponíveis</p>
                </div>
              </Col>
              <Col md={4} className="text-center">
                <div className="stat-item">
                  <FontAwesomeIcon icon={faGlobe} className="display-4 mb-3" />
                  <h3 className="h2 mb-2">{stats.countries}</h3>
                  <p className="text-secondary mb-0">Países Alcançados</p>
                </div>
              </Col>
            </Row>
          </motion.div>
        </Container>
      </motion.div>

      <Container className="py-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-center mb-5">
            Por que Escolher Nossa Plataforma?
          </h2>
          <Row className="g-4">
            <Col md={3}>
              <Card className="h-100 text-center feature-card">
                <Card.Body>
                  <FontAwesomeIcon
                    icon={faShieldAlt}
                    size="3x"
                    className="mb-3 text-primary"
                  />
                  <Card.Title>Proteção</Card.Title>
                  <Card.Text>
                    Aprenda como proteger você e sua família durante
                    emergências.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="h-100 text-center feature-card">
                <Card.Body>
                  <FontAwesomeIcon
                    icon={faFirstAid}
                    size="3x"
                    className="mb-3 text-danger"
                  />
                  <Card.Title>Kits de Emergência</Card.Title>
                  <Card.Text>
                    Receba recomendações personalizadas de kits de emergência
                    baseadas nas suas necessidades.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="h-100 text-center feature-card">
                <Card.Body>
                  <FontAwesomeIcon
                    icon={faInfoCircle}
                    size="3x"
                    className="mb-3 text-info"
                  />
                  <Card.Title>Informação</Card.Title>
                  <Card.Text>
                    Acesse informações completas sobre diversos tipos de
                    desastres.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="h-100 text-center feature-card">
                <Card.Body>
                  <FontAwesomeIcon
                    icon={faExclamationTriangle}
                    size="3x"
                    className="mb-3 text-warning"
                  />
                  <Card.Title>Alertas</Card.Title>
                  <Card.Text>
                    Mantenha-se atualizado com alertas em tempo real sobre
                    possíveis desastres.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </motion.div>
      </Container>

      <Container className="py-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="leaderboard-section"
        >
          <h2 className="text-center mb-5">
            <FontAwesomeIcon icon={faTrophy} className="text-warning me-2" />
            Ranking dos Usuários
          </h2>
          <Row className="justify-content-center">
            <Col md={10}>
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" role="status" variant="primary">
                    <span className="visually-hidden">Carregando...</span>
                  </Spinner>
                </div>
              ) : (
                <Table hover responsive className="leaderboard-table">
                  <thead>
                    <tr>
                      <th style={{ color: "var(--accent-color)" }}>#</th>
                      <th style={{ color: "var(--accent-color)" }}>Usuário</th>
                      <th style={{ color: "var(--accent-color)" }}>Pontuação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaders.slice(0, 5).map((user, index) => (
                      <motion.tr
                        key={user.userId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        style={{
                          background:
                            index === 0
                              ? "linear-gradient(90deg, #1e293b 60%, #2563eb 100%)"
                              : index === 1
                              ? "linear-gradient(90deg, #1e293b 60%, #7c3aed 100%)"
                              : index === 2
                              ? "linear-gradient(90deg, #1e293b 60%, #0891b2 100%)"
                              : "rgba(30,41,59,0.7)",
                        }}
                      >
                        <td
                          style={{
                            fontWeight: 700,
                            color: "var(--primary-color)",
                          }}
                        >
                          {getMedalIcon(index)}
                        </td>
                        <td
                          style={{
                            fontWeight: 500,
                            color: "var(--text-primary)",
                          }}
                        >
                          {user.name}
                        </td>
                        <td
                          style={{
                            fontWeight: 600,
                            color: "var(--accent-color)",
                          }}
                        >
                          {user.score} pts
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Col>
          </Row>
          {leaders.length > 5 && (
            <div style={{ maxHeight: 240, overflowY: "auto", marginTop: 0 }}>
              <Table
                hover
                responsive
                className="leaderboard-table"
                style={{ marginBottom: 0 }}
              >
                <tbody>
                  {leaders.slice(5).map((user, index) => (
                    <tr
                      key={user.userId}
                      style={{ background: "rgba(30,41,59,0.5)" }}
                    >
                      <td
                        style={{
                          fontWeight: 700,
                          color: "var(--primary-color)",
                        }}
                      >
                        {index + 6}
                      </td>
                      <td
                        style={{
                          fontWeight: 500,
                          color: "var(--text-primary)",
                        }}
                      >
                        {user.name}
                      </td>
                      <td
                        style={{
                          fontWeight: 600,
                          color: "var(--accent-color)",
                        }}
                      >
                        {user.score} pts
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </motion.div>
      </Container>

      <motion.div
        className="cta-section text-white text-center py-5"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <Container>
          <h2 className="mb-4">Pronto para Começar?</h2>
          <p className="lead mb-4">
            Junte-se à nossa comunidade e tenha acesso a informações vitais que
            podem salvar vidas.
          </p>
          <Button
            as={Link}
            to="/register"
            variant="primary"
            size="lg"
            className="px-4 py-3"
          >
            Cadastre-se Agora{" "}
            <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
          </Button>
        </Container>
      </motion.div>
    </div>
  );
};

export default Home;
