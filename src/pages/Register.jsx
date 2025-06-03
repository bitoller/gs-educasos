import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      // First, try to register
      const registerResponse = await auth.register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      if (registerResponse.status === 201) {
        setSuccess('Conta criada com sucesso! Fazendo login...');
        
        // Then, try to login with the same credentials
        try {
          const loginResponse = await auth.login({
            email: formData.email,
            password: formData.password
          });

          if (loginResponse.data && loginResponse.data.token) {
            // Store the token
            localStorage.setItem('token', loginResponse.data.token);
            
            // Update auth context with user data
            login(loginResponse.data.user);

            // Reset form
            setFormData({
              name: '',
              email: '',
              password: '',
              confirmPassword: ''
            });

            // Short delay to show success message before redirecting
            setTimeout(() => {
              navigate('/');
            }, 1500);
          }
        } catch (loginErr) {
          console.error('Auto-login error:', loginErr);
          setError('Conta criada, mas houve um erro ao fazer login automático. Por favor, faça login manualmente.');
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        }
      } else {
        setError('Erro no registro. Por favor, tente novamente.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(
        err.response?.data?.error || 
        'Erro ao criar conta. Por favor, verifique os dados e tente novamente.'
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
            <h2 className="text-center mb-4">Criar Conta</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Seu nome completo"
                  autoComplete="name"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Seu email"
                  autoComplete="email"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Senha</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Crie uma senha"
                  autoComplete="new-password"
                />
                <Form.Text className="text-muted">
                  A senha deve ter pelo menos 6 caracteres
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Confirmar Senha</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirme sua senha"
                  autoComplete="new-password"
                />
              </Form.Group>

              <Button
                className="w-100 mb-3"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Criando conta...' : 'Criar Conta'}
              </Button>

              <div className="text-center">
                <small>
                  Já tem uma conta? {' '}
                  <Link to="/login">Entre aqui</Link>
                </small>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default Register; 