package com.disasterawareness.dao;

import com.disasterawareness.model.Content;
import java.sql.SQLException;
import java.util.List;

public interface ContentDAO {
    Content create(Content content) throws SQLException;
    Content findById(Long contentId) throws SQLException;
    List<Content> findByDisasterType(String disasterType) throws SQLException;
    List<Content> findAll() throws SQLException;
    Content update(Content content) throws SQLException;
    boolean delete(Long contentId) throws SQLException;
} 