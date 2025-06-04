import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
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

const KitInfo = styled(Card)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  color: white;
  margin-bottom: 2rem;
`;

const KitInfoBody = styled(Card.Body)`
  padding: 1.5rem;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.1rem;

  span {
    font-size: 1.4rem;
  }

  strong {
    color: rgba(255, 255, 255, 0.7);
    font-weight: normal;
    margin-right: 0.5rem;
  }
`;

const SectionTitle = styled.h3`
  color: #fff;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
`;

const ItemCard = styled(motion(Card))`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  height: 100%;
  transition: all 0.3s ease;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }
`;

const ItemCardBody = styled(Card.Body)`
  padding: 1.5rem;
  color: white;
`;

const ItemTitle = styled.h4`
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  span {
    font-size: 1.5rem;
  }
`;

const ItemDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  margin-bottom: 1rem;
`;

const ItemQuantity = styled(Badge)`
  background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%);
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  margin-bottom: 1rem;
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

const getItemIcon = (category) => {
  const icons = {
    'AGUA': '💧',
    'ALIMENTO': '🥫',
    'MEDICAMENTO': '💊',
    'HIGIENE': '🧼',
    'DOCUMENTO': '📄',
    'FERRAMENTA': '🔧',
    'ROUPA': '👕',
    'COMUNICACAO': '📱',
    'PRIMEIROS_SOCORROS': '🏥',
    default: '📦'
  };
  return icons[category] || icons.default;
};

const KitDetails = () => {
  const [kit, setKit] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadKit();
  }, [id, user]);

  const loadKit = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await kits.getById(id);
      setKit(response.data);
    } catch (err) {
      console.error('Error loading kit:', err);
      setError('Erro ao carregar os detalhes do kit.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingContainer>
          <Spinner animation="border" variant="info" size="lg" />
        </LoadingContainer>
      </PageContainer>
    );
  }

  if (error || !kit) {
    return (
      <PageContainer>
        <Container>
          <BackButton onClick={() => navigate('/emergency-kits')}>
            ← Voltar para Kits
          </BackButton>
          <StyledAlert variant="danger">
            {error || 'Kit não encontrado.'}
          </StyledAlert>
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
          <PageHeader>
            <BackButton onClick={() => navigate('/emergency-kits')}>
              ← Voltar para Kits
            </BackButton>
            <PageTitle>
              <span>📦</span>
              Kit de Emergência #{kit.kitId}
            </PageTitle>
          </PageHeader>

          <KitInfo>
            <KitInfoBody>
              <InfoGrid>
                <InfoItem>
                  <span>🏠</span>
                  <div>
                    <strong>Tipo de Residência</strong>
                    {kit.houseType}
                  </div>
                </InfoItem>
                <InfoItem>
                  <span>📍</span>
                  <div>
                    <strong>Região</strong>
                    {kit.region}
                  </div>
                </InfoItem>
                <InfoItem>
                  <span>👥</span>
                  <div>
                    <strong>Moradores</strong>
                    {kit.numResidents} pessoas
                  </div>
                </InfoItem>
                <InfoItem>
                  <span>⚡</span>
                  <div>
                    <strong>Última Atualização</strong>
                    {new Date(kit.lastUpdated).toLocaleDateString()}
                  </div>
                </InfoItem>
              </InfoGrid>
            </KitInfoBody>
          </KitInfo>

          <SectionTitle>Itens do Kit</SectionTitle>
          <Row xs={1} md={2} lg={3} className="g-4">
            {kit.items.map((item, index) => (
              <Col key={item.itemId}>
                <ItemCard
                  as={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ItemCardBody>
                    <ItemTitle>
                      <span>{getItemIcon(item.category)}</span>
                      {item.name}
                    </ItemTitle>
                    <ItemDescription>
                      {item.description}
                    </ItemDescription>
                    <ItemQuantity>
                      Quantidade: {item.quantity} {item.unit}
                    </ItemQuantity>
                    <div>
                      <strong>Validade:</strong>{' '}
                      {item.expirationDate ? new Date(item.expirationDate).toLocaleDateString() : 'N/A'}
                    </div>
                  </ItemCardBody>
                </ItemCard>
              </Col>
            ))}
          </Row>
        </motion.div>
      </Container>
    </PageContainer>
  );
};

export default KitDetails; 