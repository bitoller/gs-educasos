import React, { useState } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { kits } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1c2e 0%, #16213e 100%);
  padding: 5rem 0 2rem;
`;

const PageHeader = styled.div`
  margin-bottom: 3rem;
  color: white;
`;

const BackButton = styled(Button)`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  color: white;
  margin-bottom: 1rem;
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateX(-5px);
  }
`;

const PageTitle = styled.h2`
  color: #fff;
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 10px rgba(0, 242, 254, 0.2);
  display: flex;
  align-items: center;
  gap: 1rem;

  span {
    font-size: 2.8rem;
  }
`;

const FormCard = styled(Card)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  color: white;
  overflow: hidden;
`;

const FormCardBody = styled(Card.Body)`
  padding: 2rem;
`;

const StyledForm = styled(Form)`
  .form-label {
    color: rgba(255, 255, 255, 0.9);
    font-weight: 500;
    margin-bottom: 0.5rem;
  }

  .form-control, .form-select {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    color: white;
    padding: 0.8rem;
    transition: all 0.3s ease;

    &:focus {
      background: rgba(255, 255, 255, 0.15);
      border-color: rgba(0, 242, 254, 0.5);
      box-shadow: 0 0 0 0.25rem rgba(0, 242, 254, 0.25);
      color: white;
    }

    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }

    option {
      background: #1a1c2e;
      color: white;
    }
  }
`;

const FormSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  color: #fff;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  span {
    font-size: 1.8rem;
  }
`;

const ItemsContainer = styled.div`
  margin-top: 2rem;
`;

const ItemCard = styled(Card)`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  margin-bottom: 1rem;
`;

const ItemCardBody = styled(Card.Body)`
  padding: 1rem;
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const RemoveButton = styled(Button)`
  background: rgba(255, 59, 48, 0.1);
  border: 1px solid rgba(255, 59, 48, 0.2);
  color: #ff3b30;
  padding: 0.4rem 0.8rem;
  border-radius: 10px;
  font-size: 0.9rem;

  &:hover {
    background: rgba(255, 59, 48, 0.2);
    border-color: rgba(255, 59, 48, 0.3);
    color: #ff3b30;
  }
`;

const AddItemButton = styled(Button)`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.8rem;
  border-radius: 12px;
  width: 100%;
  margin-top: 1rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const SubmitButton = styled(Button)`
  background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%);
  border: none;
  padding: 1rem 2rem;
  border-radius: 15px;
  font-weight: 500;
  width: 100%;
  margin-top: 2rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 242, 254, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 242, 254, 0.4);
    filter: brightness(110%);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: rgba(255, 255, 255, 0.1);
    box-shadow: none;
  }
`;

const StyledAlert = styled(Alert)`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  backdrop-filter: blur(10px);
  border-radius: 15px;
  margin-bottom: 2rem;
`;

const CreateKit = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    houseType: '',
    region: '',
    numResidents: '',
    hasChildren: false,
    hasElderly: false,
    hasPets: false,
    items: []
  });

  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    quantity: '',
    unit: '',
    description: '',
    expirationDate: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addItem = (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.category || !newItem.quantity || !newItem.unit) {
      return;
    }
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { ...newItem, id: Date.now() }]
    }));
    setNewItem({
      name: '',
      category: '',
      quantity: '',
      unit: '',
      description: '',
      expirationDate: ''
    });
  };

  const removeItem = (itemId) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      
      // Prepare the data according to the backend's expected format
      const kitData = {
        houseType: formData.houseType,
        numResidents: parseInt(formData.numResidents),
        hasChildren: formData.hasChildren,
        hasElderly: formData.hasElderly,
        hasPets: formData.hasPets,
        region: formData.region
      };

      const response = await kits.create(kitData);
      navigate(`/emergency-kits/${response.data.kitId}`);
    } catch (err) {
      console.error('Error creating kit:', err);
      setError('Erro ao criar o kit. Por favor, tente novamente.');
      setSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <PageHeader>
            <BackButton onClick={() => navigate('/emergency-kits')}>
              ← Voltar para Kits
            </BackButton>
            <PageTitle>
              <span>📦</span>
              Criar Novo Kit
            </PageTitle>
          </PageHeader>

          {error && <StyledAlert variant="danger">{error}</StyledAlert>}

          <FormCard>
            <FormCardBody>
              <StyledForm onSubmit={handleSubmit}>
                <FormSection>
                  <SectionTitle>
                    <span>🏠</span>
                    Informações Básicas
                  </SectionTitle>
                  <Form.Group className="mb-3">
                    <Form.Label>Tipo de Residência</Form.Label>
                    <Form.Select
                      name="houseType"
                      value={formData.houseType}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Selecione...</option>
                      <option value="CASA">Casa</option>
                      <option value="APARTAMENTO">Apartamento</option>
                      <option value="SITIO">Sítio</option>
                      <option value="OUTRO">Outro</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Região</Form.Label>
                    <Form.Select
                      name="region"
                      value={formData.region}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Selecione...</option>
                      <option value="URBANA">Urbana</option>
                      <option value="RURAL">Rural</option>
                      <option value="COSTEIRA">Costeira</option>
                      <option value="MONTANHOSA">Montanhosa</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Número de Moradores</Form.Label>
                    <Form.Control
                      type="number"
                      name="numResidents"
                      value={formData.numResidents}
                      onChange={handleInputChange}
                      min="1"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      name="hasChildren"
                      checked={formData.hasChildren}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        hasChildren: e.target.checked
                      }))}
                      label="Há crianças na residência?"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      name="hasElderly"
                      checked={formData.hasElderly}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        hasElderly: e.target.checked
                      }))}
                      label="Há idosos na residência?"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      name="hasPets"
                      checked={formData.hasPets}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        hasPets: e.target.checked
                      }))}
                      label="Há animais de estimação?"
                    />
                  </Form.Group>
                </FormSection>

                <FormSection>
                  <SectionTitle>
                    <span>📦</span>
                    Itens do Kit
                  </SectionTitle>

                  <ItemsContainer>
                    {formData.items.map((item) => (
                      <ItemCard key={item.id}>
                        <ItemCardBody>
                          <ItemHeader>
                            <strong>{item.name}</strong>
                            <RemoveButton
                              variant="danger"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                            >
                              Remover
                            </RemoveButton>
                          </ItemHeader>
                          <div>
                            <small>
                              {item.quantity} {item.unit} - {item.category}
                            </small>
                          </div>
                        </ItemCardBody>
                      </ItemCard>
                    ))}

                    <Form.Group className="mb-3">
                      <Form.Label>Nome do Item</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={newItem.name}
                        onChange={handleItemInputChange}
                        placeholder="Ex: Água Mineral"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Categoria</Form.Label>
                      <Form.Select
                        name="category"
                        value={newItem.category}
                        onChange={handleItemInputChange}
                      >
                        <option value="">Selecione...</option>
                        <option value="AGUA">Água</option>
                        <option value="ALIMENTO">Alimento</option>
                        <option value="MEDICAMENTO">Medicamento</option>
                        <option value="HIGIENE">Higiene</option>
                        <option value="DOCUMENTO">Documento</option>
                        <option value="FERRAMENTA">Ferramenta</option>
                        <option value="ROUPA">Roupa</option>
                        <option value="COMUNICACAO">Comunicação</option>
                        <option value="PRIMEIROS_SOCORROS">Primeiros Socorros</option>
                      </Form.Select>
                    </Form.Group>

                    <div className="row">
                      <div className="col-md-6">
                        <Form.Group className="mb-3">
                          <Form.Label>Quantidade</Form.Label>
                          <Form.Control
                            type="number"
                            name="quantity"
                            value={newItem.quantity}
                            onChange={handleItemInputChange}
                            min="1"
                          />
                        </Form.Group>
                      </div>
                      <div className="col-md-6">
                        <Form.Group className="mb-3">
                          <Form.Label>Unidade</Form.Label>
                          <Form.Select
                            name="unit"
                            value={newItem.unit}
                            onChange={handleItemInputChange}
                          >
                            <option value="">Selecione...</option>
                            <option value="UNIDADE">Unidade</option>
                            <option value="LITRO">Litro</option>
                            <option value="KG">Kg</option>
                            <option value="PACOTE">Pacote</option>
                            <option value="CAIXA">Caixa</option>
                          </Form.Select>
                        </Form.Group>
                      </div>
                    </div>

                    <Form.Group className="mb-3">
                      <Form.Label>Descrição</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        name="description"
                        value={newItem.description}
                        onChange={handleItemInputChange}
                        placeholder="Descrição opcional do item"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Data de Validade</Form.Label>
                      <Form.Control
                        type="date"
                        name="expirationDate"
                        value={newItem.expirationDate}
                        onChange={handleItemInputChange}
                      />
                    </Form.Group>

                    <AddItemButton
                      variant="outline-light"
                      onClick={addItem}
                      disabled={!newItem.name || !newItem.category || !newItem.quantity || !newItem.unit}
                    >
                      + Adicionar Item
                    </AddItemButton>
                  </ItemsContainer>
                </FormSection>

                <SubmitButton
                  type="submit"
                  disabled={submitting || !formData.houseType || !formData.region || !formData.numResidents}
                >
                  {submitting ? 'Criando...' : 'Criar Kit de Emergência'}
                </SubmitButton>
              </StyledForm>
            </FormCardBody>
          </FormCard>
        </motion.div>
      </Container>
    </PageContainer>
  );
};

export default CreateKit; 