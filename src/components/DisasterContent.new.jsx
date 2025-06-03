import React, { useState } from 'react';
import { Card, Row, Col, Button, Modal } from 'react-bootstrap';

const disasterData = {
  flood: {
    title: 'Enchentes',
    description: 'As enchentes são um dos desastres naturais mais comuns no Brasil, especialmente durante a estação chuvosa. Elas ocorrem quando há um aumento significativo no nível dos rios, causando o transbordamento de água para áreas normalmente secas.',
    videoUrl: 'https://www.youtube.com/embed/example-flood',
    imageUrl: '/images/flood.jpg',
    beforeTips: [
      'Mantenha os documentos importantes em local alto e seco',
      'Prepare um kit de emergência',
      'Fique atento aos alertas meteorológicos',
      'Limpe calhas e bueiros próximos à sua residência'
    ],
    duringTips: [
      'Desligue a energia elétrica',
      'Evite contato com a água da enchente',
      'Procure locais altos',
      'Siga as orientações da Defesa Civil'
    ],
    afterTips: [
      'Não retorne para casa até ser autorizado',
      'Limpe e desinfete os objetos que tiveram contato com a água',
      'Beba apenas água potável',
      'Fique atento a doenças típicas pós-enchente'
    ]
  },
  landslide: {
    title: 'Deslizamentos',
    description: 'Deslizamentos são movimentos de descida de solos e rochas que ocorrem em terrenos inclinados. No Brasil, são frequentemente causados por chuvas intensas, especialmente em áreas com ocupação irregular ou desmatamento.',
    videoUrl: 'https://www.youtube.com/embed/example-landslide',
    imageUrl: '/images/landslide.jpg',
    beforeTips: [
      'Observe sinais como rachaduras nas paredes',
      'Não construa em áreas de risco',
      'Evite cortes no terreno sem autorização',
      'Mantenha a vegetação no terreno'
    ],
    duringTips: [
      'Saia imediatamente do local',
      'Avise os vizinhos',
      'Siga o plano de evacuação',
      'Procure um local seguro'
    ],
    afterTips: [
      'Não retorne até a área ser considerada segura',
      'Avalie os danos estruturais',
      'Colabore com as autoridades',
      'Participe da recuperação da área'
    ]
  },
  wildfire: {
    title: 'Queimadas',
    description: 'As queimadas são incêndios que atingem vegetação, sejam elas naturais ou causadas pelo homem. No Brasil, são mais comuns durante o período de seca e podem causar graves danos ambientais e à saúde.',
    videoUrl: 'https://www.youtube.com/embed/example-wildfire',
    imageUrl: '/images/wildfire.jpg',
    beforeTips: [
      'Mantenha o terreno limpo',
      'Não faça fogueiras em áreas de risco',
      'Tenha um plano de evacuação',
      'Guarde documentos importantes em local seguro'
    ],
    duringTips: [
      'Evacue imediatamente se necessário',
      'Proteja-se da fumaça',
      'Mantenha-se informado',
      'Siga as orientações dos bombeiros'
    ],
    afterTips: [
      'Aguarde autorização para retornar',
      'Verifique danos estruturais',
      'Monitore a qualidade do ar',
      'Participe da recuperação da área'
    ]
  },
  drought: {
    title: 'Seca',
    description: 'A seca é um período prolongado de baixa ou ausência de chuvas, que afeta o abastecimento de água e a agricultura. No Brasil, é mais comum no Nordeste e em períodos específicos em outras regiões.',
    videoUrl: 'https://www.youtube.com/embed/example-drought',
    imageUrl: '/images/drought.jpg',
    beforeTips: [
      'Economize água',
      'Faça captação de água da chuva',
      'Mantenha reservatórios limpos',
      'Planeje o uso racional da água'
    ],
    duringTips: [
      'Use água com consciência',
      'Reutilize água quando possível',
      'Siga o racionamento estabelecido',
      'Evite desperdícios'
    ],
    afterTips: [
      'Mantenha os hábitos de economia',
      'Verifique a qualidade da água',
      'Recupere reservatórios',
      'Prepare-se para próximos períodos'
    ]
  },
  storm: {
    title: 'Tempestades',
    description: 'Tempestades são eventos climáticos caracterizados por chuvas intensas, ventos fortes, raios e às vezes granizo. No Brasil, são mais comuns durante o verão e podem causar diversos transtornos urbanos.',
    videoUrl: 'https://www.youtube.com/embed/example-storm',
    imageUrl: '/images/storm.jpg',
    beforeTips: [
      'Verifique o estado do telhado',
      'Limpe calhas e ralos',
      'Pode árvores com risco de queda',
      'Prepare um kit de emergência'
    ],
    duringTips: [
      'Fique em local seguro',
      'Evite áreas abertas',
      'Desligue aparelhos elétricos',
      'Mantenha-se informado'
    ],
    afterTips: [
      'Verifique danos estruturais',
      'Evite áreas alagadas',
      'Cuidado com fios soltos',
      'Ajude vizinhos se necessário'
    ]
  }
};

const DisasterContent = ({ disasterId }) => {
  const [showTips, setShowTips] = useState(false);
  const [tipType, setTipType] = useState('');
  
  const disaster = disasterData[disasterId];

  const handleShowTips = (type) => {
    setTipType(type);
    setShowTips(true);
  };

  const getTipsTitle = () => {
    switch (tipType) {
      case 'before':
        return 'O que fazer antes';
      case 'during':
        return 'O que fazer durante';
      case 'after':
        return 'O que fazer depois';
      default:
        return '';
    }
  };

  const getTips = () => {
    switch (tipType) {
      case 'before':
        return disaster.beforeTips;
      case 'during':
        return disaster.duringTips;
      case 'after':
        return disaster.afterTips;
      default:
        return [];
    }
  };

  return (
    <>
      <Card className="border-0 shadow-sm">
        <Card.Body>
          <Row>
            <Col md={6}>
              <div className="ratio ratio-16x9 mb-4">
                <iframe
                  src={disaster.videoUrl}
                  title={disaster.title}
                  allowFullScreen
                  className="rounded"
                ></iframe>
              </div>
            </Col>
            <Col md={6}>
              <h2 className="mb-3">{disaster.title}</h2>
              <p className="lead mb-4">{disaster.description}</p>
              <div className="d-grid gap-2">
                <Button 
                  variant="outline-primary" 
                  onClick={() => handleShowTips('before')}
                >
                  O que fazer antes
                </Button>
                <Button 
                  variant="outline-warning" 
                  onClick={() => handleShowTips('during')}
                >
                  O que fazer durante
                </Button>
                <Button 
                  variant="outline-success" 
                  onClick={() => handleShowTips('after')}
                >
                  O que fazer depois
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Modal
        show={showTips}
        onHide={() => setShowTips(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{getTipsTitle()} - {disaster.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul className="list-group list-group-flush">
            {getTips().map((tip, index) => (
              <li key={index} className="list-group-item">
                <i className="bi bi-check2-circle text-success me-2"></i>
                {tip}
              </li>
            ))}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowTips(false)}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx>{`
        .card {
          transition: all 0.3s ease;
        }
        
        .card:hover {
          transform: translateY(-5px);
        }
        
        .list-group-item {
          border: none;
          padding: 1rem 0;
        }
        
        .modal-content {
          border: none;
          border-radius: 8px;
        }
      `}</style>
    </>
  );
};

export default DisasterContent; 