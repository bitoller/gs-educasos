import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { quiz } from '../services/api';
import { translateDisasterType, getDisasterDescription } from '../utils/translations';
import {
  PageContainer,
  ContentWrapper,
  HeaderSection,
  Title,
  Subtitle,
  QuizCard,
  QuizCardBody,
  QuizTitle,
  QuizDescription,
  BadgeContainer,
  StyledBadge,
  QuizButton,
  LoadingContainer
} from './QuizList.styles';

const getDisasterGradient = (type) => {
  const translatedType = translateDisasterType(type);
  const gradients = {
    ENCHENTE: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)',
    TERREMOTO: 'linear-gradient(135deg, #D97706 0%, #92400E 100%)',
    INCENDIO: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)',
    FURACAO: 'linear-gradient(135deg, #2563EB 0%, #1E3A8A 100%)',
    TORNADO: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
    DESLIZAMENTO: 'linear-gradient(135deg, #65A30D 0%, #3F6212 100%)',
    SECA: 'linear-gradient(135deg, #EA580C 0%, #9A3412 100%)',
    TSUNAMI: 'linear-gradient(135deg, #0891B2 0%, #155E75 100%)',
    TEMPESTADE: 'linear-gradient(135deg, #334155 0%, #0F172A 100%)',
    default: 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)'
  };
  return gradients[translatedType] || gradients.default;
};

const getDisasterIcon = (type) => {
  const translatedType = translateDisasterType(type);
  const icons = {
    ENCHENTE: '💧',
    TERREMOTO: '⚡',
    INCENDIO: '🔥',
    FURACAO: '🌀',
    TORNADO: '🌪️',
    DESLIZAMENTO: '⛰️',
    SECA: '☀️',
    TSUNAMI: '🌊',
    TEMPESTADE: '⛈️',
    default: '⚠️'
  };
  return icons[translatedType] || icons.default;
};

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
        setError(`Nenhum quiz encontrado para ${getDisasterDescription(filterType).toLowerCase()}`);
      }
    } catch (err) {
      setError('Erro ao carregar os quizzes. Por favor, tente novamente.');
      console.error('Error loading quizzes:', err);
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

  return (
    <PageContainer>
      <ContentWrapper>
        <HeaderSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Title>Teste Seus Conhecimentos</Title>
          <Subtitle>
            {location.search
              ? `Quizzes sobre ${getDisasterDescription(new URLSearchParams(location.search).get('type')).toLowerCase()}`
              : 'Avalie sua preparação para diferentes tipos de desastres naturais'}
          </Subtitle>
        </HeaderSection>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-4"
          >
            <p className="text-danger">{error}</p>
          </motion.div>
        )}

        <Container>
          <Row>
            {quizzes.map((quiz, index) => (
              <Col key={quiz.quizId} lg={4} md={6} className="mb-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <QuizCard
                    gradient={getDisasterGradient(quiz.disasterType)}
                    onClick={() => navigate(`/quiz/${quiz.quizId}`)}
                  >
                    <QuizCardBody>
                      <QuizTitle>
                        <span>{getDisasterIcon(quiz.disasterType)}</span>
                        {quiz.title}
                      </QuizTitle>
                      <QuizDescription>
                        Teste seus conhecimentos sobre {getDisasterDescription(quiz.disasterType).toLowerCase()} e 
                        aprenda como se preparar adequadamente para este tipo de desastre.
                      </QuizDescription>
                      <BadgeContainer>
                        <StyledBadge position="first" type={translateDisasterType(quiz.disasterType)}>
                          {getDisasterDescription(quiz.disasterType)}
                        </StyledBadge>
                        <StyledBadge position="second">
                          {quiz.estimatedTime || '5-10'} minutos
                        </StyledBadge>
                        <StyledBadge position="third">
                          5 questões
                        </StyledBadge>
                      </BadgeContainer>
                      <QuizButton>
                        Iniciar Quiz →
                      </QuizButton>
                    </QuizCardBody>
                  </QuizCard>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </ContentWrapper>
    </PageContainer>
  );
};

export default QuizList; 