import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { kits } from '../services/api';
import UnauthorizedContent from '../components/UnauthorizedContent';
import { motion } from 'framer-motion';
import styled from 'styled-components';

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

const KitCard = styled(motion(Card))`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  overflow: hidden;
  height: 100%;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }
`;

const KitCardBody = styled(Card.Body)`
  padding: 1.5rem;
  color: white;
`;

const KitTitle = styled.h3`
  font-size: 1.4rem;
  margin-bottom: 1.2rem;
  color: #fff;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  span {
    font-size: 1.6rem;
  }
`;

const KitInfo = styled.div`
  margin-bottom: 1.5rem;
  color: rgba(255, 255, 255, 0.9);
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.8rem;
  gap: 0.5rem;
  font-size: 1rem;

  span {
    opacity: 0.7;
    font-size: 1.1rem;
    margin-right: 0.3rem;
  }
`;

const KitActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: auto;
`;

const ActionButton = styled(Button)`
  flex: 1;
  padding: 0.8rem;
  border-radius: 12px;
  font-weight: 500;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);

  &:hover {
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

const getKitIcon = (houseType) => {
  const icons = {
    'CASA': '🏠',
    'APARTAMENTO': '🏢',
    'SITIO': '🏡',
    'OUTRO': '🏘️',
    default: '📦'
  };
  return icons[houseType] || icons.default;
};

const getRegionIcon = (region) => {
  const icons = {
    'URBANA': '🌆',
    'RURAL': '🌾',
    'COSTEIRA': '🏖️',
    'MONTANHOSA': '⛰️',
    default: '📍'
  };
  return icons[region] || icons.default;
};

const EmergencyKits = () => {
  const [userKits, setUserKits] = useState([]);
  const [error, setError] = useState('');
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
      setUserKits(response.data);
    } catch (err) {
      console.error('Error loading kits:', err);
      setError('Erro ao carregar os kits de emergência.');
    } finally {
      setLoading(false);
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

        {error && <StyledAlert variant="danger">{error}</StyledAlert>}

        {userKits.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <EmptyState>
              <EmptyStateTitle>Nenhum Kit Encontrado</EmptyStateTitle>
              <EmptyStateText>
                Você ainda não tem nenhum kit de emergência. 
                Que tal criar seu primeiro kit agora? Estar preparado é fundamental!
              </EmptyStateText>
              <CreateKitButton as={Link} to="/emergency-kits/new">
                Criar Meu Primeiro Kit
              </CreateKitButton>
            </EmptyState>
          </motion.div>
        ) : (
          <Row xs={1} md={2} lg={3} className="g-4">
            {userKits.map((kit, index) => (
              <Col key={kit.kitId}>
                <KitCard
                  as={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => navigate(`/emergency-kits/${kit.kitId}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <KitCardBody>
                    <KitTitle>
                      <span>{getKitIcon(kit.houseType)}</span>
                      Kit {kit.kitId}
                    </KitTitle>
                    <KitInfo>
                      <InfoItem>
                        <span>{getKitIcon(kit.houseType)}</span>
                        <strong>Residência:</strong> {kit.houseType}
                      </InfoItem>
                      <InfoItem>
                        <span>{getRegionIcon(kit.region)}</span>
                        <strong>Região:</strong> {kit.region}
                      </InfoItem>
                      <InfoItem>
                        <span>👥</span>
                        <strong>Moradores:</strong> {kit.numResidents}
                      </InfoItem>
                    </KitInfo>
                    <KitActions>
                      <ActionButton 
                        variant="primary"
                        onClick={() => navigate(`/emergency-kits/${kit.kitId}`)}
                      >
                        Ver Detalhes
                      </ActionButton>
                      <ActionButton variant="outline-danger">
                        Excluir
                      </ActionButton>
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