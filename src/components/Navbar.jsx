import React from 'react';
import { Navbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const NavigationBar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="fixed-top">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Conscientização de Desastres
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Início</Nav.Link>
            <Nav.Link as={Link} to="/learn">Aprenda</Nav.Link>
            <Nav.Link as={Link} to="/quizzes">Quizzes</Nav.Link>
            <Nav.Link as={Link} to="/emergency-kits">Kits de Emergência</Nav.Link>
            <Nav.Link as={Link} to="/about">Sobre</Nav.Link>
            <Nav.Link as={Link} to="/contact">Contato</Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            {user ? (
              <NavDropdown 
                title={`Olá, ${user.name}`} 
                id="basic-nav-dropdown"
                className="text-light"
              >
                <NavDropdown.Item as={Link} to={isAdmin ? "/admin" : "/dashboard"}>
                  {isAdmin ? "Dashboard Admin" : "Meu Dashboard"}
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/profile">
                  Meu Perfil
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/my-kits">
                  Meus Kits
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Sair
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Button 
                  as={Link} 
                  to="/login" 
                  variant="outline-light" 
                  className="me-2"
                >
                  Entrar
                </Button>
                <Button 
                  as={Link} 
                  to="/register" 
                  variant="light"
                >
                  Cadastrar
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar; 