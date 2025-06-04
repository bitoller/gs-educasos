import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Row, Col, ProgressBar, Badge, Alert, Spinner } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { quiz } from '../services/api';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useAuth } from '../contexts/AuthContext';
import UnauthorizedContent from '../components/UnauthorizedContent';

const Quiz = () => {
  const [quizData, setQuizData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, login } = useAuth();

  useEffect(() => {
    loadQuiz();
  }, [id]);

  const loadQuiz = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await quiz.getById(id);
      setQuizData(response.data);
    } catch (err) {
      setError('Erro ao carregar o quiz. Por favor, tente novamente.');
      console.error('Error loading quiz:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId, choiceId) => {
    if (!user) {
      navigate('/login', { state: { from: `/quiz/${id}` } });
      return;
    }
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: choiceId
    });
  };

  const isQuestionAnswered = (questionId) => {
    return selectedAnswers[questionId] !== undefined;
  };

  const handleNext = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateProgress = () => {
    if (!quizData) return 0;
    return (Object.keys(selectedAnswers).length / quizData.questions.length) * 100;
  };

  const handleSubmit = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/quiz/${id}` } });
      return;
    }
    try {
      setSubmitting(true);
      setError('');

      const response = await quiz.submitAnswers(quizData.quizId, selectedAnswers);
      setScore(response.data.scoreEarned);
      setQuizCompleted(true);

      // Atualiza os dados do usuário no contexto
      const updatedUser = {
        ...user,
        score: response.data.totalScore,
        completedQuizzes: (user.completedQuizzes || 0) + 1,
        averageScore: response.data.averageScore
      };
      login(updatedUser);

      // Dispara o confetti se acertou mais de 70%
      if (response.data.scoreEarned >= 70) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      setError('Erro ao enviar respostas. Por favor, tente novamente.');
      console.error('Error submitting quiz:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container className="mt-5 pt-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Carregando...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5 pt-5">
        <Alert variant="danger">{error}</Alert>
        <Button variant="primary" onClick={() => navigate('/quizzes')}>
          Voltar para Lista de Quizzes
        </Button>
      </Container>
    );
  }

  if (quizCompleted) {
    return (
      <Container className="mt-5 pt-5">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="text-center shadow">
            <Card.Body>
              <h2 className="mb-4">Quiz Concluído!</h2>
              <h3 className="mb-4">
                Sua pontuação: <Badge bg={score >= 70 ? "success" : "warning"}>{score}%</Badge>
              </h3>
              <p className="lead mb-4">
                {score >= 70 
                  ? "Parabéns! Você demonstrou um ótimo conhecimento!" 
                  : "Continue estudando e tente novamente!"}
              </p>
              <Button variant="primary" onClick={() => navigate('/quizzes')}>
                Voltar para Lista de Quizzes
              </Button>
            </Card.Body>
          </Card>
        </motion.div>
      </Container>
    );
  }

  const currentQuestionData = quizData?.questions[currentQuestion];

  return (
    <Container className="mt-5 pt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow">
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h3 className="mb-0">{quizData.title}</h3>
                <Badge bg="primary">
                  Questão {currentQuestion + 1} de {quizData.questions.length}
                </Badge>
              </div>
            </Card.Header>
            <Card.Body>
              {!user && (
                <Alert variant="info" className="mb-4">
                  <Alert.Heading>Faça login para responder!</Alert.Heading>
                  <p>
                    Para responder este quiz e salvar sua pontuação, você precisa estar logado.
                  </p>
                  <div className="d-flex gap-2">
                    <Button as={Link} to="/login" variant="primary">
                      Fazer Login
                    </Button>
                    <Button as={Link} to="/register" variant="outline-primary">
                      Criar Conta
                    </Button>
                  </div>
                </Alert>
              )}

              <ProgressBar 
                now={calculateProgress()} 
                label={`${Math.round(calculateProgress())}%`}
                className="mb-4"
              />

              <motion.div
                key={currentQuestion}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h4 className="mb-4">{currentQuestionData.questionText}</h4>

                {currentQuestionData.answerChoices.map((choice) => (
                  <motion.div
                    key={choice.choiceId}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant={selectedAnswers[currentQuestionData.questionId] === choice.choiceId 
                        ? "primary" 
                        : "outline-primary"}
                      className="w-100 mb-3 text-start p-3"
                      onClick={() => handleAnswerSelect(currentQuestionData.questionId, choice.choiceId)}
                    >
                      {choice.choiceText}
                    </Button>
                  </motion.div>
                ))}
              </motion.div>

              <div className="d-flex justify-content-between mt-4">
                <Button
                  variant="outline-secondary"
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                >
                  Anterior
                </Button>

                {currentQuestion === quizData.questions.length - 1 ? (
                  <Button
                    variant="success"
                    onClick={handleSubmit}
                    disabled={submitting || Object.keys(selectedAnswers).length !== quizData.questions.length}
                  >
                    {submitting ? 'Enviando...' : 'Finalizar Quiz'}
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    onClick={handleNext}
                    disabled={!isQuestionAnswered(currentQuestionData.questionId)}
                  >
                    Próxima
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Quiz; 