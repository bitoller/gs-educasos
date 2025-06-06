import React, { useEffect, useState } from "react";
import { Container, Button, Spinner, Alert } from "react-bootstrap";
import styled from "styled-components";

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1c2e 0%, #16213e 100%);
  padding: 5rem 0 2rem;
`;

const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Subtitle = styled.p`
  color: #fbbf24;
  text-align: center;
  margin-bottom: 2.5rem;
`;

function parseAlertItems(xmlString) {
  const parser = new window.DOMParser();
  const xml = parser.parseFromString(xmlString, "text/xml");
  const items = Array.from(xml.querySelectorAll("item"));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return items
    .map((item) => {
      const title = item.querySelector("title")?.textContent;
      const link = item.querySelector("link")?.textContent;
      const description = item.querySelector("description")?.textContent;
      const pubDate = item.querySelector("pubDate")?.textContent;
      let start = null,
        end = null;
      if (description) {
        const inicioMatch = description.match(
          /<th[^>]*>In[ií]cio<\/th>\s*<td[^>]*>([^<]+)<\/td>/i
        );
        const fimMatch = description.match(
          /<th[^>]*>Fim<\/th>\s*<td[^>]*>([^<]+)<\/td>/i
        );
        if (inicioMatch && inicioMatch[1]) {
          start = new Date(inicioMatch[1].replace(/\.(\d+)?$/, ""));
        }
        if (fimMatch && fimMatch[1]) {
          end = new Date(fimMatch[1].replace(/\.(\d+)?$/, ""));
        }
      }
      return { title, link, description, pubDate, start, end };
    })
    .filter((alert) => {
      if (!alert.start || !alert.end) {
        if (!alert.pubDate) return false;
        const pub = new Date(alert.pubDate);
        return !isNaN(pub) && pub >= today;
      }
      return (
        (!isNaN(alert.start) &&
          !isNaN(alert.end) &&
          today >= alert.start &&
          today <= alert.end) ||
        (!isNaN(alert.start) && alert.start > today)
      );
    })
    .sort((a, b) => {
      if (a.start && b.start) return a.start - b.start;
      if (a.start) return -1;
      if (b.start) return 1;
      return 0;
    });
}

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAlerts() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("https://apiprevmet3.inmet.gov.br/avisos/rss");
        if (!res.ok) throw new Error("Erro ao buscar alertas do INMET");
        const xmlString = await res.text();
        setAlerts(parseAlertItems(xmlString));
      } catch {
        setError(
          "Não foi possível carregar os alertas do INMET. Talvez seja necessário um proxy por causa de CORS."
        );
        setAlerts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchAlerts();
  }, []);

  return (
    <PageContainer>
      <Container>
        <Title>Alertas de Desastres Naturais</Title>
        <Subtitle>
          Fonte: INMET (Instituto Nacional de Meteorologia) - Alertas em tempo
          real
        </Subtitle>
        <Button
          variant="warning"
          href="https://alertas2.inmet.gov.br/"
          target="_blank"
          rel="noopener noreferrer"
          className="mb-4"
        >
          Ver mapa de alertas oficial do INMET
        </Button>
        {loading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: 200 }}
          >
            <Spinner animation="border" variant="warning" />
          </div>
        ) : error ? (
          <Alert variant="danger" className="text-center">
            {error}
          </Alert>
        ) : alerts.length === 0 ? (
          <Alert variant="info" className="text-center">
            Nenhum alerta ativo no momento.
          </Alert>
        ) : (
          alerts.map((alert, idx) => (
            <div
              key={idx}
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 16,
                color: "white",
                marginBottom: 24,
                boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                padding: 24,
              }}
            >
              <h4 style={{ color: "#fbbf24" }}>{alert.title}</h4>
              <div dangerouslySetInnerHTML={{ __html: alert.description }} />
              <div>
                <small>{alert.pubDate}</small>
              </div>
            </div>
          ))
        )}
      </Container>
    </PageContainer>
  );
};

export default Alerts;
