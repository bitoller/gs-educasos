import React, { useState } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const EmergencyKitForm = () => {
  const [formData, setFormData] = useState({
    houseType: "APARTMENT",
    numResidents: 1,
    hasChildren: false,
    hasElderly: false,
    hasPets: false,
    region: "SOUTHEAST",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/kit", formData);
      navigate("/emergency-kits");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Erro ao criar kit de emergência. Por favor, tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Card className="mx-auto" style={{ maxWidth: "800px" }}>
        <Card.Body>
          <h2 className="text-center mb-4">Monte seu Kit de Emergência</h2>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label>Tipo de Residência</Form.Label>
              <Form.Select
                name="houseType"
                value={formData.houseType}
                onChange={handleChange}
                required
              >
                <option value="APARTMENT">Apartamento</option>
                <option value="HOUSE">Casa</option>
                <option value="CONDO">Condomínio</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Número de Residentes</Form.Label>
              <Form.Control
                type="number"
                name="numResidents"
                value={formData.numResidents}
                onChange={handleChange}
                min="1"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                name="hasChildren"
                checked={formData.hasChildren}
                onChange={handleChange}
                label="Há crianças na residência?"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                name="hasElderly"
                checked={formData.hasElderly}
                onChange={handleChange}
                label="Há idosos na residência?"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Check
                type="checkbox"
                name="hasPets"
                checked={formData.hasPets}
                onChange={handleChange}
                label="Há animais de estimação?"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Região</Form.Label>
              <Form.Select
                name="region"
                value={formData.region}
                onChange={handleChange}
                required
              >
                <option value="SOUTHEAST">Sudeste</option>
                <option value="NORTHEAST">Nordeste</option>
                <option value="MIDWEST">Centro-Oeste</option>
                <option value="SOUTHWEST">Sudoeste</option>
                <option value="WEST">Oeste</option>
              </Form.Select>
            </Form.Group>

            <div className="d-grid">
              <Button type="submit" size="lg" disabled={loading}>
                {loading ? "Criando Kit..." : "Criar Kit de Emergência"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EmergencyKitForm;
