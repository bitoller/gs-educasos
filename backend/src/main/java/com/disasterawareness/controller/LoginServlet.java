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
import com.disasterawareness.utils.JwtUtil;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

@WebServlet("/api/login")
public class LoginServlet extends HttpServlet {
    private final UserService userService;
    private final Gson gson;

    public LoginServlet() {
        this.userService = new UserService();
        this.gson = new Gson();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {
            JsonObject jsonRequest = gson.fromJson(request.getReader(), JsonObject.class);

            String email = jsonRequest.get("email").getAsString();
            String password = jsonRequest.get("password").getAsString();

            if (email == null || password == null) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write(gson.toJson(new ErrorResponse("Email e senha são obrigatórios.")));
                return;
            }

            User user = userService.login(email, password);

            String token = JwtUtil.generateToken(user);

            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter()
                    .write(gson.toJson(new LoginSuccessResponse("Login realizado com sucesso.", user, token)));

        } catch (IllegalArgumentException e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write(gson.toJson(new ErrorResponse(e.getMessage())));
        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write(gson.toJson(new ErrorResponse("Erro ao realizar login.")));
        }
    }

    private static class LoginSuccessResponse {
        private final String message;
        private final User user;
        private final String token;

        public LoginSuccessResponse(String message, User user, String token) {
            this.message = message;
            this.user = user;
            this.token = token;
        }
    }

    private static class ErrorResponse {
        private final String error;

        public ErrorResponse(String error) {
            this.error = error;
        }
    }
}