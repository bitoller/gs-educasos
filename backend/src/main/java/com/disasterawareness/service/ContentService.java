package com.disasterawareness.service;

import java.sql.SQLException;
import java.util.List;

import com.disasterawareness.dao.ContentDAO;
import com.disasterawareness.dao.ContentDAOImpl;
import com.disasterawareness.model.Content;

public class ContentService {
    private final ContentDAO contentDAO;

    public ContentService() {
        this.contentDAO = new ContentDAOImpl();
    }

    public Content createContent(String disasterType, String title, String description, String videoUrl)
            throws SQLException {
        Content content = new Content(disasterType, title, description, videoUrl);
        return contentDAO.create(content);
    }

    public Content getContentById(Long contentId) throws SQLException {
        Content content = contentDAO.findById(contentId);
        if (content == null) {
            throw new IllegalArgumentException("Conteúdo não encontrado.");
        }
        return content;
    }

    public List<Content> getContentByDisasterType(String disasterType) throws SQLException {
        return contentDAO.findByDisasterType(disasterType);
    }

    public List<Content> getAllContent() throws SQLException {
        return contentDAO.findAll();
    }

    public Content updateContent(Content content) throws SQLException {
        Content existingContent = contentDAO.findById(content.getContentId());
        if (existingContent == null) {
            throw new IllegalArgumentException("Conteúdo não encontrado.");
        }

        return contentDAO.update(content);
    }

    public boolean deleteContent(Long contentId) throws SQLException {
        Content content = contentDAO.findById(contentId);
        if (content == null) {
            throw new IllegalArgumentException("Conteúdo não encontrado.");
        }

        return contentDAO.delete(contentId);
    }

    public void validateContent(Content content) {
        if (content.getDisasterType() == null || content.getDisasterType().trim().isEmpty()) {
            throw new IllegalArgumentException("Tipo de desastre é obrigatório.");
        }

        if (content.getTitle() == null || content.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Título é obrigatório.");
        }

        if (content.getDescription() == null || content.getDescription().trim().isEmpty()) {
            throw new IllegalArgumentException("Descrição é obrigatória.");
        }

        if (content.getVideoUrl() == null || content.getVideoUrl().trim().isEmpty()) {
            throw new IllegalArgumentException("URL do vídeo é obrigatória.");
        }
    }
}