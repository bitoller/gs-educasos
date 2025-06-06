import { useEffect, useState } from "react";
import { Container, Card, Row, Col, Alert } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import styled from "styled-components";
import { kits } from "../services/api";

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1c2e 0%, #16213e 100%);
  padding: 5rem 0 2rem;
`;

const BackButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  color: white;
  margin-bottom: 1rem;
  cursor: pointer;
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateX(-5px);
  }
`;

const EditButton = styled(motion.button)`
  background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%);
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 20px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 242, 254, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 242, 254, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
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

const KitInfo = styled(Card)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  color: white;
  margin-bottom: 2rem;
`;

const KitInfoBody = styled(Card.Body)`
  padding: 2rem;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);

  span {
    font-size: 1.5rem;
  }

  div {
    strong {
      display: block;
      margin-bottom: 0.25rem;
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.9rem;
    }
    font-size: 1rem;
  }
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

const ItemsList = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  overflow: hidden;
  margin-top: 1.5rem;
`;

const ItemRow = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const ItemIcon = styled.span`
  font-size: 1.5rem;
  line-height: 1;
  opacity: 0.9;
  min-width: 2rem;
  text-align: center;
`;

const ItemInfo = styled.div`
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 2rem;
  align-items: center;
`;

const ItemName = styled.h4`
  font-size: 1.1rem;
  margin: 0;
  color: #fff;
  font-weight: 600;
  min-width: 200px;
  flex: 1;
`;

const ItemCategory = styled.div`
  display: inline-block;
  padding: 0.2rem 0.8rem;
  background: rgba(79, 172, 254, 0.1);
  border: 1px solid rgba(79, 172, 254, 0.2);
  border-radius: 20px;
  font-size: 0.85rem;
  color: #4facfe;
  white-space: nowrap;
`;

const ItemDetails = styled.div`
  display: flex;
  gap: 1.5rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  flex-wrap: wrap;

  div {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    white-space: nowrap;

    span {
      font-size: 1rem;
      opacity: 0.8;
    }
  }
`;

const ItemDescription = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  margin: 0.5rem 0 0;
  line-height: 1.4;
  width: 100%;
`;

const NoItemsMessage = styled.div`
  text-align: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 1rem;

  p {
    margin: 0;
    font-size: 1.1rem;
  }
`;

const StyledAlert = styled(Alert)`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  backdrop-filter: blur(5px);
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

const KitDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [kit, setKit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKit = async () => {
      try {
        if (!id) {
          throw new Error("ID do kit não fornecido");
        }

        const response = await kits.getById(id);

        if (!response || !response.data) {
          throw new Error("Kit não encontrado");
        }

        const kitData = response.data.kit || response.data;

        const processedKit = {
          ...kitData,
          id: kitData.id || kitData.kitId || id,
          numResidents: kitData.numResidents || kitData.residents || 0,
          hasChildren: Boolean(kitData.hasChildren),
          hasElderly: Boolean(kitData.hasElderly),
          hasPets: Boolean(kitData.hasPets),
          isCustom: Boolean(kitData.isCustom),
        };

        if (typeof processedKit.recommendedItems === "string") {
          try {
            processedKit.recommendedItems = JSON.parse(
              processedKit.recommendedItems
            );
          } catch (err) {
            console.warn("Erro ao fazer parse dos itens recomendados:", err);
            processedKit.recommendedItems = [];
          }
        } else if (!Array.isArray(processedKit.recommendedItems)) {
          processedKit.recommendedItems = [];
        }

        setKit(processedKit);
      } catch (err) {
        console.error("Error fetching kit:", err);
        setError(err.message || "Erro ao carregar o kit");
        if (err.response?.status === 400) {
          navigate("/emergency-kits");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchKit();
  }, [id, navigate]);

  useEffect(() => {
    if (kit) {
    }
  }, [kit]);

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

  if (error || !kit) {
    return (
      <PageContainer>
        <Container>
          <StyledAlert variant="danger">
            {error || "Kit não encontrado"}
          </StyledAlert>
          <BackButton onClick={() => navigate("/emergency-kits")}>
            ← Voltar para Kits
          </BackButton>
        </Container>
      </PageContainer>
    );
  }

  const getRegionText = (region) => {
    const regions = {
      SUDESTE: "Sudeste",
      NORDESTE: "Nordeste",
      CENTRO_OESTE: "Centro-Oeste",
      SUL: "Sul",
      NORTE: "Norte",
    };
    return regions[region] || region;
  };

  const getHouseTypeText = (type) => {
    const types = {
      CASA: "Casa",
      APARTAMENTO: "Apartamento",
      SITIO: "Sítio",
      OUTRO: "Outro",
    };
    return types[type] || type;
  };

  return (
    <PageContainer>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ButtonsContainer>
            <BackButton onClick={() => navigate("/emergency-kits")}>
              ← Voltar para Kits
            </BackButton>
            <EditButton
              onClick={() => navigate(`/emergency-kits/${id}/edit`)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>✏️</span>
              Editar Kit
            </EditButton>
          </ButtonsContainer>

          <PageTitle>
            <span>📦</span>
            Kit de Emergência {kit.id ? `#${kit.id}` : ""}
          </PageTitle>

          <KitInfo>
            <KitInfoBody>
              <InfoGrid>
                <InfoItem>
                  <span>🎯</span>
                  <div>
                    <strong>Tipo de Kit:</strong>
                    {kit.isCustom ? "Personalizado" : "Automático"}
                  </div>
                </InfoItem>
                <InfoItem>
                  <span>🏠</span>
                  <div>
                    <strong>Tipo de Residência:</strong>
                    {getHouseTypeText(kit.houseType)}
                  </div>
                </InfoItem>
                <InfoItem>
                  <span>📍</span>
                  <div>
                    <strong>Região:</strong>
                    {getRegionText(kit.region)}
                  </div>
                </InfoItem>
                <InfoItem>
                  <span>👥</span>
                  <div>
                    <strong>Número de Moradores:</strong>
                    {typeof kit.numResidents === "number"
                      ? kit.numResidents
                      : 0}
                  </div>
                </InfoItem>
                <InfoItem>
                  <span>{kit.hasChildren ? "👶" : "❌"}</span>
                  <div>
                    <strong>Crianças:</strong>
                    {kit.hasChildren ? "Sim" : "Não"}
                  </div>
                </InfoItem>
                <InfoItem>
                  <span>{kit.hasElderly ? "👴" : "❌"}</span>
                  <div>
                    <strong>Idosos:</strong>
                    {kit.hasElderly ? "Sim" : "Não"}
                  </div>
                </InfoItem>
                <InfoItem>
                  <span>{kit.hasPets ? "🐾" : "❌"}</span>
                  <div>
                    <strong>Animais de Estimação:</strong>
                    {kit.hasPets ? "Sim" : "Não"}
                  </div>
                </InfoItem>
                {kit.createdAt && (
                  <InfoItem>
                    <span>📅</span>
                    <div>
                      <strong>Criado em:</strong>
                      {new Date(kit.createdAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </InfoItem>
                )}
                {kit.updatedAt && kit.updatedAt !== kit.createdAt && (
                  <InfoItem>
                    <span>🔄</span>
                    <div>
                      <strong>Última Atualização:</strong>
                      {new Date(kit.updatedAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </InfoItem>
                )}
              </InfoGrid>
            </KitInfoBody>
          </KitInfo>

          {kit.recommendedItems &&
          Array.isArray(kit.recommendedItems) &&
          kit.recommendedItems.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <SectionTitle>
                <span>{kit.isCustom ? "📝" : "🤖"}</span>
                {kit.isCustom
                  ? "Itens Personalizados"
                  : "Itens Recomendados pelo Sistema"}
              </SectionTitle>
              <ItemsList>
                {kit.recommendedItems.map((item, index) => (
                  <ItemRow
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ItemIcon>{getItemIcon(item.category, item.name)}</ItemIcon>
                    <ItemInfo>
                      <ItemName>{item.name}</ItemName>
                      {item.category && (
                        <ItemCategory>
                          {item.category === "AGUA" && "Água"}
                          {item.category === "ALIMENTO" && "Alimento"}
                          {item.category === "MEDICAMENTO" && "Medicamento"}
                          {item.category === "HIGIENE" && "Higiene"}
                          {item.category === "DOCUMENTO" && "Documento"}
                          {item.category === "FERRAMENTA" && "Ferramenta"}
                          {item.category === "ROUPA" && "Roupa"}
                          {item.category === "COMUNICACAO" && "Comunicação"}
                          {item.category === "PRIMEIROS_SOCORROS" &&
                            "Primeiros Socorros"}
                        </ItemCategory>
                      )}
                      <ItemDetails>
                        {item.quantity && item.unit && (
                          <div>
                            <span>📦</span>
                            {item.quantity} {item.unit}
                          </div>
                        )}
                        {item.expirationDate && (
                          <div>
                            <span>📅</span>
                            {new Date(item.expirationDate).toLocaleDateString(
                              "pt-BR"
                            )}
                          </div>
                        )}
                      </ItemDetails>
                      {item.description && (
                        <ItemDescription>
                          {item.description.replace(/\\/g, "")}
                        </ItemDescription>
                      )}
                    </ItemInfo>
                  </ItemRow>
                ))}
              </ItemsList>
            </motion.div>
          ) : (
            <NoItemsMessage>
              <p>Nenhum item encontrado neste kit.</p>
            </NoItemsMessage>
          )}

          {!kit.isCustom && kit.items && kit.items.length > 0 && (
            <>
              <SectionTitle>
                <span>📦</span>
                Itens Adicionados ao Kit
              </SectionTitle>
              <ItemsList>
                {kit.items.map((item, index) => (
                  <ItemRow
                    key={item.id || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ItemIcon>{getItemIcon(item.category, item.name)}</ItemIcon>
                    <ItemInfo>
                      <ItemName>{item.name}</ItemName>
                      {item.category && (
                        <ItemCategory>
                          {item.category === "AGUA" && "Água"}
                          {item.category === "ALIMENTO" && "Alimento"}
                          {item.category === "MEDICAMENTO" && "Medicamento"}
                          {item.category === "HIGIENE" && "Higiene"}
                          {item.category === "DOCUMENTO" && "Documento"}
                          {item.category === "FERRAMENTA" && "Ferramenta"}
                          {item.category === "ROUPA" && "Roupa"}
                          {item.category === "COMUNICACAO" && "Comunicação"}
                          {item.category === "PRIMEIROS_SOCORROS" &&
                            "Primeiros Socorros"}
                        </ItemCategory>
                      )}
                      <ItemDetails>
                        {item.quantity && item.unit && (
                          <div>
                            <span>📦</span>
                            {item.quantity} {item.unit}
                          </div>
                        )}
                        {item.expirationDate && (
                          <div>
                            <span>📅</span>
                            {new Date(item.expirationDate).toLocaleDateString(
                              "pt-BR"
                            )}
                          </div>
                        )}
                      </ItemDetails>
                      {item.description && (
                        <ItemDescription>{item.description}</ItemDescription>
                      )}
                    </ItemInfo>
                  </ItemRow>
                ))}
              </ItemsList>
            </>
          )}
        </motion.div>
      </Container>
    </PageContainer>
  );
};

export default KitDetails;
