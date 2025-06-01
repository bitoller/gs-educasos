package com.disasterawareness.controller;

import com.disasterawareness.model.Content;
import com.disasterawareness.service.ContentService;
import com.google.gson.Gson;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

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
                // Listar todo o conteúdo
                List<Content> contents = contentService.getAllContent();
                response.getWriter().write(gson.toJson(contents));
            } else if (pathInfo.startsWith("/disaster/")) {
                // Listar conteúdo por tipo de desastre
                String disasterType = pathInfo.substring("/disaster/".length());
                List<Content> contents = contentService.getContentByDisasterType(disasterType);
                response.getWriter().write(gson.toJson(contents));
            } else {
                // Buscar conteúdo por ID
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
            String disasterType = request.getParameter("disasterType");
            String title = request.getParameter("title");
            String description = request.getParameter("description");
            String videoUrl = request.getParameter("videoUrl");
            
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
            String disasterType = request.getParameter("disasterType");
            String title = request.getParameter("title");
            String description = request.getParameter("description");
            String videoUrl = request.getParameter("videoUrl");
            
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