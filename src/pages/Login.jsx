import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await auth.login({ email, password });
      console.log('Login response:', response.data);
      
      if (response.data && response.data.token) {
        // Store the token
        localStorage.setItem('token', response.data.token);
        
        // User data should now have the role set from the token
        const userData = response.data.user;
        console.log('Processed user data:', userData);
        
        // Update auth context with user data
        login(userData);
        
        // Reset form
        setEmail('');
        setPassword('');
        
        // Debug log before redirect
        console.log('User role:', userData.role);
        console.log('Is admin?', userData.role === 'admin');
        
        // Redirect based on role with exact comparison
        if (userData.role === 'admin') {
          console.log('Redirecting to admin dashboard');
          navigate('/admin');
        } else {
          console.log('Redirecting to user dashboard');
          const from = location.state?.from?.pathname || '/dashboard';
          navigate(from);
        }
      } else {
        setError('Resposta inválida do servidor. Token não encontrado.');
      }
    } catch (err) {
      console.error('Login error details:', err);
      console.error('Full error object:', {
        message: err.message,
        response: err.response,
        data: err.response?.data
      });
      setError(
        err.response?.data?.error || 
        'Erro ao fazer login. Por favor, verifique suas credenciais e tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <div style={{ maxWidth: "400px", width: "100%", marginTop: "-100px" }}>
        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">Entrar</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Seu email"
                  autoComplete="email"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Senha</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Sua senha"
                  autoComplete="current-password"
                />
              </Form.Group>

              <Button
                className="w-100 mb-3"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>

              <div className="text-center">
                <small>
                  Não tem uma conta? {' '}
                  <Link to="/register">Cadastre-se aqui</Link>
                </small>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default Login; 