import { useState, useEffect } from "react";
import { Navbar, Nav, Container, Button, NavDropdown } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faBook,
  faQuestionCircle,
  faFirstAid,
  faInfoCircle,
  faUser,
  faSignOutAlt,
  faShieldAlt,
  faTrophy,
  faHeartbeat,
  faBoxes,
  faExclamationTriangle, // Para alertas
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "../styles/Navbar.css";

const NavigationBar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  const handleLogout = () => {
    logout();
    toast.info("Logout realizado com sucesso!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      icon: "👋",
      style: {
        background: "rgba(33, 37, 41, 0.95)",
        color: "#fff",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
      },
      onClose: () => {
        navigate("/");
      },
    });
  };

  const navItems = [
    { path: "/", text: "Início", icon: faHome },
    { path: "/learn", text: "Aprenda", icon: faBook },
    { path: "/quizzes", text: "Quizzes", icon: faQuestionCircle },
    { path: "/emergency-kits", text: "Kits de Emergência", icon: faFirstAid },
    { path: "/about", text: "Sobre", icon: faInfoCircle },
    { path: "/alerts", text: "Alertas", icon: faExclamationTriangle }, // Nova página de alertas
  ];

  const userMenuItems = [
    {
      path: isAdmin ? "/admin" : "/dashboard",
      text: isAdmin ? "Dashboard Admin" : "Meu Dashboard",
      icon: isAdmin ? faShieldAlt : faTrophy,
    },
    { path: "/emergency-kits", text: "Meus Kits", icon: faBoxes },
  ];

  return (
    <Navbar
      expand="lg"
      fixed="top"
      className={`navbar ${scrolled ? "scrolled" : ""}`}
    >
      <Container>
        <Navbar.Brand as={Link} to="/">
          <FontAwesomeIcon icon={faHeartbeat} className="brand-icon" />
          <span className="brand-text">
            <span className="brand-educa">Educa</span>
            <span className="brand-sos">SOS</span>
          </span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {navItems.map((item) => (
              <div key={item.path}>
                <Nav.Link
                  as={Link}
                  to={item.path}
                  className={location.pathname === item.path ? "active" : ""}
                >
                  <FontAwesomeIcon icon={item.icon} className="me-2" />
                  {item.text}
                </Nav.Link>
              </div>
            ))}
          </Nav>

          <Nav className="ms-auto">
            {user ? (
              <NavDropdown
                title={
                  <span>
                    <FontAwesomeIcon icon={faUser} className="me-2" />
                    {`Olá, ${user.name}`}
                  </span>
                }
                id="basic-nav-dropdown"
              >
                {userMenuItems.map((item) => (
                  <NavDropdown.Item key={item.path} as={Link} to={item.path}>
                    <FontAwesomeIcon icon={item.icon} className="me-2" />
                    {item.text}
                  </NavDropdown.Item>
                ))}
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                  Sair
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <div className="d-flex gap-2">
                <Button as={Link} to="/login" variant="outline-light">
                  Entrar
                </Button>
                <Button as={Link} to="/register" variant="light">
                  Cadastrar
                </Button>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
