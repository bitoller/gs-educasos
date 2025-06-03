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

@WebServlet("/api/register")
public class RegisterServlet extends HttpServlet {
    private final UserService userService;
    private final Gson gson;

    public RegisterServlet() {
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

            String name = jsonRequest.get("name").getAsString();
            String email = jsonRequest.get("email").getAsString();
            String password = jsonRequest.get("password").getAsString();

            if (name == null || email == null || password == null) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write(gson.toJson(new ErrorResponse("Todos os campos são obrigatórios.")));
                return;
            }

            User user = userService.registerUser(name, email, password);

            User responseUser = new User();
            responseUser.setUserId(user.getUserId());
            responseUser.setName(user.getName());
            responseUser.setEmail(user.getEmail());

            response.setStatus(HttpServletResponse.SC_CREATED);
            response.getWriter().write(gson.toJson(responseUser));

        } catch (IllegalArgumentException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write(gson.toJson(new ErrorResponse(e.getMessage())));
        } catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write(gson.toJson(new ErrorResponse("Erro ao registrar usuário: " + e.getMessage())));
        }
    }

    private static class SuccessResponse {
        private final String message;
        private final User user;

        public SuccessResponse(String message, User user) {
            this.message = message;
            this.user = user;
        }
    }

    private static class ErrorResponse {
        private final String error;

        public ErrorResponse(String error) {
            this.error = error;
        }
    }
}