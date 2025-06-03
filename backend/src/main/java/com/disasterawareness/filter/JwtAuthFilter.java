package com.disasterawareness.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.disasterawareness.utils.JwtUtil;
import com.google.gson.Gson;

public class JwtAuthFilter implements Filter {
    private final Gson gson;

    public JwtAuthFilter() {
        this.gson = new Gson();
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        if (httpRequest.getMethod().equals("OPTIONS")) {
            chain.doFilter(request, response);
            return;
        }

        String authHeader = httpRequest.getHeader("Authorization");
        String token = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        }

        if (token == null || !JwtUtil.validateToken(token)) {
            sendErrorResponse(httpResponse, "Não autorizado: Token inválido ou ausente",
                    HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        try {
            Long userId = JwtUtil.extractUserId(token);
            Boolean isAdmin = JwtUtil.extractIsAdmin(token);

            httpRequest.setAttribute("userId", userId);
            httpRequest.setAttribute("isAdmin", isAdmin);

            chain.doFilter(request, response);
        } catch (Exception e) {
            sendErrorResponse(httpResponse, "Erro ao processar o token", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public void destroy() {
    }

    private void sendErrorResponse(HttpServletResponse response, String message, int status) throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setStatus(status);
        response.getWriter().write(gson.toJson(new ErrorResponse(message)));
    }

    private static class ErrorResponse {
        private final String error;

        public ErrorResponse(String error) {
            this.error = error;
        }
    }
}