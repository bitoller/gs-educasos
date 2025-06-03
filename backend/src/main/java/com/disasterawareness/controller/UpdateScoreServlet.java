package com.disasterawareness.controller;

import java.io.IOException;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.disasterawareness.model.User;
import com.disasterawareness.service.UserService;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

@WebServlet("/api/admin/user/score")
public class UpdateScoreServlet extends HttpServlet {
    private final UserService userService;
    private final Gson gson;

    public UpdateScoreServlet() {
        this.userService = new UserService();
        this.gson = new Gson();
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {
            JsonObject jsonRequest = gson.fromJson(request.getReader(), JsonObject.class);

            Long userId = jsonRequest.get("userId").getAsLong();
            Integer score = jsonRequest.get("score").getAsInt();

            if (userId == null || score == null) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter()
                        .write(gson.toJson(new ErrorResponse("ID de usuário e pontuação são obrigatórios.")));
                return;
            }

            User user = userService.updateUserScore(userId, score);

            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().write(gson.toJson(user));

        } catch (IllegalArgumentException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write(gson.toJson(new ErrorResponse(e.getMessage())));
        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter()
                    .write(gson.toJson(new ErrorResponse("Erro ao atualizar pontuação: " + e.getMessage())));
        }
    }

    private static class ErrorResponse {
        private final String error;

        public ErrorResponse(String error) {
            this.error = error;
        }
    }
}