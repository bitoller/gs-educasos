import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useState } from 'react';
import { FaQuestionCircle } from 'react-icons/fa';

const sampleQuestion = {
  question: 'Qual é o item mais importante em um kit de emergência?',
  options: [
    'Água potável',
    'Lanterna',
    'Documentos pessoais',
    'Rádio portátil',
  ],
  correct: 0,
};

const Quiz = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <Container className="py-5">
      {/* Hero Section */}
      <Row className="justify-content-center mb-5">
        <Col xs={12} md={10} lg={8} className="text-center">
          <FaQuestionCircle size={48} color="#ffc107" className="mb-3" />
          <h1 className="display-4 fw-bold mb-2">Quiz de Preparação</h1>
          <h2 className="h5 text-secondary mb-4">Teste seus conhecimentos sobre preparação para desastres.</h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Label className="fw-bold mb-3">{sampleQuestion.question}</Form.Label>
                {sampleQuestion.options.map((option, idx) => (
                  <Form.Check
                    key={option}
                    type="radio"
                    name="quiz"
                    label={option}
                    checked={selected === idx}
                    onChange={() => setSelected(idx)}
                    className="mb-2"
                  />
                ))}
                <Button type="submit" variant="primary" className="mt-3 w-100">Responder</Button>
                {submitted && (
                  <div className={`mt-3 fw-bold ${selected === sampleQuestion.correct ? 'text-success' : 'text-danger'}`}>
                    {selected === sampleQuestion.correct ? 'Correto!' : 'Resposta incorreta.'}
                  </div>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Quiz; 