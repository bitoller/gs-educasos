package com.disasterawareness.dao;

import com.disasterawareness.model.User;
import java.sql.SQLException;
import java.util.List;

public interface UserDAO {
    User create(User user) throws SQLException;
    User findByEmail(String email) throws SQLException;
    User findById(Long userId) throws SQLException;
    List<User> findAll() throws SQLException;
    User update(User user) throws SQLException;
    boolean delete(Long userId) throws SQLException;
} 