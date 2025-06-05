import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import {
  PageContainer,
  ContentWrapper,
  Subtitle,
  SectionDivider,
  HeaderSection,
  Title,
} from "./LearnDisasters.styles";
import styled from "styled-components";

const TeamCard = styled(Card)`
  background: rgba(30, 35, 50, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  overflow: hidden;
  transition: transform 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-5px);
  }

  .card-body {
    display: flex;
    flex-direction: column;
    height: 100%;
    flex-grow: 1;
  }
`;

const TeamMemberImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--accent-color);
  margin: 1rem auto;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;

  a {
    color: var(--text-secondary);
    font-size: 1.5rem;
    transition: color 0.3s ease;

    &:hover {
      color: var(--accent-color);
    }
  }
`;

const VideoContainer = styled.div`
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
  border-radius: 15px;
  margin: 2rem auto;
  max-width: 800px;

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
  }
`;

const About = () => {
  const [teamMembers, setTeamMembers] = useState([
    {
      name: "Bianca Toller",
      role: "Software Engineer | Back End Developer | .NET | C# | Java | Azure | SQL",
      github: "bitoller",
      linkedin: "https://www.linkedin.com/in/bianca-toller/",
      description:
        "Antes de mergulhar no universo da tecnologia, Bianca cruzava os céus como comissária de bordo da Emirates — e foi entre fusos horários e passageiros do mundo todo que desenvolveu sua habilidade única de lidar com imprevistos (algo muito útil na área de TI!).\n\nHoje, ela é Systems Support Engineer na Thoughtworks e estudante de Engenharia de Software na FIAP, onde transforma lógica, código e empatia em soluções reais. Com paixão por video games, animes, K-dramas e, claro, por seu golden retriever Eren, Bianca leva para o time uma mistura única de disciplina, criatividade e sensibilidade (com um toque geek).\n\nAh, e se o sistema travar? Calma, ela provavelmente já viu coisa pior a 35 mil pés de altitude.",
    },
    {
      name: "Bruno Marcelino",
      role: "Estudante de Engenharia de Software na FIAP | UI & UX Design | HTML | CSS | Javascript | React | Java",
      github: "BrunoMarc59",
      linkedin: "https://www.linkedin.com/in/bruno-marc/",
      description:
        "Bruno é o tipo de desenvolvedor que não apenas constrói interfaces, mas também pensa na experiência do usuário como quem desenha um bom jogo: com propósito, fluidez e um toque de diversão. Estudante de Engenharia de Software na FIAP, ele tem uma forte base em desenvolvimento front-end e é apaixonado por UI/UX Design.\n\nCom domínio de HTML, CSS, JavaScript, React e Java, Bruno une técnica e sensibilidade visual para criar soluções que realmente fazem sentido para quem está do outro lado da tela. Sua trajetória também inclui uma fase importante em Engenharia de Computação na UTFPR, que ampliou sua capacidade analítica e sua abordagem criativa para resolver problemas.\n\nNas horas vagas, é nos video games que ele encontra inspiração — porque, para o Bruno, toda boa experiência começa com um bom controle (seja ele de console ou de versão).",
    },
    {
      name: "Lucas Henrique",
      role: "Engenheiro | Fundador da Nova Build Construtech | Desenvolvedor Back-End Pleno",
      github: "lucashcribeiro",
      linkedin: "https://www.linkedin.com/in/lucas-hc-ribeiro/",
      description:
        "Lucas é engenheiro, empreendedor e mente inquieta por trás da Nova Build Construtech, uma empresa que une inovação, eficiência e sustentabilidade no setor da construção civil. Formado em Engenharia Civil e atualmente cursando Engenharia de Software na FIAP, ele transita com naturalidade entre o mundo físico das obras e o universo digital dos sistemas.\n\nAlém de liderar sua própria construtech, Lucas também atua como desenvolvedor back-end pleno, aplicando sua visão sistêmica e capacidade analítica para criar soluções tecnológicas robustas e escaláveis. Seu olhar multidisciplinar faz com que ele conecte engenharia, negócios e tecnologia de forma prática e inteligente.\n\nQuando o assunto é tirar projetos do papel — seja um app ou um edifício — pode apostar que o Lucas já está dois passos à frente.",
    },
  ]);

  useEffect(() => {
    const fetchAvatar = async (member) => {
      const localStorageKey = `github_avatar_${member.github}`;
      const storedAvatar = localStorage.getItem(localStorageKey);

      if (storedAvatar) {
        setTeamMembers((prev) =>
          prev.map((m) =>
            m.github === member.github ? { ...m, avatarUrl: storedAvatar } : m
          )
        );
      } else if (!member.github.startsWith("[") && member.github !== "") {
        try {
          const response = await fetch(
            `https://api.github.com/users/${member.github}`
          );
          if (response.ok) {
            const data = await response.json();
            try {
              localStorage.setItem(localStorageKey, data.avatar_url);
            } catch (storageError) {
              console.error(
                "Error storing avatar in local storage:",
                storageError
              );
            }

            setTeamMembers((prev) =>
              prev.map((m) =>
                m.github === member.github
                  ? { ...m, avatarUrl: data.avatar_url }
                  : m
              )
            );
          } else {
            console.warn(
              `Could not fetch GitHub profile for ${member.github}: ${response.status}`
            );
          }
        } catch (error) {
          console.error("Error fetching GitHub profile:", error);
        }
      } else {
        console.info(`Using placeholder for GitHub username: ${member.github}`);
      }
    };

    teamMembers.forEach(fetchAvatar);
  }, []);

  return (
    <PageContainer>
      <ContentWrapper>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <HeaderSection>
              <Title>Sobre o EducaSOS</Title>
              <Subtitle>
                {"O nosso projeto nasceu como resposta ao Desafio Global Solution 2025/1 da FIAP: Eventos Extremos, que propôs aos alunos o desenvolvimento de soluções tecnológicas voltadas para eventos extremos da natureza — como enchentes, secas, terremotos e ondas de calor — que vêm se tornando cada vez mais frequentes no cenário global.\n\nCom o objetivo de prevenir, mitigar ou responder a esses eventos, nosso grupo se uniu para criar uma solução digital funcional e inovadora. A proposta combina tecnologia, criatividade e propósito social, tendo como base o uso de Java orientado a objetos, banco de dados relacional e uma interface web interativa. Tudo isso foi pensado para apoiar tanto a população afetada quanto os órgãos responsáveis pela gestão de crises.\n\nAcreditamos que grandes ideias surgem nos momentos mais desafiadores — e é justamente nesses momentos que a inovação pode salvar vidas, proteger o meio ambiente e transformar comunidades. Este projeto é mais do que um exercício acadêmico: é uma oportunidade real de causar impacto positivo por meio da tecnologia."
                  .split("\n\n")
                  .map((paragraph, index) => (
                    <div key={index} style={{ marginBottom: "1rem" }}>
                      {paragraph}
                    </div>
                  ))}
              </Subtitle>
            </HeaderSection>

            <HeaderSection>
              <Title>Parcerias</Title>
              <Subtitle>
                {"Este projeto foi desenvolvido com o apoio da FIAP (Faculdade de Informática e Administração Paulista), por meio do programa Global Solution. A FIAP não apenas propôs o desafio, mas também ofereceu conteúdos técnicos, mentorias e materiais de apoio que permitiram a aplicação prática do conhecimento adquirido em sala de aula."
                  .split("\n\n")
                  .map((paragraph, index) => (
                    <div key={index} style={{ marginBottom: "1rem" }}>
                      {paragraph}
                    </div>
                  ))}
              </Subtitle>
            </HeaderSection>

            <VideoContainer>
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="About EducaSOS"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </VideoContainer>

            <SectionDivider
              style={{ marginTop: "3rem", marginBottom: "3rem" }}
            />

            <HeaderSection>
              <Title>Nosso Time</Title>
              <Subtitle>
                Conheça os entusiastas por trás do EducaSOS, trabalhando juntos
                para fazer a diferença na conscientização sobre desastres e
                preparação para emergências.
              </Subtitle>
            </HeaderSection>

            <Row className="g-4 justify-content-center">
              {teamMembers.map((member, index) => (
                <Col
                  key={index}
                  xs={12}
                  md={6}
                  lg={4}
                  className="d-flex align-items-stretch"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="h-100"
                  >
                    <TeamCard>
                      <Card.Body className="text-center">
                        <TeamMemberImage
                          src={
                            member.avatarUrl ||
                            "https://static.vecteezy.com/system/resources/thumbnails/008/695/917/small_2x/no-image-available-icon-simple-two-colors-template-for-no-image-or-picture-coming-soon-and-placeholder-illustration-isolated-on-white-background-vector.jpg"
                          }
                          alt={member.name}
                        />
                        <Card.Title className="text-light mb-2">
                          {member.name}
                        </Card.Title>
                        <Card.Subtitle className="mb-3 text-light">
                          {member.role}
                        </Card.Subtitle>
                        {member.description
                          .split("\n\n")
                          .map((paragraph, index) => (
                            <div
                              key={index}
                              className="text-light"
                              style={{ marginBottom: "1rem" }}
                            >
                              {paragraph}
                            </div>
                          ))}
                        <SocialLinks>
                          <a
                            href={`https://github.com/${member.github}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FontAwesomeIcon icon={faGithub} />
                          </a>
                          <a
                            href={
                              member.linkedin.startsWith("https://")
                                ? member.linkedin
                                : `https://linkedin.com/in/${member.linkedin}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FontAwesomeIcon icon={faLinkedin} />
                          </a>
                        </SocialLinks>
                      </Card.Body>
                    </TeamCard>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        </Container>
      </ContentWrapper>
    </PageContainer>
  );
};

export default About;
