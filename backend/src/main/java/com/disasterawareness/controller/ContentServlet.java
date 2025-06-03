package com.disasterawareness.controller;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.disasterawareness.model.Content;
import com.disasterawareness.service.ContentService;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

@WebServlet("/api/content/*")
public class ContentServlet extends HttpServlet {
    private final ContentService contentService;
    private final Gson gson;

    public ContentServlet() {
        this.contentService = new ContentService();
        this.gson = new Gson();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String pathInfo = request.getPathInfo();

        try {
            if (pathInfo == null || pathInfo.equals("/")) {
                List<Content> contents = contentService.getAllContent();
                response.getWriter().write(gson.toJson(contents));
            } else if (pathInfo.startsWith("/disaster/")) {
                String disasterType = pathInfo.substring("/disaster/".length());
                List<Content> contents = contentService.getContentByDisasterType(disasterType);
                response.getWriter().write(gson.toJson(contents));
            } else {
                Long contentId = Long.parseLong(pathInfo.substring(1));
                Content content = contentService.getContentById(contentId);
                response.getWriter().write(gson.toJson(content));
            }

            response.setStatus(HttpServletResponse.SC_OK);

        } catch (NumberFormatException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write(gson.toJson(new ErrorResponse("ID inválido.")));
        } catch (IllegalArgumentException e) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            response.getWriter().write(gson.toJson(new ErrorResponse(e.getMessage())));
        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write(gson.toJson(new ErrorResponse("Erro ao buscar conteúdo.")));
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {
            // Read JSON request body
            JsonObject jsonRequest = gson.fromJson(request.getReader(), JsonObject.class);
            
            String disasterType = jsonRequest.get("disasterType").getAsString();
            String title = jsonRequest.get("title").getAsString();
            String description = jsonRequest.get("description").getAsString();
            String videoUrl = jsonRequest.get("videoUrl").getAsString();

            Content content = contentService.createContent(disasterType, title, description, videoUrl);

            response.setStatus(HttpServletResponse.SC_CREATED);
            response.getWriter().write(gson.toJson(new SuccessResponse("Conteúdo criado com sucesso.", content)));

        } catch (IllegalArgumentException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write(gson.toJson(new ErrorResponse(e.getMessage())));
        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write(gson.toJson(new ErrorResponse("Erro ao criar conteúdo.")));
        }
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String pathInfo = request.getPathInfo();

        try {
            if (pathInfo == null || pathInfo.equals("/")) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write(gson.toJson(new ErrorResponse("ID do conteúdo é obrigatório.")));
                return;
            }

            Long contentId = Long.parseLong(pathInfo.substring(1));
            
            // Read JSON request body
            JsonObject jsonRequest = gson.fromJson(request.getReader(), JsonObject.class);
            
            String disasterType = jsonRequest.get("disasterType").getAsString();
            String title = jsonRequest.get("title").getAsString();
            String description = jsonRequest.get("description").getAsString();
            String videoUrl = jsonRequest.get("videoUrl").getAsString();

            Content content = new Content();
            content.setContentId(contentId);
            content.setDisasterType(disasterType);
            content.setTitle(title);
            content.setDescription(description);
            content.setVideoUrl(videoUrl);

            Content updatedContent = contentService.updateContent(content);

            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().write(gson.toJson(new SuccessResponse("Conteúdo atualizado com sucesso.", updatedContent)));

        } catch (NumberFormatException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write(gson.toJson(new ErrorResponse("ID inválido.")));
        } catch (IllegalArgumentException e) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            response.getWriter().write(gson.toJson(new ErrorResponse(e.getMessage())));
        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write(gson.toJson(new ErrorResponse("Erro ao atualizar conteúdo.")));
        }
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String pathInfo = request.getPathInfo();

        try {
            if (pathInfo == null || pathInfo.equals("/")) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write(gson.toJson(new ErrorResponse("ID do conteúdo é obrigatório.")));
                return;
            }

            Long contentId = Long.parseLong(pathInfo.substring(1));
            contentService.deleteContent(contentId);

            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().write(gson.toJson(new SuccessResponse("Conteúdo excluído com sucesso.", null)));

        } catch (NumberFormatException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write(gson.toJson(new ErrorResponse("ID inválido.")));
        } catch (IllegalArgumentException e) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            response.getWriter().write(gson.toJson(new ErrorResponse(e.getMessage())));
        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write(gson.toJson(new ErrorResponse("Erro ao excluir conteúdo.")));
        }
    }

    private static class SuccessResponse {
        private final String message;
        private final Content content;

        public SuccessResponse(String message, Content content) {
            this.message = message;
            this.content = content;
        }
    }

    private static class ErrorResponse {
        private final String error;

        public ErrorResponse(String error) {
            this.error = error;
        }
    }
}