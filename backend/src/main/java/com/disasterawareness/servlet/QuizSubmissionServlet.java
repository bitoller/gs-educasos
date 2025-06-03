package com.disasterawareness.servlet;

import java.io.IOException;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.disasterawareness.service.QuizService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebServlet("/api/quizzes/submit")
public class QuizSubmissionServlet extends HttpServlet {

    private QuizService quizService;
    private ObjectMapper objectMapper;

    @Override
    public void init() throws ServletException {
        super.init();
        this.quizService = new QuizService();
        this.objectMapper = new ObjectMapper();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {
            Long userId = (Long) request.getAttribute("userId");

            if (userId == null) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                objectMapper.writeValue(response.getWriter(), "Não autorizado: Usuário não autenticado");
                return;
            }

            JsonNode rootNode = objectMapper.readTree(request.getReader());
            Long quizId = rootNode.get("quizId").asLong();
            JsonNode submittedAnswersNode = rootNode.get("submittedAnswers");

            if (quizId == null || submittedAnswersNode == null || !submittedAnswersNode.isObject()) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                objectMapper.writeValue(response.getWriter(), "Corpo da requisição inválido.");
                return;
            }

            Map<Long, Long> submittedAnswers = new HashMap<>();
            Iterator<Map.Entry<String, JsonNode>> fields = submittedAnswersNode.fields();
            while (fields.hasNext()) {
                Map.Entry<String, JsonNode> field = fields.next();
                try {
                    Long questionId = Long.parseLong(field.getKey());
                    Long choiceId = field.getValue().asLong();
                    submittedAnswers.put(questionId, choiceId);
                } catch (NumberFormatException e) {
                    System.err.println("Ignorando chave/valor de resposta na submissão: " + field.getKey() + " -> "
                            + field.getValue());
                }
            }

            int scoreEarned = quizService.processQuizSubmission(quizId, userId, submittedAnswers);

            Map<String, Object> result = new HashMap<>();
            result.put("message", "Quiz enviado com sucesso");
            result.put("scoreEarned", scoreEarned);

            objectMapper.writeValue(response.getWriter(), result);

        } catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            objectMapper.writeValue(response.getWriter(), "Erro ao processar a submissão do quiz");
        } catch (IOException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            objectMapper.writeValue(response.getWriter(), "Erro ao ler o corpo da requisição");
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            objectMapper.writeValue(response.getWriter(), "Um erro inesperado ocorreu");
        }
    }
}