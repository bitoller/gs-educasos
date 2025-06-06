import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { auth } from "../services/api";
import { toast } from "react-toastify";
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");

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
      const response = await auth.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      if (response.data) {
        toast.success(
          "Cadastro realizado com sucesso! Você já pode fazer login.",
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            icon: "✨",
            style: {
              background: "rgba(33, 37, 41, 0.95)",
              color: "#fff",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            },
          }
        );
        navigate("/login");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(
        err.response?.data?.error ||
          "Erro ao criar conta. Por favor, tente novamente."
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
