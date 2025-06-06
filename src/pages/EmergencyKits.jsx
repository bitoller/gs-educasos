import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { kits } from "../services/api";
import UnauthorizedContent from "../components/UnauthorizedContent";
import { motion } from "framer-motion";
import styled from "styled-components";
import ReactDOM from "react-dom/client";

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1c2e 0%, #16213e 100%);
  padding: 5rem 0 2rem;
`;

const PageHeader = styled.div`
  margin-bottom: 3rem;
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
`;

const CreateKitButton = styled(Button)`
  background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%);
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 25px;
  font-weight: 500;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 15px rgba(0, 242, 254, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 242, 254, 0.4);
    filter: brightness(110%);
  }

  &:active {
    transform: translateY(0);
  }
`;

const KitCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  overflow: hidden;
  height: 100%;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-5px);
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }
`;

const KitCardBody = styled(Card.Body)`
  padding: 1.5rem;
  color: white;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const KitTitle = styled.h3`
  font-size: 1.4rem;
  margin-bottom: 1.5rem;
  color: #fff;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  span {
    font-size: 1.6rem;
  }
`;

const KitInfo = styled.div`
  margin-bottom: 1.5rem;
  color: rgba(255, 255, 255, 0.9);
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const KitInfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  span {
    font-size: 1.2rem;
    opacity: 0.9;
    margin-top: 2px;
  }

  div {
    flex: 1;

    strong {
      display: inline;
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.9rem;
      margin-right: 0.5rem;
    }
  }
`;

const KitDate = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  margin-bottom: 1rem;

  span {
    font-size: 1.1rem;
    opacity: 0.8;
  }
`;

const KitActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const ViewButton = styled(Button)`
  flex: 1;
  background: rgba(79, 172, 254, 0.1);
  border: 1px solid rgba(79, 172, 254, 0.3);
  color: #4facfe;
  padding: 0.8rem;
  border-radius: 12px;
  font-weight: 500;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 0.9rem;

  &:hover {
    background: rgba(79, 172, 254, 0.2);
    border-color: rgba(79, 172, 254, 0.4);
    color: #4facfe;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const DeleteButton = styled(Button)`
  flex: 1;
  background: rgba(255, 69, 58, 0.1);
  border: 1px solid rgba(255, 69, 58, 0.3);
  color: #ff453a;
  padding: 0.8rem;
  border-radius: 12px;
  font-weight: 500;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 0.9rem;

  &:hover {
    background: rgba(255, 69, 58, 0.2);
    border-color: rgba(255, 69, 58, 0.4);
    color: #ff453a;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const EmptyState = styled(Card)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  text-align: center;
  padding: 3rem 2rem;
  color: white;
`;

const EmptyStateTitle = styled.h3`
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: #fff;
`;

const EmptyStateText = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  margin-bottom: 2rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
`;

const StyledAlert = styled(Alert)`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  backdrop-filter: blur(10px);
  border-radius: 15px;
  margin-bottom: 2rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  color: white;
`;

const SuccessMessage = styled.div`
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  padding: 1rem 2rem;
  border-radius: 8px;
  background-color: rgba(40, 167, 69, 0.95);
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: slideDown 0.3s ease-out;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);

  @keyframes slideDown {
    from {
      transform: translate(-50%, -20px);
      opacity: 0;
    }
    to {
      transform: translate(-50%, 0);
      opacity: 1;
    }
  }
`;

const getKitIcon = (houseType) => {
  const icons = {
    CASA: "🏠",
    APARTAMENTO: "🏢",
    SITIO: "🏡",
    OUTRO: "🏘️",
    default: "📦",
  };
  return icons[houseType] || icons.default;
};

const getRegionIcon = (region) => {
  const icons = {
    URBANA: "🌆",
    RURAL: "🌾",
    COSTEIRA: "🏖️",
    MONTANHOSA: "⛰️",
    default: "📍",
  };
  return icons[region] || icons.default;
};

const EmergencyKits = () => {
  const [userKits, setUserKits] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadKits();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadKits = async () => {
    try {
      const response = await kits.getAll();

      const processedKits = Array.isArray(response.data)
        ? response.data.map((kit) => {
            return {
              ...kit,
              id: kit.id || kit.kitId,
              numResidents: kit.numResidents || kit.residents || 0,
              houseType: kit.houseType || "OUTRO",
              region: kit.region || "SUDESTE",
            };
          })
        : [];

      setUserKits(processedKits);
    } catch (err) {
      console.error("Error loading kits:", err);
      setError("Erro ao carregar os kits de emergência.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteKit = async (kitId) => {
    try {
      if (!window.confirm("Tem certeza que deseja excluir este kit?")) {
        return;
      }

      await kits.delete(kitId);

      setUserKits((prevKits) => prevKits.filter((kit) => kit.id !== kitId));

      const successMessageElement = document.createElement("div");
      successMessageElement.id = "success-message";
      document.body.appendChild(successMessageElement);

      const root = ReactDOM.createRoot(successMessageElement);
      root.render(<SuccessMessage>Kit excluído com sucesso!</SuccessMessage>);

      setTimeout(() => {
        if (
          successMessageElement &&
          document.body.contains(successMessageElement)
        ) {
          root.unmount();
          document.body.removeChild(successMessageElement);
        }
      }, 3000);
    } catch (err) {
      console.error("Error deleting kit:", err);
      setError("Erro ao excluir o kit. Por favor, tente novamente.");
    }
  };

  if (!user) {
    return (
      <UnauthorizedContent
        title="Kits de Emergência"
        message="Faça login para criar e gerenciar seus kits de emergência personalizados. 
                Com uma conta, você pode salvar diferentes kits para diferentes situações e 
                receber recomendações baseadas no seu perfil."
      />
    );
  }

  if (loading) {
    return (
      <PageContainer>
        <LoadingContainer>
          <Spinner animation="border" variant="info" size="lg" />
        </LoadingContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Container>
        <PageHeader className="d-flex justify-content-between align-items-center">
          <PageTitle>Seus Kits de Emergência</PageTitle>
          <CreateKitButton as={Link} to="/emergency-kits/new">
            + Criar Novo Kit
          </CreateKitButton>
        </PageHeader>

        {error && (
          <StyledAlert
            variant="danger"
            onClose={() => setError("")}
            dismissible
          >
            {error}
          </StyledAlert>
        )}

        {userKits.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <EmptyState>
              <EmptyStateTitle>Nenhum Kit Encontrado</EmptyStateTitle>
              <EmptyStateText>
                Você ainda não tem nenhum kit de emergência. Que tal criar seu
                primeiro kit agora? Estar preparado é fundamental!
              </EmptyStateText>
              <CreateKitButton as={Link} to="/emergency-kits/new">
                Criar Meu Primeiro Kit
              </CreateKitButton>
            </EmptyState>
          </motion.div>
        ) : (
          <Row xs={1} md={2} lg={3} className="g-4">
            {userKits.map((kit, index) => (
              <Col key={kit.id || index}>
                <KitCard
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={(e) => {
                    if (e.target.closest("button")) {
                      e.stopPropagation();
                      return;
                    }
                    navigate(`/emergency-kits/${kit.id}`);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <KitCardBody>
                    <KitTitle>
                      <span>📦</span>
                      Kit de Emergência {kit.id ? `#${kit.id}` : ""}
                    </KitTitle>
                    <KitInfo>
                      <KitInfoItem>
                        <span>🎯</span>
                        <div>
                          <strong>Tipo:</strong>
                          {kit.isCustom ? "Personalizado" : "Automático"}
                        </div>
                      </KitInfoItem>
                      <KitInfoItem>
                        <span>🏠</span>
                        <div>
                          <strong>Residência:</strong>
                          {kit.houseType === "CASA" && "Casa"}
                          {kit.houseType === "APARTAMENTO" && "Apartamento"}
                          {kit.houseType === "SITIO" && "Sítio"}
                          {kit.houseType === "OUTRO" && "Outro"}
                        </div>
                      </KitInfoItem>
                      <KitInfoItem>
                        <span>👥</span>
                        <div>
                          <strong>Moradores:</strong>
                          {(kit.numResidents || kit.residents) > 0
                            ? kit.numResidents || kit.residents
                            : "0"}
                        </div>
                      </KitInfoItem>
                      <KitInfoItem>
                        <span>📍</span>
                        <div>
                          <strong>Região:</strong>
                          {kit.region === "SUDESTE" && "Sudeste"}
                          {kit.region === "NORDESTE" && "Nordeste"}
                          {kit.region === "CENTRO_OESTE" && "Centro-Oeste"}
                          {kit.region === "SUL" && "Sul"}
                          {kit.region === "NORTE" && "Norte"}
                        </div>
                      </KitInfoItem>
                    </KitInfo>
                    {kit.createdAt && (
                      <KitDate>
                        <span>📅</span>
                        Criado em:{" "}
                        {new Date(kit.createdAt).toLocaleDateString("pt-BR")}
                      </KitDate>
                    )}
                    <KitActions>
                      <ViewButton
                        onClick={() => navigate(`/emergency-kits/${kit.id}`)}
                      >
                        Ver Detalhes
                      </ViewButton>
                      <DeleteButton onClick={() => handleDeleteKit(kit.id)}>
                        Excluir
                      </DeleteButton>
                    </KitActions>
                  </KitCardBody>
                </KitCard>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </PageContainer>
  );
};

export default EmergencyKits;
