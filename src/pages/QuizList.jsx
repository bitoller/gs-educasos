import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { quiz } from '../services/api';
import { motion } from 'framer-motion';

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await quiz.getAll();
      console.log('Dados dos quizzes:', response.data);
      setQuizzes(response.data);
    } catch (err) {
      setError('Erro ao carregar os quizzes. Por favor, tente novamente.');
      console.error('Error loading quizzes:', err);
    } finally {
      setLoading(false);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
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
      </Container>
    );
  }

  return (
    <Container className="mt-5 pt-5">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-center mb-5">Quizzes Disponíveis</h2>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
      >
        <Row xs={1} md={2} lg={3} className="g-4">
          {quizzes.map((quiz) => (
            <Col key={quiz.quizId}>
              <motion.div variants={item}>
                <Card 
                  className="h-100 shadow-sm" 
                  style={{ 
                    cursor: 'pointer',
                    transition: 'transform 0.2s'
                  }}
                >
                  <Card.Body>
                    <Card.Title>{quiz.title}</Card.Title>
                    <Card.Text>
                      Tipo: {quiz.disasterType}
                    </Card.Text>
                    <div className="d-flex align-items-center">
                      <Badge bg="info" className="me-2">
                        {quiz.disasterType}
                      </Badge>
                      <Badge bg="success">
                        {quiz.estimatedTime || '5-10'} minutos
                      </Badge>
                    </div>
                  </Card.Body>
                  <Card.Footer className="bg-transparent border-top-0">
                    <Button 
                      variant="outline-primary" 
                      className="w-100"
                      onClick={() => navigate(`/quiz/${quiz.quizId}`)}
                    >
                      Iniciar Quiz
                    </Button>
                  </Card.Footer>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </motion.div>
    </Container>
  );
};

export default QuizList; 