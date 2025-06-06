import styled from "styled-components";
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

export const SectionDivider = styled.div`
  margin: 2rem 0;
  padding: 1rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
`;
