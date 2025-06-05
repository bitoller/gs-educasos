import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Card, Button } from 'react-bootstrap';

export const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1c2e 0%, #16213e 100%);
  padding: 5rem 0 2rem;
`;

export const ContentWrapper = styled.div`
  max-width: 100%;
  padding: 0 2rem;
`;

export const HeaderSection = styled(motion.div)`
  margin-bottom: 3rem;
  text-align: center;
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 10px rgba(0, 242, 254, 0.2);
`;

export const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.2rem;
  margin-bottom: 2rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

export const QuizCard = styled(motion.div)`
  background: ${props => props.gradient || 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)'};
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.3s ease;
  height: 360px;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-5px);
  }
`;

export const QuizCardBody = styled.div`
  padding: 1.75rem;
  height: 100%;
  display: grid;
  grid-template-rows: auto 1fr auto auto;
  gap: 1.25rem;
`;

export const QuizTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 600;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  height: 3rem;
  margin: 0;

  span {
    font-size: 1.6rem;
  }
`;

export const QuizDescription = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const BadgeContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  width: 100%;
`;

export const StyledBadge = styled.span`
  background: ${props => {
    // Cores específicas para cada posição do badge
    if (props.position === 'first') {
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
        default: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))'
      };
      return props.type ? gradients[props.type] || gradients.default : gradients.default;
    }
    if (props.position === 'second') {
      return 'linear-gradient(135deg, #475569 0%, #1E293B 100%)';
    }
    if (props.position === 'third') {
      return 'linear-gradient(135deg, #64748B 0%, #334155 100%)';
    }
    return 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))';
  }};
  color: white;
  padding: 0.5rem;
  border-radius: 16px;
  font-size: 0.8125rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  backdrop-filter: blur(5px);
  white-space: nowrap;
  text-align: center;
  letter-spacing: 0.02em;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  height: 32px;
  overflow: hidden;
  text-overflow: ellipsis;

  &::before {
    content: ${props => {
      if (props.position === 'second') return '"⏱️"';
      if (props.position === 'third') return '"📝"';
      return '""';
    }};
    margin-right: ${props => (props.position === 'second' || props.position === 'third') ? '0.25rem' : '0'};
  }
`;

export const QuizButton = styled(Button)`
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  color: white;
  font-weight: 500;
  transition: all 0.3s ease;
  width: 100%;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.4);
    color: white;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`; 