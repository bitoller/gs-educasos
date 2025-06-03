package com.disasterawareness.servlet;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.disasterawareness.model.Quiz;
import com.disasterawareness.service.QuizService;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebServlet("/api/quizzes/*")
public class QuizServlet extends HttpServlet {

    private QuizService quizService;
    private ObjectMapper objectMapper;

    @Override
    public void init() throws ServletException {
        super.init();
        this.quizService = new QuizService();
        this.objectMapper = new ObjectMapper();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String pathInfo = request.getPathInfo();

        try {
            if (pathInfo == null || pathInfo.equals("/")) {
                List<Quiz> quizzes = quizService.getAllQuizzes();
                objectMapper.writeValue(response.getWriter(), quizzes);
            } else {
                String[] splits = pathInfo.split("/");
                if (splits.length == 2) {
                    Long quizId = Long.parseLong(splits[1]);
                    Quiz quiz = quizService.getQuizById(quizId);

                    if (quiz != null) {
                        objectMapper.writeValue(response.getWriter(), quiz);
                    } else {
                        response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                        objectMapper.writeValue(response.getWriter(), "Quiz não encontrado");
                    }
                } else {
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    objectMapper.writeValue(response.getWriter(), "Formado de ID de quiz inválido");
                }
            }
        } catch (NumberFormatException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            objectMapper.writeValue(response.getWriter(), "Formado de ID de quiz inválido");
        } catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            objectMapper.writeValue(response.getWriter(), "Erro ao trazer os quizzes");
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            objectMapper.writeValue(response.getWriter(), "Um erro inesperado ocorreu");
        }
    }
}