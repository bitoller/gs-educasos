import { useState, useCallback } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { auth } from "../services/api";
import { toast } from "react-toastify";
import "../styles/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const clearForm = () => {
    setEmail("");
    setPassword("");
    setError("");
  };

  const handleInputChange = (e, setter) => {
    setter(e.target.value);
    if (error) {
      clearForm();
    }
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (loading) return;

      setError("");
      setLoading(true);

      try {
        const response = await auth.login({ email, password });

        if (response.data && response.data.token) {
          localStorage.setItem("token", response.data.token);

          const isAdmin = response.data.user.isAdmin === true;
          const userData = {
            ...response.data.user,
            id: response.data.user.id,
            role: isAdmin ? "admin" : response.data.user.role || "user",
            score:
              response.data.user.score || response.data.user.totalScore || 0,
            totalScore:
              response.data.user.totalScore || response.data.user.score || 0,
            completedQuizzes: response.data.user.completedQuizzes || 0,
          };

          localStorage.setItem("user", JSON.stringify(userData));

          login(userData);

          clearForm();

          toast.success("Login realizado com sucesso!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            icon: "🎉",
            style: {
              background: "rgba(33, 37, 41, 0.95)",
              color: "#fff",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            },
          });

          if (userData.role === "admin") {
            navigate("/admin");
          } else {
            const from = location.state?.from?.pathname || "/dashboard";
            navigate(from);
          }
        } else {
          setError("Resposta inválida do servidor. Token não encontrado.");
        }
      } catch (err) {
        console.error("Login error details:", err);
        console.error("Full error object:", {
          message: err.message,
          response: err.response,
          data: err.response?.data,
        });
        setError(
          err.response?.data?.error ||
            "Erro ao fazer login. Por favor, verifique suas credenciais e tente novamente."
        );
      } finally {
        setLoading(false);
      }
    },
    [email, password, loading, login, navigate, location]
  );

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Bem-vindo</h1>
        {error && (
          <Alert
            variant="danger"
            className="login-alert"
            onClose={clearForm}
            dismissible
            style={{
              position: "relative",
              zIndex: 1000,
              marginBottom: "1rem",
              animation: "none",
            }}
          >
            {error}
          </Alert>
        )}
        <Form onSubmit={handleSubmit} className="login-form">
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => handleInputChange(e, setEmail)}
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
              onChange={(e) => handleInputChange(e, setPassword)}
              required
              placeholder="Sua senha"
              autoComplete="current-password"
            />
          </Form.Group>

          <Button type="submit" disabled={loading} className="login-button">
            {loading ? "Entrando..." : "Entrar"}
          </Button>

          <div className="login-separator">
            <span>ou</span>
          </div>

          <div className="login-links">
            <p>
              Não tem uma conta? <Link to="/register">Cadastre-se aqui</Link>
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
