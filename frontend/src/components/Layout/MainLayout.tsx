import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="min-vh-100 d-flex flex-column bg-light-custom">
      <Navbar bg="primary" variant="dark" expand="lg" className="mb-4 shadow-sm">
        <Container>
          <Navbar.Brand as={Link} to="/">Disaster Awareness</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/aprender">Aprender</Nav.Link>
              <Nav.Link as={Link} to="/kit">Kit de Emergência</Nav.Link>
              <Nav.Link as={Link} to="/quiz">Quiz</Nav.Link>
              <Nav.Link as={Link} to="/mapa">Mapa de Risco</Nav.Link>
            </Nav>
            <Nav>
              {isAuthenticated ? (
                <>
                  <Nav.Link as={Link} to="/monitoramento">Monitoramento</Nav.Link>
                  <Nav.Link onClick={logout}>Sair</Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/login">Entrar</Nav.Link>
                  <Nav.Link as={Link} to="/register">Registrar</Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="flex-grow-1 d-flex flex-column align-items-center" style={{ maxWidth: '1200px' }}>
        {children}
      </Container>

      <footer className="bg-light py-3 mt-auto border-top">
        <Container>
          <p className="text-center mb-0">© 2024 Disaster Awareness Platform. Todos os direitos reservados.</p>
        </Container>
      </footer>
    </div>
  );
}; 