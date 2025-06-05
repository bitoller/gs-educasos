import React, { useEffect, useState } from "react";
import { Container, Form, Button, Alert, Modal } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import styled from "styled-components";
import { kits } from "../services/api";

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1c2e 0%, #16213e 100%);
  padding: 5rem 0 2rem;
`;

const FormContainer = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  color: white;
  margin-bottom: 2rem;
`;

const PageTitle = styled.h2`
  color: #fff;
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 2rem;
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

const StyledForm = styled(Form)`
  .form-label {
    color: rgba(255, 255, 255, 0.8);
    font-weight: 500;
  }

  .form-control,
  .form-select {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    transition: all 0.3s ease;

    &:focus {
      background: rgba(255, 255, 255, 0.15);
      border-color: rgba(255, 255, 255, 0.3);
      box-shadow: 0 0 0 0.25rem rgba(79, 172, 254, 0.25);
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

  .form-check-label {
    color: rgba(255, 255, 255, 0.8);
  }

  .form-check-input {
    background-color: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);

    &:checked {
      background-color: #4facfe;
      border-color: #4facfe;
    }
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const BackButton = styled(Button)`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const SaveButton = styled(Button)`
  background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%);
  border: none;
  padding: 0.75rem 2rem;
  font-weight: 600;

  &:hover {
    background: linear-gradient(135deg, #00d8e4 0%, #4590e4 100%);
  }
`;

const StyledAlert = styled(Alert)`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  backdrop-filter: blur(5px);
`;

const SectionTitle = styled.h3`
  color: #fff;
  font-size: 1.8rem;
  margin: 2rem 0 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  span {
    font-size: 2rem;
  }
`;

const ItemsSection = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const ItemsList = styled.div`
  margin-bottom: 2rem;
`;

const ItemCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateX(5px);
  }
`;

const ItemIcon = styled.span`
  font-size: 1.5rem;
  min-width: 2rem;
  text-align: center;
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemName = styled.h4`
  margin: 0;
  color: white;
  font-size: 1.1rem;
  font-weight: 500;
`;

const ItemDescription = styled.p`
  margin: 0.25rem 0 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
`;

const ItemActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled(Button)`
  padding: 0.4rem 0.8rem;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &.delete {
    background: rgba(255, 59, 48, 0.1);
    border: 1px solid rgba(255, 59, 48, 0.2);
    color: #ff3b30;

    &:hover {
      background: rgba(255, 59, 48, 0.2);
      border-color: rgba(255, 59, 48, 0.3);
      color: #ff3b30;
    }
  }

  &.edit {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;

    &:hover {
      background: rgba(255, 255, 255, 0.15);
      border-color: rgba(255, 255, 255, 0.3);
    }
  }
`;

const AddItemButton = styled(Button)`
  width: 100%;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 500;
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

const ItemModal = styled(Modal)`
  .modal-content {
    background: #1a1c2e;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    color: white;
  }

  .modal-header {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding: 1.5rem;
  }

  .modal-body {
    padding: 1.5rem;
  }

  .modal-footer {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding: 1.5rem;
  }

  .btn-close {
    filter: invert(1) grayscale(100%) brightness(200%);
  }
`;

const getItemIconByName = (name) => {
  const normalizedName = name.toLowerCase().trim();

  if (normalizedName.includes("água") || normalizedName.includes("agua"))
    return "💧";
  if (normalizedName.includes("garrafa")) return "🫗";
  if (normalizedName.includes("suco")) return "🧃";

  if (normalizedName.includes("comida") || normalizedName.includes("alimento"))
    return "🍱";
  if (normalizedName.includes("biscoito") || normalizedName.includes("bolacha"))
    return "🍪";
  if (normalizedName.includes("pão") || normalizedName.includes("pao"))
    return "🍞";
  if (normalizedName.includes("fruta")) return "🍎";
  if (normalizedName.includes("lata") || normalizedName.includes("enlatado"))
    return "🥫";
  if (normalizedName.includes("cereal")) return "🥣";

  if (normalizedName.includes("remédio") || normalizedName.includes("remedio"))
    return "💊";
  if (normalizedName.includes("band") || normalizedName.includes("curativo"))
    return "🩹";
  if (
    normalizedName.includes("termômetro") ||
    normalizedName.includes("termometro")
  )
    return "🌡️";
  if (normalizedName.includes("kit") && normalizedName.includes("socorros"))
    return "🏥";

  if (normalizedName.includes("sabonete") || normalizedName.includes("sabão"))
    return "🧼";
  if (normalizedName.includes("papel") && normalizedName.includes("higiênico"))
    return "🧻";
  if (normalizedName.includes("escova") && normalizedName.includes("dente"))
    return "🪥";
  if (normalizedName.includes("pasta") && normalizedName.includes("dente"))
    return "🪥";
  if (normalizedName.includes("toalha")) return "🧴";
  if (normalizedName.includes("shampoo")) return "🧴";

  if (normalizedName.includes("roupa")) return "👕";
  if (normalizedName.includes("casaco") || normalizedName.includes("blusa"))
    return "🧥";
  if (normalizedName.includes("calça") || normalizedName.includes("calca"))
    return "👖";
  if (normalizedName.includes("sapato") || normalizedName.includes("tênis"))
    return "👟";
  if (normalizedName.includes("máscara") || normalizedName.includes("mascara"))
    return "😷";
  if (normalizedName.includes("luva")) return "🧤";
  if (normalizedName.includes("guarda") && normalizedName.includes("chuva"))
    return "☔";

  if (normalizedName.includes("documento")) return "📄";
  if (normalizedName.includes("celular")) return "📱";
  if (normalizedName.includes("rádio") || normalizedName.includes("radio"))
    return "📻";
  if (normalizedName.includes("carregador")) return "🔌";
  if (normalizedName.includes("bateria")) return "🔋";
  if (normalizedName.includes("lanterna")) return "🔦";

  if (normalizedName.includes("faca") || normalizedName.includes("canivete"))
    return "🔪";
  if (normalizedName.includes("ferramenta")) return "🔧";
  if (normalizedName.includes("corda")) return "➰";
  if (normalizedName.includes("fósforo") || normalizedName.includes("fosforo"))
    return "🔥";
  if (normalizedName.includes("isqueiro")) return "🔥";
  if (normalizedName.includes("pilha")) return "🔋";

  if (normalizedName.includes("mapa")) return "🗺️";
  if (normalizedName.includes("bússola") || normalizedName.includes("bussola"))
    return "🧭";
  if (normalizedName.includes("apito")) return "🎯";
  if (normalizedName.includes("cobertor")) return "🛏️";
  if (normalizedName.includes("saco") && normalizedName.includes("dormir"))
    return "🛏️";

  if (normalizedName.includes("ração") || normalizedName.includes("racao"))
    return "🐾";
  if (normalizedName.includes("pet") || normalizedName.includes("animal"))
    return "🐾";

  if (normalizedName.includes("álcool") || normalizedName.includes("alcool"))
    return "🧴";
  if (normalizedName.includes("desinfetante")) return "🧴";
  if (normalizedName.includes("cloro")) return "🧴";

  if (normalizedName.includes("dinheiro")) return "💵";
  if (normalizedName.includes("caderno") || normalizedName.includes("bloco"))
    return "📓";
  if (normalizedName.includes("caneta")) return "✏️";
  if (normalizedName.includes("óculos") || normalizedName.includes("oculos"))
    return "👓";

  return null;
};

const EditKit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [kit, setKit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    const fetchKit = async () => {
      try {
        const response = await kits.getById(id);
        const kitData = response.data;

        if (typeof kitData.recommendedItems === "string") {
          try {
            kitData.recommendedItems = JSON.parse(kitData.recommendedItems);
          } catch (err) {
            console.warn("Error parsing recommendedItems:", err);
            kitData.recommendedItems = [];
          }
        }

        const processedKit = {
          ...kitData,
          numResidents: kitData.numResidents || kitData.residents || 0,
          recommendedItems: (kitData.recommendedItems || []).map(
            (item, index) => ({
              ...item,
              id: item.id || `item-${Date.now()}-${index}`,
            })
          ),
        };

        console.log("Processed kit data:", processedKit);
        setKit(processedKit);
      } catch (err) {
        setError(err.message || "Erro ao carregar o kit");
      } finally {
        setLoading(false);
      }
    };

    fetchKit();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submit button clicked");
    setError(null);
    setSuccess(false);

    try {
      console.log("Current kit state:", {
        id: kit.id,
        isCustom: kit.isCustom,
        itemsCount: kit.recommendedItems?.length,
        fullKit: kit,
      });

      const kitData = { ...kit };

      const processedItemsForSubmission = (kit.recommendedItems || []).map(
        (item) => {
          const { id, name, description, category } = item;
          return {
            id: id || null,
            name: name || "",
            description: description || "",
            category: category || null,
          };
        }
      );

      kitData.recommendedItems = JSON.stringify(processedItemsForSubmission);

      const submitData = {
        ...kitData,
        numResidents: Number(kitData.numResidents),
        isCustom: true,
        hasChildren: Boolean(kitData.hasChildren),
        hasElderly: Boolean(kitData.hasElderly),
        hasPets: Boolean(kitData.hasPets),
      };

      console.log("Request details:", {
        url: `/api/kit/${id}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        data: submitData,
      });

      try {
        console.log("Sending request to backend...");
        const response = await kits.update(id, submitData);
        console.log("Backend response:", {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
          data: response.data,
        });

        setSuccess(true);
        setTimeout(() => {
          navigate(`/emergency-kits/${id}`);
        }, 2000);
      } catch (err) {
        console.error("Backend error details:", {
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
          message: err.message,
          stack: err.stack,
        });

        const errorMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Erro ao atualizar o kit";

        setError(`Erro do servidor: ${errorMessage}`);
      }
    } catch (err) {
      console.error("Error in form submission:", err);
      setError(
        "Erro ao processar o formulário: " +
          (err.message || "Erro desconhecido")
      );
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setKit((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleItemInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addItem = () => {
    if (!newItem.name.trim()) return;

    const itemToAdd = {
      id: `item-${Date.now()}`,
      name: newItem.name.trim(),
      description: newItem.description.trim(),
    };

    console.log("Adding new item:", itemToAdd);

    setKit((prev) => {
      const updatedKit = {
        ...prev,
        recommendedItems: [...(prev.recommendedItems || []), itemToAdd],
      };
      console.log("Updated kit after adding:", updatedKit);
      return updatedKit;
    });

    setNewItem({
      name: "",
      description: "",
    });
    setShowItemModal(false);
  };

  const editItem = (item) => {
    if (!item.id) {
      console.warn("Attempting to edit item without ID:", item);
      return;
    }
    setEditingItem(item);
    setNewItem({
      name: item.name,
      description: item.description || "",
    });
    setShowItemModal(true);
  };

  const updateItem = () => {
    if (!newItem.name.trim() || !editingItem?.id) return;

    setKit((prev) => ({
      ...prev,
      recommendedItems: prev.recommendedItems.map((item) =>
        item.id === editingItem.id
          ? {
              ...item,
              name: newItem.name.trim(),
              description: newItem.description.trim(),
            }
          : item
      ),
    }));

    setNewItem({
      name: "",
      description: "",
    });
    setEditingItem(null);
    setShowItemModal(false);
  };

  const handleDeleteClick = (item) => {
    console.log("Clicked delete for item:", item);
    if (!item.id) {
      console.warn("Item without ID:", item);
      return;
    }
    setItemToDelete(item);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (!itemToDelete?.id || !kit?.recommendedItems) {
      console.log("No item ID to delete or no recommendedItems");
      return;
    }

    console.log("Current items before delete:", kit.recommendedItems);
    console.log("Attempting to delete item:", itemToDelete);

    const updatedItems = kit.recommendedItems.filter((item) => {
      const shouldKeep = item.id !== itemToDelete.id;
      console.log(
        "Comparing item:",
        { id: item.id, name: item.name },
        "with item to delete:",
        { id: itemToDelete.id, name: itemToDelete.name },
        "keeping?",
        shouldKeep
      );
      return shouldKeep;
    });

    console.log("Items after filter:", updatedItems);

    setKit((prev) => {
      const updatedKit = {
        ...prev,
        recommendedItems: updatedItems,
      };
      console.log("Final kit state:", updatedKit);
      return updatedKit;
    });

    setShowDeleteConfirm(false);
    setItemToDelete(null);
  };

  const getItemIcon = (category, name) => {
    const specificIcon = name ? getItemIconByName(name) : null;
    if (specificIcon) return specificIcon;

    switch (category) {
      case "AGUA":
        return "💧";
      case "ALIMENTO":
        return "🍽️";
      case "MEDICAMENTO":
        return "💊";
      case "HIGIENE":
        return "🧼";
      case "DOCUMENTO":
        return "📄";
      case "FERRAMENTA":
        return "🔧";
      case "ROUPA":
        return "👕";
      case "COMUNICACAO":
        return "📱";
      case "PRIMEIROS_SOCORROS":
        return "🏥";
      default:
        return "📦";
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <Container>
          <div className="text-center text-white">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Carregando...</span>
            </div>
          </div>
        </Container>
      </PageContainer>
    );
  }

  if (error && !kit) {
    return (
      <PageContainer>
        <Container>
          <StyledAlert variant="danger">{error}</StyledAlert>
          <BackButton
            variant="outline-light"
            onClick={() => navigate("/emergency-kits")}
          >
            ← Voltar para Kits
          </BackButton>
        </Container>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <PageTitle>
            <span>✏️</span>
            Editar Kit de Emergência
          </PageTitle>

          <FormContainer>
            <StyledForm onSubmit={handleSubmit}>
              {error && (
                <StyledAlert variant="danger" className="mb-4">
                  {error}
                </StyledAlert>
              )}

              {success && (
                <StyledAlert variant="success" className="mb-4">
                  Kit atualizado com sucesso! Redirecionando...
                </StyledAlert>
              )}

              <Form.Group className="mb-4">
                <Form.Label>Tipo de Residência</Form.Label>
                <Form.Select
                  name="houseType"
                  value={kit?.houseType || ""}
                  onChange={handleInputChange}
                  required
                >
                  <option value="CASA">Casa</option>
                  <option value="APARTAMENTO">Apartamento</option>
                  <option value="SITIO">Sítio</option>
                  <option value="OUTRO">Outro</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Região</Form.Label>
                <Form.Select
                  name="region"
                  value={kit?.region || ""}
                  onChange={handleInputChange}
                  required
                >
                  <option value="SUDESTE">Sudeste</option>
                  <option value="NORDESTE">Nordeste</option>
                  <option value="CENTRO_OESTE">Centro-Oeste</option>
                  <option value="SUL">Sul</option>
                  <option value="NORTE">Norte</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Número de Moradores</Form.Label>
                <Form.Control
                  type="number"
                  name="numResidents"
                  value={kit?.numResidents || ""}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Possui crianças"
                  name="hasChildren"
                  checked={kit?.hasChildren || false}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Possui idosos"
                  name="hasElderly"
                  checked={kit?.hasElderly || false}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Check
                  type="checkbox"
                  label="Possui animais de estimação"
                  name="hasPets"
                  checked={kit?.hasPets || false}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <ItemsSection>
                <SectionTitle>
                  <span>📦</span>
                  Itens do Kit
                </SectionTitle>

                <ItemsList>
                  {kit?.recommendedItems?.map((item, index) => {
                    console.log("Rendering item:", item);
                    return (
                      <motion.div
                        key={item.id || `item-${index}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <ItemCard>
                          <ItemIcon>
                            {getItemIcon(item.category, item.name)}
                          </ItemIcon>
                          <ItemInfo>
                            <ItemName>{item.name}</ItemName>
                            {item.description && (
                              <ItemDescription>
                                {item.description}
                              </ItemDescription>
                            )}
                          </ItemInfo>
                          <ItemActions>
                            <ActionButton
                              className="edit"
                              onClick={() => editItem(item)}
                            >
                              <span>✏️</span>
                              Editar
                            </ActionButton>
                            <ActionButton
                              className="delete"
                              onClick={() => handleDeleteClick(item)}
                            >
                              <span>🗑️</span>
                              Remover
                            </ActionButton>
                          </ItemActions>
                        </ItemCard>
                      </motion.div>
                    );
                  })}
                </ItemsList>

                <AddItemButton
                  type="button"
                  onClick={() => {
                    setEditingItem(null);
                    setShowItemModal(true);
                  }}
                >
                  <span>➕</span>
                  Adicionar Novo Item
                </AddItemButton>
              </ItemsSection>

              <ButtonsContainer>
                <BackButton
                  variant="outline-light"
                  onClick={() => navigate(`/emergency-kits/${id}`)}
                >
                  Cancelar
                </BackButton>
                <SaveButton type="submit" variant="primary">
                  Salvar Alterações
                </SaveButton>
              </ButtonsContainer>
            </StyledForm>
          </FormContainer>
        </motion.div>

        <ItemModal
          show={showItemModal}
          onHide={() => {
            setShowItemModal(false);
            setNewItem({
              name: "",
              description: "",
            });
            setEditingItem(null);
          }}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {editingItem ? "Editar Item" : "Adicionar Novo Item"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nome do Item</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newItem.name}
                onChange={handleItemInputChange}
                placeholder="Ex: Água Mineral"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={newItem.description}
                onChange={handleItemInputChange}
                placeholder="Descrição opcional do item"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowItemModal(false)}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={editingItem ? updateItem : addItem}
              disabled={!newItem.name.trim()}
            >
              {editingItem ? "Salvar Alterações" : "Adicionar Item"}
            </Button>
          </Modal.Footer>
        </ItemModal>

        <Modal
          show={showDeleteConfirm}
          onHide={() => {
            setShowDeleteConfirm(false);
            setItemToDelete(null);
          }}
          centered
          className="delete-confirm-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirmar Remoção</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Tem certeza que deseja remover o item "{itemToDelete?.name}"?
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setShowDeleteConfirm(false);
                setItemToDelete(null);
              }}
            >
              Cancelar
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Remover
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </PageContainer>
  );
};

export default EditKit;
