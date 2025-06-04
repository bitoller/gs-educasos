import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, ButtonGroup, Alert, Spinner } from 'react-bootstrap';
import { content } from '../services/api';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';

// Styled Components
const PageContainer = styled.div`
  padding: 5rem 0 2rem 0;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1c2e 0%, #16213e 100%);
  color: #fff;
  width: 100%;
`;

const ContentWrapper = styled(Container)`
  max-width: 100%;
  padding: 0 2rem;
`;

const HeaderSection = styled(motion.div)`
  margin-bottom: 3rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 10px rgba(0, 242, 254, 0.2);
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.2rem;
  margin-bottom: 2rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const FilterSection = styled(motion.div)`
  margin-bottom: 3rem;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const FilterButton = styled(Button)`
  background: ${props => props.active ? 
    'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)' : 
    'rgba(255, 255, 255, 0.1)'};
  border: none;
  margin: 0 0.25rem;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  
  &:hover {
    transform: translateY(-2px);
    background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%);
    box-shadow: 0 4px 15px rgba(0, 242, 254, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ContentCard = styled(Card)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  margin-bottom: 2rem;
  transition: all 0.3s ease;
  height: 100%;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }
`;

const ContentTitle = styled.h3`
  color: #fff;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  span {
    font-size: 1.8rem;
  }
`;

const ContentDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const TipSection = styled.div`
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 1.25rem;
  margin: 1rem 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(5px);
  }
`;

const TipTitle = styled.h4`
  color: #4facfe;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TipList = styled.ul`
  color: rgba(255, 255, 255, 0.8);
  padding-left: 1.5rem;
  margin-bottom: 0;

  li {
    margin-bottom: 0.5rem;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const VideoContainer = styled.div`
  border-radius: 12px;
  overflow: hidden;
  margin: 1.5rem 0;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
`;

const ActionButton = styled(Button)`
  background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%);
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  transition: all 0.3s ease;
  width: 100%;
  margin-top: 1.5rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 242, 254, 0.4);
    filter: brightness(110%);
  }

  &:active {
    transform: translateY(0);
  }
`;

const StyledAlert = styled(Alert)`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  color: white;
  margin-bottom: 2rem;

  h5 {
    color: #4facfe;
    margin-bottom: 1rem;
  }

  .btn {
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
    }
  }
`;

const getDisasterGradient = (type) => {
  const gradients = {
    ENCHENTE: 'linear-gradient(135deg, #0EA5E9 0%, #0369A1 100%)',
    TERREMOTO: 'linear-gradient(135deg, #F59E0B 0%, #B45309 100%)',
    INCENDIO: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)',
    FURACAO: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
    TORNADO: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
    DESLIZAMENTO: 'linear-gradient(135deg, #84CC16 0%, #4D7C0F 100%)',
    SECA: 'linear-gradient(135deg, #F97316 0%, #C2410C 100%)',
    TSUNAMI: 'linear-gradient(135deg, #06B6D4 0%, #0E7490 100%)',
    default: 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)'
  };
  return gradients[type] || gradients.default;
};

const CompactCard = styled(Card)`
  background: ${props => props.gradient || 'rgba(255, 255, 255, 0.05)'};
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  height: 100%;
  overflow: hidden;
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 1;
  }
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    
    &:before {
      background: rgba(0, 0, 0, 0.2);
    }
  }
`;

const CompactBody = styled(Card.Body)`
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  z-index: 2;
  padding: 1.5rem;
`;

const CompactTitle = styled.h3`
  color: #fff;
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

  span {
    font-size: 1.8rem;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  }
`;

const CompactDescription = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex-grow: 1;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
`;

const CompactFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  gap: 1rem;
`;

const LearnMoreButton = styled(Button)`
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.5rem 1.2rem;
  border-radius: 20px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  color: white;
  backdrop-filter: blur(5px);
  
  &:hover {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.4);
    color: white;
  }

  &:active {
    transform: translateY(0);
  }
`;

const StatBadge = styled.div`
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  padding: 0.4rem 1rem;
  border-radius: 15px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const TipIcon = styled.span`
  font-size: 1.2rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
`;

const DetailedCard = styled(Card)`
  background: rgba(20, 24, 40, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  margin-bottom: 2rem;
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
`;

const DetailedHeader = styled.div`
  text-align: center;
  background: ${props => props.gradient || 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)'};
  padding: 3rem 2rem 3.5rem;
  position: relative;
  clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%);
`;

const DetailedHeaderContent = styled.div`
  position: relative;
  z-index: 2;
  
  &:before {
    content: '';
    position: absolute;
    top: -3rem;
    left: 0;
    right: 0;
    bottom: -3.5rem;
    background: rgba(0, 0, 0, 0.2);
    z-index: -1;
  }
`;

const DetailedTitle = styled.h2`
  color: #fff;
  font-size: 2.4rem;
  margin-bottom: 1.2rem;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  font-weight: bold;

  span {
    font-size: 2.8rem;
    filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.4));
  }
`;

const DetailedDescription = styled.p`
  color: rgba(255, 255, 255, 0.95);
  font-size: 1.15rem;
  line-height: 1.7;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  max-width: 700px;
  margin: 0 auto;
  letter-spacing: 0.2px;
`;

const DetailedBody = styled(Card.Body)`
  padding: 2.5rem;
  background: rgba(20, 24, 40, 0.95);
`;

const DetailedContent = styled.div`
  background: rgba(30, 35, 50, 0.6);
  border-radius: 15px;
  padding: 2.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const TipSectionDetailed = styled(TipSection)`
  background: rgba(255, 255, 255, 0.08);
  margin: 2rem 0;
  padding: 2rem;
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    transform: translateX(5px);
    border-color: rgba(255, 255, 255, 0.25);
  }

  &:first-child {
    margin-top: 0;
  }
`;

const TipTitleDetailed = styled(TipTitle)`
  font-size: 1.4rem;
  color: ${props => props.color || '#4facfe'};
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  font-weight: bold;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  span {
    font-size: 1.8rem;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  }
`;

const TipListDetailed = styled(TipList)`
  font-size: 1.05rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.9);
  
  li {
    margin-bottom: 1rem;
    padding-left: 0.8rem;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const VideoContainerDetailed = styled(VideoContainer)`
  margin: 3rem 0;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.15);
`;

const ActionButtonDetailed = styled(ActionButton)`
  max-width: 320px;
  margin: 3rem auto 1rem;
  padding: 1.2rem 2.5rem;
  font-size: 1.15rem;
  letter-spacing: 1px;
  background: ${props => props.gradient || 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)'};
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  font-weight: bold;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
    filter: brightness(110%);
  }
`;

const LearnDisasters = () => {
  const [disasterContent, setDisasterContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uniqueTypes, setUniqueTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const isAuthenticated = localStorage.getItem('token');

  // Mova a definição de filteredContent para dentro do componente
  const filteredContent = selectedType 
    ? disasterContent.filter(item => item.disasterType === selectedType)
    : disasterContent;

  const totalPages = Math.ceil(filteredContent.length / itemsPerPage);

  const getCurrentPageContent = () => {
    if (!selectedType) {
      return disasterContent; // Retorna todos os itens quando não há filtro
    }
    // Mantém a paginação apenas para a visualização detalhada
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredContent.slice(startIndex, endIndex);
  };

  useEffect(() => {
    loadAllContent();
  }, []);

  const loadAllContent = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await content.getAll();
      
      if (!response.data || response.data.length === 0) {
        setError('Nenhuma informação encontrada. Por favor, tente novamente mais tarde.');
        setDisasterContent([]);
      } else {
        const types = [...new Set(response.data.map(item => item.disasterType))];
        setUniqueTypes(types);
        setSelectedType(null);
        setDisasterContent(response.data);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Erro ao carregar informações. Por favor, tente novamente mais tarde.');
      setDisasterContent([]);
    } finally {
      setLoading(false);
    }
  };

  const getDisasterIcon = (type) => {
    const icons = {
      ENCHENTE: '💧',
      TERREMOTO: '⚡',
      INCENDIO: '🔥',
      FURACAO: '🌀',
      TORNADO: '🌪️',
      DESLIZAMENTO: '⛰️',
      SECA: '☀️',
      TSUNAMI: '🌊',
      default: '⚠️'
    };
    return icons[type] || icons.default;
  };

  // Componente de paginação
  const Pagination = styled.div`
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
  `;

  const PageButton = styled(Button)`
    background: ${props => props.active ? 
      'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)' : 
      'rgba(255, 255, 255, 0.1)'};
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }
  `;

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
              {disaster.title}
            </CompactTitle>
            <CompactDescription>{disaster.description}</CompactDescription>
            <CompactFooter>
              <StatBadge>
                <TipIcon>📋</TipIcon>
                {(disaster.beforeTips?.length || 0) + 
                 (disaster.duringTips?.length || 0) + 
                 (disaster.afterTips?.length || 0)} dicas
              </StatBadge>
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
                  {disaster.title}
                </DetailedTitle>
                <DetailedDescription>{disaster.description}</DetailedDescription>
              </DetailedHeaderContent>
            </DetailedHeader>

            <DetailedBody>
              <DetailedContent>
                {disaster.beforeTips && disaster.beforeTips.length > 0 && (
                  <TipSectionDetailed>
                    <TipTitleDetailed color="#00f2fe">
                      <span>🎯</span>
                      Antes do Desastre
                    </TipTitleDetailed>
                    <TipListDetailed>
                      {disaster.beforeTips.map((tip, i) => (
                        <li key={i}>{tip}</li>
                      ))}
                    </TipListDetailed>
                  </TipSectionDetailed>
                )}

                {disaster.duringTips && disaster.duringTips.length > 0 && (
                  <TipSectionDetailed>
                    <TipTitleDetailed color="#f59e0b">
                      <span>⚡</span>
                      Durante o Desastre
                    </TipTitleDetailed>
                    <TipListDetailed>
                      {disaster.duringTips.map((tip, i) => (
                        <li key={i}>{tip}</li>
                      ))}
                    </TipListDetailed>
                  </TipSectionDetailed>
                )}

                {disaster.afterTips && disaster.afterTips.length > 0 && (
                  <TipSectionDetailed>
                    <TipTitleDetailed color="#10b981">
                      <span>🔄</span>
                      Após o Desastre
                    </TipTitleDetailed>
                    <TipListDetailed>
                      {disaster.afterTips.map((tip, i) => (
                        <li key={i}>{tip}</li>
                      ))}
                    </TipListDetailed>
                  </TipSectionDetailed>
                )}

                {disaster.videoUrl && (
                  <VideoContainerDetailed>
                    <div className="ratio ratio-16x9">
                      <iframe
                        src={disaster.videoUrl}
                        title={disaster.title}
                        allowFullScreen
                      ></iframe>
                    </div>
                  </VideoContainerDetailed>
                )}

                {isAuthenticated && (
                  <ActionButtonDetailed
                    as={Link}
                    to={`/quizzes?type=${disaster.disasterType}`}
                    gradient={gradient}
                  >
                    📝 Testar Conhecimentos
                  </ActionButtonDetailed>
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
        <ContentWrapper className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
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
              ? `Informações detalhadas sobre ${selectedType.toLowerCase()}`
              : 'Explore informações essenciais sobre diferentes tipos de desastres naturais'}
          </Subtitle>

          {!isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <StyledAlert className="text-center">
                <h5>Quer testar seus conhecimentos?</h5>
                <p className="mb-3">Faça login ou cadastre-se para acessar os quizzes!</p>
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
            {uniqueTypes.map(type => (
              <FilterButton
                key={type}
                active={selectedType === type}
                onClick={() => {
                  setSelectedType(type);
                  setCurrentPage(1);
                }}
              >
                {getDisasterIcon(type)} {type}
              </FilterButton>
            ))}
          </FilterSection>
        </HeaderSection>

        <Row className={selectedType ? 'justify-content-center' : ''}>
          {getCurrentPageContent().map((disaster, index) => 
            selectedType
              ? renderDetailedCard(disaster, index)
              : renderCompactCard(disaster, index)
          )}
        </Row>

        {/* Mostra paginação apenas quando um tipo está selecionado */}
        {selectedType && totalPages > 1 && (
          <Pagination>
            <PageButton
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            >
              ←
            </PageButton>
            {[...Array(totalPages)].map((_, i) => (
              <PageButton
                key={i + 1}
                active={currentPage === i + 1}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </PageButton>
            ))}
            <PageButton
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
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