import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert } from 'react-bootstrap';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { quiz } from '../services/api';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1c2e 0%, #16213e 100%);
  padding: 5rem 0 2rem;
`;

const PageTitle = styled.h2`
  color: #fff;
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 10px rgba(0, 242, 254, 0.2);
`;

const PageSubtitle = styled.p`
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  font-size: 1.1rem;
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const QuizCard = styled(motion(Card))`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  height: 100%;
  transition: all 0.3s ease;
  overflow: hidden;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }
`;

const QuizCardBody = styled(Card.Body)`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const QuizTitle = styled.h3`
  color: #fff;
  font-size: 1.4rem;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const QuizDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  margin-bottom: 1.5rem;
  flex-grow: 1;
`;

const BadgeContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const StyledBadge = styled(Badge)`
  font-size: 0.85rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background: ${props => {
    switch (props.type) {
      case 'ENCHENTE':
        return 'linear-gradient(135deg, #0EA5E9 0%, #0369A1 100%)';
      case 'TERREMOTO':
        return 'linear-gradient(135deg, #F59E0B 0%, #B45309 100%)';
      case 'INCENDIO':
        return 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)';
      case 'FURACAO':
        return 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)';
      case 'TORNADO':
        return 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)';
      case 'DESLIZAMENTO':
        return 'linear-gradient(135deg, #84CC16 0%, #4D7C0F 100%)';
      case 'SECA':
        return 'linear-gradient(135deg, #F97316 0%, #C2410C 100%)';
      case 'TSUNAMI':
        return 'linear-gradient(135deg, #06B6D4 0%, #0E7490 100%)';
      default:
        return 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)';
    }
  }};
  border: none;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
`;

const QuizButton = styled(Button)`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  font-weight: 500;
  transition: all 0.3s ease;
  width: 100%;
  backdrop-filter: blur(5px);

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
    color: white;
  }

  &:active {
    transform: translateY(0);
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

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  color: white;
`;

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await quiz.getAll();
      
      const params = new URLSearchParams(location.search);
      const filterType = params.get('type');
      
      const filteredQuizzes = filterType
        ? response.data.filter(q => q.disasterType === filterType)
        : response.data;
      
      setQuizzes(filteredQuizzes);
      
      if (filterType && filteredQuizzes.length === 0) {
        setError(`Nenhum quiz encontrado para o tipo ${filterType}`);
      }
    } catch (err) {
      setError('Erro ao carregar os quizzes. Por favor, tente novamente.');
      console.error('Error loading quizzes:', err);
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
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <PageTitle>Teste Seus Conhecimentos</PageTitle>
          <PageSubtitle>
            Escolha um quiz para avaliar seu conhecimento sobre diferentes tipos de desastres naturais
            e aprenda como se preparar melhor.
          </PageSubtitle>

          {error && <StyledAlert variant="danger">{error}</StyledAlert>}
        </motion.div>

        <Row xs={1} md={2} lg={3} className="g-4">
          {quizzes.map((quiz, index) => (
            <Col key={quiz.quizId}>
              <QuizCard
                as={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => navigate(`/quiz/${quiz.quizId}`)}
              >
                <QuizCardBody>
                  <QuizTitle>
                    <span style={{ marginRight: '0.5rem' }}>
                      {getDisasterIcon(quiz.disasterType)}
                    </span>
                    {quiz.title}
                  </QuizTitle>
                  <QuizDescription>
                    Teste seus conhecimentos sobre {quiz.disasterType.toLowerCase()} e 
                    aprenda como se preparar adequadamente para este tipo de desastre.
                  </QuizDescription>
                  <BadgeContainer>
                    <StyledBadge type={quiz.disasterType}>
                      {quiz.disasterType}
                    </StyledBadge>
                    <StyledBadge bg="info">
                      {quiz.estimatedTime || '5-10'} minutos
                    </StyledBadge>
                    <StyledBadge bg="success">
                      10 questões
                    </StyledBadge>
                  </BadgeContainer>
                  <QuizButton>
                    Iniciar Quiz →
                  </QuizButton>
                </QuizCardBody>
              </QuizCard>
            </Col>
          ))}
        </Row>
      </Container>
    </PageContainer>
  );
};

export default QuizList; 