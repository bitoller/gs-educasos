import { useState, useEffect } from "react";
import { Row, Col, Button, Alert, Spinner, Tab } from "react-bootstrap";
import { content } from "../services/api";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  translateDisasterType,
  getDisasterDescription,
} from "../utils/translations";
import { getYouTubeEmbedUrl } from "../utils/videoUtils";
import { parseDisasterDescription } from "../utils/descriptionUtils";
import styled from "styled-components";
import {
  PageContainer,
  ContentWrapper,
  HeaderSection,
  Title,
  Subtitle,
  FilterSection,
  FilterButton,
  SectionDivider,
  SectionTitle,
  InfoTooltip,
  Pagination,
  PageButton,
  CompactCard,
  CompactBody,
  CompactTitle,
  CompactDescription,
  CompactFooter,
  StatBadge,
  TipIcon,
  LearnMoreButton,
  DetailedCard,
  DetailedHeader,
  DetailedHeaderContent,
  DetailedTitle,
  DetailedDescription,
  DetailedBody,
  DetailedContent,
  TipListDetailed,
  VideoContainerDetailed,
  ActionButtonDetailed,
  TipFooter,
  PhaseTabTitle,
  PhaseIcon,
  PhaseContent,
  PhaseDescription,
  DisasterPhasesTabs,
} from "../styles/LearnDisasters.styles";

const StyledAlert = styled(Alert)`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  backdrop-filter: blur(10px);
  border-radius: 15px;
  margin-bottom: 2rem;
`;

const getDisasterGradient = (type) => {
  const translatedType = translateDisasterType(type);
  const gradients = {
    ENCHENTE: "linear-gradient(135deg, #0EA5E9 0%, #0369A1 100%)",
    TERREMOTO: "linear-gradient(135deg, #F59E0B 0%, #B45309 100%)",
    INCENDIO: "linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)",
    FURACAO: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
    TORNADO: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
    DESLIZAMENTO: "linear-gradient(135deg, #84CC16 0%, #4D7C0F 100%)",
    SECA: "linear-gradient(135deg, #F97316 0%, #C2410C 100%)",
    TSUNAMI: "linear-gradient(135deg, #06B6D4 0%, #0E7490 100%)",
    TEMPESTADE: "linear-gradient(135deg, #475569 0%, #1E293B 100%)",
    default: "linear-gradient(135deg, #6B7280 0%, #4B5563 100%)",
  };
  return gradients[translatedType] || gradients.default;
};

const getPhaseMessage = (phase, disasterType) => {
  const messages = {
    FIRE: {
      before: {
        icon: "🔍",
        message: "Prevenção é a melhor forma de combater incêndios",
      },
      during: {
        icon: "⚡",
        message: "Cada segundo conta em uma situação de incêndio",
      },
      after: {
        icon: "🤝",
        message: "Unidos na reconstrução e prevenção",
      },
    },
    FLOOD: {
      before: {
        icon: "📋",
        message: "Planejamento é essencial contra enchentes",
      },
      during: {
        icon: "🚨",
        message: "Mantenha a calma e siga o plano de evacuação",
      },
      after: {
        icon: "💪",
        message: "Juntos pela recuperação da comunidade",
      },
    },
    EARTHQUAKE: {
      before: {
        icon: "🏠",
        message: "Prepare sua casa e sua família",
      },
      during: {
        icon: "🛡️",
        message: "Proteja-se e mantenha a serenidade",
      },
      after: {
        icon: "🤲",
        message: "Solidariedade faz a diferença na reconstrução",
      },
    },
    HURRICANE: {
      before: {
        icon: "📱",
        message: "Fique atento aos alertas meteorológicos",
      },
      during: {
        icon: "🏘️",
        message: "Permaneça em local seguro e protegido",
      },
      after: {
        icon: "🌟",
        message: "Reconstruindo com esperança e união",
      },
    },
    TORNADO: {
      before: {
        icon: "🎯",
        message: "Conhecimento salva vidas em tornados",
      },
      during: {
        icon: "🏃",
        message: "Abrigue-se imediatamente em local seguro",
      },
      after: {
        icon: "🌅",
        message: "Um novo começo com apoio mútuo",
      },
    },
    LANDSLIDE: {
      before: {
        icon: "👀",
        message: "Observe os sinais de risco no terreno",
      },
      during: {
        icon: "🏃‍♂️",
        message: "Evacue a área imediatamente se houver sinais",
      },
      after: {
        icon: "🌱",
        message: "Recuperando e prevenindo juntos",
      },
    },
    DROUGHT: {
      before: {
        icon: "💧",
        message: "Economize água, cada gota conta",
      },
      during: {
        icon: "🌡️",
        message: "Use os recursos hídricos com consciência",
      },
      after: {
        icon: "🤝",
        message: "Preservando água para o futuro",
      },
    },
    TSUNAMI: {
      before: {
        icon: "📢",
        message: "Conheça as rotas de evacuação",
      },
      during: {
        icon: "⚡",
        message: "Evacue para áreas elevadas rapidamente",
      },
      after: {
        icon: "💫",
        message: "Reconstruindo com força e união",
      },
    },
    STORM: {
      before: {
        icon: "🔋",
        message: "Prepare-se para possíveis interrupções",
      },
      during: {
        icon: "🏠",
        message: "Mantenha-se em local seguro e protegido",
      },
      after: {
        icon: "🌈",
        message: "Superando desafios em comunidade",
      },
    },
  };

  return (
    messages[disasterType]?.[phase] || {
      icon: "💡",
      message: "Conhecimento é a base da prevenção",
    }
  );
};

const LearnDisasters = () => {
  const [disasters, setDisasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDisaster, setSelectedDisaster] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeDisasterIndex, setActiveDisasterIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("before");
  const [disasterContent, setDisasterContent] = useState([]);
  const [uniqueTypes, setUniqueTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const isAuthenticated = localStorage.getItem("token");

  const uncommonInBrazil = ["HURRICANE", "TSUNAMI", "EARTHQUAKE"];

  const filterDisastersByCommonality = (disasters) => {
    const common = disasters.filter(
      (d) => !uncommonInBrazil.includes(d.disasterType)
    );
    const uncommon = disasters.filter((d) =>
      uncommonInBrazil.includes(d.disasterType)
    );
    return { common, uncommon };
  };

  const getCurrentPageContent = () => {
    let content = selectedType
      ? disasterContent.filter((item) => item.disasterType === selectedType)
      : disasterContent;

    if (!selectedType) {
      return filterDisastersByCommonality(content);
    }

    return { common: content, uncommon: [] };
  };

  useEffect(() => {
    loadAllContent();
  }, []);

  const loadAllContent = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await content.getAll();

      if (!response.data || response.data.length === 0) {
        setError(
          "Nenhuma informação encontrada. Por favor, tente novamente mais tarde."
        );
        setDisasterContent([]);
      } else {
        const types = [
          ...new Set(response.data.map((item) => item.disasterType)),
        ];
        setUniqueTypes(types);
        setSelectedType(null);
        setDisasterContent(response.data);
      }
    } catch (err) {
      console.error("Error:", err);
      setError(
        "Erro ao carregar informações. Por favor, tente novamente mais tarde."
      );
      setDisasterContent([]);
    } finally {
      setLoading(false);
    }
  };

  const getDisasterIcon = (type) => {
    const translatedType = translateDisasterType(type);
    const icons = {
      ENCHENTE: "💧",
      TERREMOTO: "⚡",
      INCENDIO: "🔥",
      FURACAO: "🌀",
      TORNADO: "🌪️",
      DESLIZAMENTO: "⛰️",
      SECA: "☀️",
      TSUNAMI: "🌊",
      TEMPESTADE: "⛈️",
      default: "⚠️",
    };
    return icons[translatedType] || icons.default;
  };

  const getActiveColor = (tab) => {
    switch (tab) {
      case "before":
        return "linear-gradient(90deg, #00f2fe, #4facfe)";
      case "during":
        return "linear-gradient(90deg, #f59e0b, #d97706)";
      case "after":
        return "linear-gradient(90deg, #10b981, #059669)";
      default:
        return "linear-gradient(90deg, #00f2fe, #4facfe)";
    }
  };

  const renderCompactCard = (disaster, index) => (
    <Col key={index} lg={3} md={4} sm={6} className="mb-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <CompactCard gradient={getDisasterGradient(disaster.disasterType)}>
          <CompactBody>
            <CompactTitle>
              <span>{getDisasterIcon(disaster.disasterType)}</span>
              {getDisasterDescription(disaster.disasterType)}
            </CompactTitle>
            <CompactDescription>{disaster.description}</CompactDescription>
            <CompactFooter>
              {(disaster.beforeTips?.length > 0 ||
                disaster.duringTips?.length > 0 ||
                disaster.afterTips?.length > 0) && (
                <StatBadge>
                  <TipIcon>📋</TipIcon>
                  {(disaster.beforeTips?.length || 0) +
                    (disaster.duringTips?.length || 0) +
                    (disaster.afterTips?.length || 0)}{" "}
                  dicas
                </StatBadge>
              )}
              <LearnMoreButton
                onClick={() => setSelectedType(disaster.disasterType)}
              >
                Saiba Mais →
              </LearnMoreButton>
            </CompactFooter>
          </CompactBody>
        </CompactCard>
      </motion.div>
    </Col>
  );

  const renderDetailedCard = (disaster, index) => {
    const gradient = getDisasterGradient(disaster.disasterType);
    const embedUrl = getYouTubeEmbedUrl(disaster.videoUrl);
    const { mainDescription, beforeText, duringText, afterText } =
      parseDisasterDescription(disaster.description);

    return (
      <Col key={index} xs={12} className="mb-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <DetailedCard>
            <DetailedHeader gradient={gradient}>
              <DetailedHeaderContent>
                <DetailedTitle>
                  <span>{getDisasterIcon(disaster.disasterType)}</span>
                  {getDisasterDescription(disaster.disasterType)}
                </DetailedTitle>
                <DetailedDescription>{mainDescription}</DetailedDescription>
              </DetailedHeaderContent>
            </DetailedHeader>

            <DetailedBody>
              <DetailedContent>
                <DisasterPhasesTabs
                  defaultActiveKey="before"
                  activeKey={activeTab}
                  onSelect={(k) => setActiveTab(k)}
                  activeColor={getActiveColor(activeTab)}
                >
                  <Tab
                    eventKey="before"
                    title={
                      <PhaseTabTitle>
                        <PhaseIcon>🎯</PhaseIcon>
                        <span>Antes do Desastre</span>
                      </PhaseTabTitle>
                    }
                  >
                    <PhaseContent>
                      <PhaseDescription color="#00f2fe">
                        {beforeText ||
                          "Medidas preventivas e de preparação que podem salvar vidas"}
                      </PhaseDescription>
                      {disaster.beforeTips &&
                        disaster.beforeTips.length > 0 && (
                          <TipListDetailed color="#00f2fe">
                            {disaster.beforeTips.map((tip, i) => (
                              <li key={i}>{tip}</li>
                            ))}
                          </TipListDetailed>
                        )}
                      <TipFooter>
                        <TipIcon>
                          {
                            getPhaseMessage("before", disaster.disasterType)
                              .icon
                          }
                        </TipIcon>
                        <small>
                          {
                            getPhaseMessage("before", disaster.disasterType)
                              .message
                          }
                        </small>
                      </TipFooter>
                    </PhaseContent>
                  </Tab>

                  <Tab
                    eventKey="during"
                    title={
                      <PhaseTabTitle>
                        <PhaseIcon>⚡</PhaseIcon>
                        <span>Durante o Desastre</span>
                      </PhaseTabTitle>
                    }
                  >
                    <PhaseContent>
                      <PhaseDescription color="#f59e0b">
                        {duringText ||
                          "Ações imediatas para garantir sua segurança"}
                      </PhaseDescription>
                      {disaster.duringTips &&
                        disaster.duringTips.length > 0 && (
                          <TipListDetailed color="#f59e0b">
                            {disaster.duringTips.map((tip, i) => (
                              <li key={i}>{tip}</li>
                            ))}
                          </TipListDetailed>
                        )}
                      <TipFooter>
                        <TipIcon>
                          {
                            getPhaseMessage("during", disaster.disasterType)
                              .icon
                          }
                        </TipIcon>
                        <small>
                          {
                            getPhaseMessage("during", disaster.disasterType)
                              .message
                          }
                        </small>
                      </TipFooter>
                    </PhaseContent>
                  </Tab>

                  <Tab
                    eventKey="after"
                    title={
                      <PhaseTabTitle>
                        <PhaseIcon>🔄</PhaseIcon>
                        <span>Após o Desastre</span>
                      </PhaseTabTitle>
                    }
                  >
                    <PhaseContent>
                      <PhaseDescription color="#10b981">
                        {afterText ||
                          "Como se recuperar e ajudar sua comunidade"}
                      </PhaseDescription>
                      {disaster.afterTips && disaster.afterTips.length > 0 && (
                        <TipListDetailed color="#10b981">
                          {disaster.afterTips.map((tip, i) => (
                            <li key={i}>{tip}</li>
                          ))}
                        </TipListDetailed>
                      )}
                      <TipFooter>
                        <TipIcon>
                          {getPhaseMessage("after", disaster.disasterType).icon}
                        </TipIcon>
                        <small>
                          {
                            getPhaseMessage("after", disaster.disasterType)
                              .message
                          }
                        </small>
                      </TipFooter>
                    </PhaseContent>
                  </Tab>
                </DisasterPhasesTabs>

                {embedUrl && (
                  <>
                    <SectionDivider>
                      <SectionTitle>
                        <span>📺</span>
                        Vídeo Informativo
                      </SectionTitle>
                    </SectionDivider>
                    <VideoContainerDetailed>
                      <div className="ratio ratio-16x9">
                        <iframe
                          src={embedUrl}
                          title={getDisasterDescription(disaster.disasterType)}
                          allowFullScreen
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          frameBorder="0"
                        ></iframe>
                      </div>
                    </VideoContainerDetailed>
                  </>
                )}

                {isAuthenticated && (
                  <div className="text-center mt-4">
                    <ActionButtonDetailed
                      as={Link}
                      to={`/quizzes?type=${disaster.disasterType}`}
                      gradient={gradient}
                    >
                      <span>🎯</span>
                      Testar seus conhecimentos sobre{" "}
                      {getDisasterDescription(
                        disaster.disasterType
                      ).toLowerCase()}
                    </ActionButtonDetailed>
                    <div className="mt-3 text-muted">
                      <small>
                        Avalie sua preparação para situações de{" "}
                        {getDisasterDescription(
                          disaster.disasterType
                        ).toLowerCase()}
                      </small>
                    </div>
                  </div>
                )}
              </DetailedContent>
            </DetailedBody>
          </DetailedCard>
        </motion.div>
      </Col>
    );
  };

  if (loading) {
    return (
      <PageContainer>
        <ContentWrapper
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "100vh" }}
        >
          <Spinner animation="border" variant="info" size="lg" />
        </ContentWrapper>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ContentWrapper>
        <HeaderSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Title>Aprenda Sobre Desastres Naturais</Title>
          <Subtitle>
            {selectedType
              ? `Informações detalhadas sobre ${getDisasterDescription(
                  selectedType
                ).toLowerCase()}`
              : "Explore informações essenciais sobre diferentes tipos de desastres naturais"}
          </Subtitle>

          {!isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <StyledAlert className="text-center">
                <h5>Quer testar seus conhecimentos?</h5>
                <p className="mb-3">
                  Faça login ou cadastre-se para acessar os quizzes!
                </p>
                <div className="d-flex justify-content-center gap-3">
                  <Link to="/login">
                    <Button variant="primary">Fazer Login</Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="outline-light">Cadastrar-se</Button>
                  </Link>
                </div>
              </StyledAlert>
            </motion.div>
          )}

          <FilterSection
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <FilterButton
              active={!selectedType}
              onClick={() => {
                setSelectedType(null);
                setCurrentPage(1);
              }}
            >
              🔍 Todos
            </FilterButton>
            {uniqueTypes.map((type) => (
              <FilterButton
                key={type}
                active={selectedType === type}
                onClick={() => {
                  setSelectedType(type);
                  setCurrentPage(1);
                }}
              >
                {getDisasterIcon(translateDisasterType(type))}{" "}
                {getDisasterDescription(type)}
              </FilterButton>
            ))}
          </FilterSection>
        </HeaderSection>

        {!selectedType ? (
          <>
            <Row>
              {getCurrentPageContent().common.map((disaster, index) =>
                renderCompactCard(disaster, index)
              )}
            </Row>

            <SectionDivider>
              <SectionTitle>
                <span>🌎</span>
                Desastres Menos Comuns no Brasil
                <InfoTooltip title="Estes desastres são raros ou inexistentes no Brasil, mas é importante conhecê-los">
                  ℹ️
                </InfoTooltip>
              </SectionTitle>
            </SectionDivider>

            <Row>
              {getCurrentPageContent().uncommon.map((disaster, index) =>
                renderCompactCard(disaster, index)
              )}
            </Row>
          </>
        ) : (
          <Row className="justify-content-center">
            {getCurrentPageContent().common.map((disaster, index) =>
              renderDetailedCard(disaster, index)
            )}
          </Row>
        )}

        {selectedType &&
          getCurrentPageContent().common.length > itemsPerPage && (
            <Pagination>
              <PageButton
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              >
                ←
              </PageButton>
              {[
                ...Array(
                  Math.ceil(
                    getCurrentPageContent().common.length / itemsPerPage
                  )
                ),
              ].map((_, i) => (
                <PageButton
                  key={i + 1}
                  active={currentPage === i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </PageButton>
              ))}
              <PageButton
                disabled={
                  currentPage ===
                  Math.ceil(
                    getCurrentPageContent().common.length / itemsPerPage
                  )
                }
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(
                      Math.ceil(
                        getCurrentPageContent().common.length / itemsPerPage
                      ),
                      prev + 1
                    )
                  )
                }
              >
                →
              </PageButton>
            </Pagination>
          )}
      </ContentWrapper>
    </PageContainer>
  );
};

export default LearnDisasters;
