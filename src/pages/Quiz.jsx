import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Button,
  Row,
  Col,
  ProgressBar,
  Badge,
  Alert,
  Spinner,
} from "react-bootstrap";
import { useParams, useNavigate, Link } from "react-router-dom";
import { quiz, auth } from "../services/api";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { useAuth } from "../contexts/AuthContext";
import styled from "styled-components";

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1c2e 0%, #16213e 100%);
  padding: 5rem 0 2rem;
`;

const QuizCard = styled(Card)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
`;

const QuizHeader = styled(Card.Header)`
  background: rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
`;

const QuizTitle = styled.h3`
  color: #fff;
  margin: 0;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const QuestionBadge = styled(Badge)`
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%);
  border: none;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
`;

const QuizBody = styled(Card.Body)`
  padding: 2rem;
  color: #fff;
`;

const QuestionText = styled.h4`
  font-size: 1.4rem;
  margin-bottom: 2rem;
  color: #fff;
  line-height: 1.5;
  font-weight: 500;
`;

const StyledProgressBar = styled(ProgressBar)`
  height: 10px;
  border-radius: 5px;
  margin-bottom: 2rem;
  background-color: rgba(255, 255, 255, 0.1);

  .progress-bar {
    background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%);
    box-shadow: 0 2px 5px rgba(0, 242, 254, 0.3);
  }
`;

const AnswerButton = styled(Button)`
  background: ${(props) =>
    props.selected
      ? "linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)"
      : "rgba(255, 255, 255, 0.1)"};
  border: 1px solid
    ${(props) =>
      props.selected ? "rgba(0, 242, 254, 0.5)" : "rgba(255, 255, 255, 0.2)"};
  color: white;
  padding: 1.2rem;
  border-radius: 15px;
  font-weight: 500;
  transition: all 0.3s ease;
  width: 100%;
  text-align: left;
  margin-bottom: 1rem;
  backdrop-filter: blur(5px);

  &:hover {
    background: ${(props) =>
      props.selected
        ? "linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)"
        : "rgba(255, 255, 255, 0.15)"};
    border-color: ${(props) =>
      props.selected ? "rgba(0, 242, 254, 0.6)" : "rgba(255, 255, 255, 0.3)"};
    transform: translateY(-2px);
    color: white;
  }

  &:active {
    transform: translateY(0);
  }
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  gap: 1rem;
`;

const NavButton = styled(Button)`
  padding: 0.8rem 2rem;
  border-radius: 25px;
  font-weight: 500;
  min-width: 120px;
  transition: all 0.3s ease;

  &:not(:disabled):hover {
    transform: translateY(-2px);
  }

  &:not(:disabled):active {
    transform: translateY(0);
  }
`;

const ResultCard = styled(Card)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  overflow: hidden;
  text-align: center;
  color: white;
  padding: 3rem 2rem;
`;

const ResultTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
`;

const ScoreBadge = styled(Badge)`
  font-size: 2rem;
  padding: 1rem 2rem;
  border-radius: 30px;
  margin-bottom: 2rem;
  background: ${(props) =>
    props.score >= 70
      ? "linear-gradient(135deg, #10B981 0%, #059669 100%)"
      : "linear-gradient(135deg, #F59E0B 0%, #B45309 100%)"};
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
`;

const ResultMessage = styled.p`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
  line-height: 1.6;
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

const Quiz = () => {
  const [quizData, setQuizData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
      setError("");
      const response = await quiz.getById(id);
      setQuizData(response.data);
    } catch (err) {
      setError("Erro ao carregar o quiz. Por favor, tente novamente.");
      console.error("Error loading quiz:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId, choiceId) => {
    if (!user) {
      navigate("/login", { state: { from: `/quiz/${id}` } });
      return;
    }
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: choiceId,
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
    return (
      (Object.keys(selectedAnswers).length / quizData.questions.length) * 100
    );
  };

  const handleSubmit = async () => {
    if (!user) {
      navigate("/login", { state: { from: `/quiz/${id}` } });
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const response = await quiz.submitAnswers(
        quizData.quizId,
        selectedAnswers
      );
      console.log("Quiz submission response:", response.data);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const userResponse = await auth.getUserData();
      if (userResponse.data) {
        console.log("Fresh user data after quiz:", userResponse.data);
        login(userResponse.data);
      }

      setScore(response.data.scoreEarned);
      setQuizCompleted(true);

      if (response.data.scoreEarned >= 70) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (err) {
      setError("Erro ao enviar respostas. Por favor, tente novamente.");
      console.error("Error submitting quiz:", err);
    } finally {
      setSubmitting(false);
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

  if (error) {
    return (
      <PageContainer>
        <Container>
          <StyledAlert variant="danger">{error}</StyledAlert>
          <NavButton variant="primary" onClick={() => navigate("/quizzes")}>
            Voltar para Lista de Quizzes
          </NavButton>
        </Container>
      </PageContainer>
    );
  }

  if (quizCompleted) {
    return (
      <PageContainer>
        <Container>
          <Row className="justify-content-center">
            <Col md={8}>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <ResultCard>
                  <ResultTitle>Quiz Concluído!</ResultTitle>
                  <ScoreBadge score={score}>{score}%</ScoreBadge>
                  <ResultMessage>
                    {score >= 70
                      ? "Parabéns! Você demonstrou um ótimo conhecimento sobre este tema. Continue aprendendo e se preparando!"
                      : "Continue estudando e praticando. A preparação é fundamental para lidar com desastres naturais."}
                  </ResultMessage>
                  <NavButton
                    variant="primary"
                    onClick={() => navigate("/quizzes")}
                  >
                    Voltar para Lista de Quizzes
                  </NavButton>
                </ResultCard>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </PageContainer>
    );
  }

  const currentQuestionData = quizData?.questions[currentQuestion];

  return (
    <PageContainer>
      <Container>
        <Row className="justify-content-center">
          <Col md={8}>
            <QuizCard>
              <QuizHeader>
                <div className="d-flex justify-content-between align-items-center">
                  <QuizTitle>{quizData.title}</QuizTitle>
                  <QuestionBadge>
                    Questão {currentQuestion + 1} de {quizData.questions.length}
                  </QuestionBadge>
                </div>
              </QuizHeader>
              <QuizBody>
                {!user && (
                  <StyledAlert>
                    <Alert.Heading>Faça login para responder!</Alert.Heading>
                    <p className="mb-3">
                      Para responder este quiz e salvar sua pontuação, você
                      precisa estar logado.
                    </p>
                    <div className="d-flex gap-2">
                      <NavButton as={Link} to="/login" variant="primary">
                        Fazer Login
                      </NavButton>
                      <NavButton
                        as={Link}
                        to="/register"
                        variant="outline-light"
                      >
                        Criar Conta
                      </NavButton>
                    </div>
                  </StyledAlert>
                )}

                <StyledProgressBar
                  now={calculateProgress()}
                  label={`${Math.round(calculateProgress())}%`}
                />

                <motion.div
                  key={currentQuestion}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -50, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <QuestionText>
                    {currentQuestionData.questionText}
                  </QuestionText>

                  {currentQuestionData.answerChoices.map((choice) => (
                    <motion.div
                      key={choice.choiceId}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <AnswerButton
                        selected={
                          selectedAnswers[currentQuestionData.questionId] ===
                          choice.choiceId
                        }
                        onClick={() =>
                          handleAnswerSelect(
                            currentQuestionData.questionId,
                            choice.choiceId
                          )
                        }
                      >
                        {choice.choiceText}
                      </AnswerButton>
                    </motion.div>
                  ))}
                </motion.div>

                <NavigationButtons>
                  <NavButton
                    variant="outline-light"
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                  >
                    ← Anterior
                  </NavButton>

                  {currentQuestion === quizData.questions.length - 1 ? (
                    <NavButton
                      variant="success"
                      onClick={handleSubmit}
                      disabled={
                        submitting ||
                        Object.keys(selectedAnswers).length !==
                          quizData.questions.length
                      }
                    >
                      {submitting ? "Enviando..." : "Finalizar Quiz"}
                    </NavButton>
                  ) : (
                    <NavButton
                      variant="primary"
                      onClick={handleNext}
                      disabled={
                        !isQuestionAnswered(currentQuestionData.questionId)
                      }
                    >
                      Próxima →
                    </NavButton>
                  )}
                </NavigationButtons>
              </QuizBody>
            </QuizCard>
          </Col>
        </Row>
      </Container>
    </PageContainer>
  );
};

export default Quiz;
