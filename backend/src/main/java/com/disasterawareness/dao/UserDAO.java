package com.disasterawareness.dao;

import java.sql.SQLException;
import java.util.List;

import com.disasterawareness.model.User;

public interface UserDAO {
    User create(User user) throws SQLException;

    User findByEmail(String email) throws SQLException;

    User findById(Long userId) throws SQLException;

    List<User> findAll() throws SQLException;

    User update(User user) throws SQLException;

    boolean delete(Long userId) throws SQLException;
}