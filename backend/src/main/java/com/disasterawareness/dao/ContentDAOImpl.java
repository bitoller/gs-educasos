package com.disasterawareness.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.disasterawareness.model.Content;
import com.disasterawareness.utils.ConnectionFactory;

import oracle.sql.NUMBER;

public class ContentDAOImpl implements ContentDAO {

    @Override
    public Content create(Content content) throws SQLException {
        String sql = "INSERT INTO content (disaster_type, title, description, video_url) VALUES (?, ?, ?, ?)";

        try (Connection conn = ConnectionFactory.getConnection();
                PreparedStatement stmt = conn.prepareStatement(sql, new String[] { "content_id" })) {

            stmt.setString(1, content.getDisasterType());
            stmt.setString(2, content.getTitle());
            stmt.setString(3, content.getDescription());
            stmt.setString(4, content.getVideoUrl());

            int affectedRows = stmt.executeUpdate();

            if (affectedRows == 0) {
                throw new SQLException("Falha ao criar conteúdo, nenhuma linha afetada.");
            }

            try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    Object idObject = generatedKeys.getObject(1);
                    if (idObject instanceof NUMBER) {
                        NUMBER oracleNumber = (NUMBER) idObject;
                        content.setContentId(oracleNumber.longValue());
                    } else {
                        System.err
                                .println("Unexpected type for generated content ID: " + idObject.getClass().getName());
                        if (idObject instanceof java.math.BigDecimal) {
                            content.setContentId(((java.math.BigDecimal) idObject).longValue());
                        } else {
                            throw new SQLException(
                                    "Unexpected type for generated key: " + idObject.getClass().getName());
                        }
                    }
                    return content;
                } else {
                    throw new SQLException("Falha ao criar conteúdo, nenhum ID obtido.");
                }
            }
        }
    }

    @Override
    public Content findById(Long contentId) throws SQLException {
        String sql = "SELECT * FROM content WHERE content_id = ?";

        try (Connection conn = ConnectionFactory.getConnection();
                PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setLong(1, contentId);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToContent(rs);
                }
            }
        }
        return null;
    }

    @Override
    public List<Content> findByDisasterType(String disasterType) throws SQLException {
        String sql = "SELECT * FROM content WHERE disaster_type = ?";
        List<Content> contents = new ArrayList<>();

        try (Connection conn = ConnectionFactory.getConnection();
                PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, disasterType);

            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    contents.add(mapResultSetToContent(rs));
                }
            }
        }
        return contents;
    }

    @Override
    public List<Content> findAll() throws SQLException {
        String sql = "SELECT * FROM content";
        List<Content> contents = new ArrayList<>();

        try (Connection conn = ConnectionFactory.getConnection();
                PreparedStatement stmt = conn.prepareStatement(sql);
                ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                contents.add(mapResultSetToContent(rs));
            }
        }
        return contents;
    }

    @Override
    public Content update(Content content) throws SQLException {
        String sql = "UPDATE content SET disaster_type = ?, title = ?, description = ?, video_url = ? WHERE content_id = ?";

        try (Connection conn = ConnectionFactory.getConnection();
                PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, content.getDisasterType());
            stmt.setString(2, content.getTitle());
            stmt.setString(3, content.getDescription());
            stmt.setString(4, content.getVideoUrl());
            stmt.setLong(5, content.getContentId());

            int affectedRows = stmt.executeUpdate();

            if (affectedRows == 0) {
                throw new SQLException("Falha ao atualizar conteúdo, nenhuma linha afetada.");
            }

            return content;
        }
    }

    @Override
    public boolean delete(Long contentId) throws SQLException {
        String sql = "DELETE FROM content WHERE content_id = ?";

        try (Connection conn = ConnectionFactory.getConnection();
                PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setLong(1, contentId);

            int affectedRows = stmt.executeUpdate();
            return affectedRows > 0;
        }
    }

    private Content mapResultSetToContent(ResultSet rs) throws SQLException {
        Content content = new Content();
        content.setContentId(rs.getLong("content_id"));
        content.setDisasterType(rs.getString("disaster_type"));
        content.setTitle(rs.getString("title"));
        content.setDescription(rs.getString("description"));
        content.setVideoUrl(rs.getString("video_url"));
        return content;
    }
}