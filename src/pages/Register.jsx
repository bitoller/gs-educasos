import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { auth } from "../services/api";
import "../styles/Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    if (formData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      const registerResponse = await auth.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (registerResponse.status === 201) {
        setSuccess("Conta criada com sucesso! Fazendo login...");

        try {
          const loginResponse = await auth.login({
            email: formData.email,
            password: formData.password,
          });

          if (loginResponse.data && loginResponse.data.token) {
            localStorage.setItem("token", loginResponse.data.token);

            login(loginResponse.data.user);

            setFormData({
              name: "",
              email: "",
              password: "",
              confirmPassword: "",
            });

            setTimeout(() => {
              navigate("/");
            }, 1500);
          }
        } catch (loginErr) {
          console.error("Auto-login error:", loginErr);
          setError(
            "Conta criada, mas houve um erro ao fazer login automático. Por favor, faça login manualmente."
          );
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
      } else {
        setError("Erro no registro. Por favor, tente novamente.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(
        err.response?.data?.error ||
          "Erro ao criar conta. Por favor, verifique os dados e tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Criar Conta</h2>
        {error && <div className="register-alert">{error}</div>}
        {success && <div className="register-success">{success}</div>}
        <Form onSubmit={handleSubmit} className="register-form">
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
            <div className="password-requirements">
              A senha deve ter pelo menos 6 caracteres
            </div>
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

          <Button className="register-button" type="submit" disabled={loading}>
            {loading ? "Criando conta..." : "Criar Conta"}
          </Button>

          <div className="register-links">
            <Link to="/login">Já tem uma conta? Entre aqui</Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Register;
