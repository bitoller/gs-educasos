import styled from "styled-components";
import { Button, Card, Tabs } from "react-bootstrap";
import { motion } from "framer-motion";

const MotionDiv = styled(motion.div)``;

export const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1c2e 0%, #16213e 100%);
  padding: 5rem 0 2rem;
`;

export const ContentWrapper = styled.div`
  max-width: 100%;
  padding: 0 2rem;
`;

export const HeaderSection = styled(MotionDiv)`
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

export const Subtitle = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.2rem;
  margin-bottom: 2rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

export const FilterSection = styled(MotionDiv)`
  margin-bottom: 3rem;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const FilterButton = styled(Button)`
  background: ${(props) =>
    props.active
      ? "linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)"
      : "rgba(255, 255, 255, 0.1)"};
  border: none;
  margin: 0 0.25rem;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);

  &:hover {
    transform: translateY(-2px);
    background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%);
    box-shadow: 0 4px 15px rgba(0, 242, 254, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const SectionDivider = styled.div`
  margin: 2rem 0;
  padding: 1rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
`;

export const SectionTitle = styled.h4`
  font-size: 1.1rem;
  color: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  span {
    font-size: 1.25rem;
  }
`;

export const InfoTooltip = styled.div`
  position: absolute;
  top: -10px;
  right: -10px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  cursor: help;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

export const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
  margin-bottom: 2rem;
`;

export const PageButton = styled(Button)`
  background: ${(props) =>
    props.active
      ? "linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)"
      : "rgba(255, 255, 255, 0.1)"};
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

export const CompactCard = styled(Card)`
  background: ${(props) => props.gradient || "rgba(255, 255, 255, 0.05)"};
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  height: 100%;
  overflow: hidden;
  position: relative;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 1;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);

    &:before {
      background: rgba(0, 0, 0, 0.2);
    }
  }
`;

export const CompactBody = styled(Card.Body)`
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  z-index: 2;
  padding: 1.5rem;
`;

export const CompactTitle = styled.h3`
  color: #fff;
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

  span {
    font-size: 1.8rem;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  }
`;

export const CompactDescription = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex-grow: 1;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
`;

export const CompactFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: auto;
`;

export const StatBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.9);
  margin-right: auto;
`;

export const TipIcon = styled.span`
  font-size: 1.25rem;
`;

export const LearnMoreButton = styled(Button)`
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.5rem 1.2rem;
  border-radius: 20px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  color: white;
  backdrop-filter: blur(5px);

  &:hover {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.4);
    color: white;
  }

  &:active {
    transform: translateY(0);
  }
`;

export const DetailedCard = styled(Card)`
  background: rgba(20, 24, 40, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  margin-bottom: 2rem;
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
`;

export const DetailedHeader = styled.div`
  text-align: center;
  background: ${(props) =>
    props.gradient || "linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)"};
  padding: 3rem 2rem 3.5rem;
  position: relative;
  clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%);
`;

export const DetailedHeaderContent = styled.div`
  position: relative;
  z-index: 2;

  &:before {
    content: "";
    position: absolute;
    top: -3rem;
    left: 0;
    right: 0;
    bottom: -3.5rem;
    background: rgba(0, 0, 0, 0.2);
    z-index: -1;
  }
`;

export const DetailedTitle = styled.h2`
  color: #fff;
  font-size: 2.4rem;
  margin-bottom: 1.2rem;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  font-weight: bold;

  span {
    font-size: 2.8rem;
    filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.4));
  }
`;

export const DetailedDescription = styled.p`
  color: rgba(255, 255, 255, 0.95);
  font-size: 1.15rem;
  line-height: 1.7;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  max-width: 700px;
  margin: 0 auto;
  letter-spacing: 0.2px;
`;

export const DetailedBody = styled(Card.Body)`
  padding: 2.5rem;
  background: rgba(20, 24, 40, 0.95);
`;

export const DetailedContent = styled.div`
  background: rgba(30, 35, 50, 0.6);
  border-radius: 15px;
  padding: 2.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

export const TipSectionDetailed = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  height: 100%;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

export const TipTitleDetailed = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${(props) => props.color || "#ffffff"};

  span {
    font-size: 1.5rem;
  }
`;

export const TipDescription = styled.p`
  font-size: 0.9rem;
  color: #94a3b8;
  margin-bottom: 1rem;
  font-style: italic;
`;

export const TipListDetailed = styled.ul`
  list-style: none;
  padding: 2rem;
  margin: 0 0 2rem 0;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);

  li {
    position: relative;
    padding: 1rem 1rem 1rem 2.5rem;
    margin-bottom: 1rem;
    font-size: 1.05rem;
    line-height: 1.7;
    color: #e2e8f0;
    border-radius: 8px;
    transition: all 0.3s ease;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);

    &:last-child {
      margin-bottom: 0;
    }

    &:before {
      content: "✓";
      position: absolute;
      left: 1rem;
      color: ${(props) => props.color || "#00f2fe"};
      font-weight: bold;
      font-size: 1.2rem;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
    }

    &:hover {
      background: rgba(255, 255, 255, 0.05);
      transform: translateX(5px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  }
`;

export const TipFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  margin-top: 2rem;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);

  small {
    color: #94a3b8;
    font-size: 1rem;
    line-height: 1.5;
    letter-spacing: 0.3px;
  }
`;

export const VideoContainerDetailed = styled.div`
  margin: 3rem 0;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.15);
`;

export const ActionButtonDetailed = styled(Button)`
  background: ${(props) =>
    props.gradient || "linear-gradient(90deg, #00f2fe, #4facfe)"};
  border: none;
  color: white;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  max-width: 90%;
  white-space: normal;
  text-align: left;
  line-height: 1.4;

  @media (min-width: 768px) {
    max-width: 600px;
    white-space: nowrap;
    text-align: center;
  }

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.1) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: translateX(-100%);
    transition: transform 0.6s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
    color: white;
    text-decoration: none;

    &:before {
      transform: translateX(100%);
    }
  }

  &:active {
    transform: translateY(1px);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  }

  &:focus {
    text-decoration: none;
  }

  span {
    font-size: 1.25rem;
    line-height: 1;
    flex-shrink: 0;
  }
`;

export const DisasterPhasesTabs = styled(Tabs)`
  margin-bottom: 2rem;

  .nav-tabs {
    border: none;
    gap: 1.5rem;
    justify-content: center;
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 16px;
    display: flex;
  }

  .nav-item {
    margin: 0;
    flex: 1;
    max-width: 280px;
    min-width: 200px;
    display: flex;
  }

  .nav-link {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 1.5rem;
    color: #94a3b8;
    transition: all 0.3s ease;
    text-align: center;
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;

    &:before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.1),
        transparent
      );
      transform: translateY(-100%);
      transition: transform 0.3s ease;
    }

    &:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);

      &:before {
        transform: translateY(0);
      }
    }

    &.active {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.25);
      color: #fff;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
      transform: translateY(-2px);

      &:before {
        transform: translateY(0);
        background: ${(props) =>
          props.activeColor || "linear-gradient(90deg, #00f2fe, #4facfe)"};
      }
    }
  }

  .tab-content {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 16px;
    padding: 2.5rem;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    .nav-tabs {
      flex-direction: column;
      gap: 1rem;
      padding: 1rem;
    }

    .nav-item {
      max-width: 100%;
    }

    .nav-link {
      padding: 1rem;
    }
  }
`;

export const PhaseTabTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  font-weight: 600;
  font-size: 1.1rem;
  letter-spacing: 0.5px;
  width: 100%;
  white-space: nowrap;
`;

export const PhaseIcon = styled.span`
  font-size: 1.5rem;
  line-height: 1;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
`;

export const PhaseContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

export const PhaseDescription = styled.div`
  font-size: 1.15rem;
  color: #e2e8f0;
  text-align: left;
  margin-bottom: 2.5rem;
  line-height: 1.8;
  white-space: pre-line;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border-left: 4px solid ${(props) => props.color || "#94a3b8"};
  letter-spacing: 0.3px;
`;
