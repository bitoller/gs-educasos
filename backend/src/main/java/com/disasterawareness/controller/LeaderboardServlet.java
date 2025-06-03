package com.disasterawareness.controller;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.disasterawareness.model.User;
import com.disasterawareness.service.UserService;
import com.google.gson.Gson;

@WebServlet("/api/leaderboard")
public class LeaderboardServlet extends HttpServlet {
    private final UserService userService;
    private final Gson gson;

    public LeaderboardServlet() {
        this.userService = new UserService();
        this.gson = new Gson();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {
            List<User> leaderboard = userService.getLeaderboard();
            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().write(gson.toJson(leaderboard));

        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter()
                    .write(gson.toJson(new ErrorResponse("Erro ao trazer a leaderboard: " + e.getMessage())));
        }
    }

    private static class ErrorResponse {
        private final String error;

        public ErrorResponse(String error) {
            this.error = error;
        }
    }
}