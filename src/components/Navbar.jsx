import React, { useState, useEffect } from "react";
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
  faEnvelope,
  faUser,
  faSignOutAlt,
  faShieldAlt,
  faTrophy,
  faBoxes,
  faHeartbeat,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
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
    navigate("/");
  };

  const navItems = [
    { path: "/", text: "Início", icon: faHome },
    { path: "/learn", text: "Aprenda", icon: faBook },
    { path: "/quizzes", text: "Quizzes", icon: faQuestionCircle },
    { path: "/emergency-kits", text: "Kits de Emergência", icon: faFirstAid },
    { path: "/about", text: "Sobre", icon: faInfoCircle },
    { path: "/contact", text: "Contato", icon: faEnvelope },
  ];

  const userMenuItems = [
    {
      path: isAdmin ? "/admin" : "/dashboard",
      text: isAdmin ? "Dashboard Admin" : "Meu Dashboard",
      icon: isAdmin ? faShieldAlt : faTrophy,
    },
    { path: "/profile", text: "Meu Perfil", icon: faUser },
    { path: "/my-kits", text: "Meus Kits", icon: faBoxes },
  ];

  return (
    <Navbar
      expand="lg"
      fixed="top"
      className={`navbar ${scrolled ? "scrolled" : ""}`}
    >
      <Container>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Navbar.Brand as={Link} to="/">
            <FontAwesomeIcon icon={faHeartbeat} className="brand-icon" />
            <span className="brand-text">
              <span className="brand-educa">Educa</span>
              <span className="brand-sos">SOS</span>
            </span>
          </Navbar.Brand>
        </motion.div>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {navItems.map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Nav.Link
                  as={Link}
                  to={item.path}
                  className={location.pathname === item.path ? "active" : ""}
                >
                  <FontAwesomeIcon icon={item.icon} className="me-2" />
                  {item.text}
                </Nav.Link>
              </motion.div>
            ))}
          </Nav>

          <Nav className="ms-auto">
            {user ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
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
              </motion.div>
            ) : (
              <motion.div
                className="d-flex gap-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Button as={Link} to="/login" variant="outline-light">
                  Entrar
                </Button>
                <Button as={Link} to="/register" variant="light">
                  Cadastrar
                </Button>
              </motion.div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
