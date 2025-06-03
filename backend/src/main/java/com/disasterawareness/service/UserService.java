package com.disasterawareness.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.sql.SQLException;
import java.util.List;

import com.disasterawareness.dao.UserDAO;
import com.disasterawareness.dao.UserDAOImpl;
import com.disasterawareness.model.User;

public class UserService {
    private final UserDAO userDAO;

    public UserService() {
        this.userDAO = new UserDAOImpl();
    }

    public User registerUser(String name, String email, String password) throws SQLException {
        if (userDAO.findByEmail(email) != null) {
            throw new IllegalArgumentException("Email já está em uso.");
        }

        // Criar hash da senha (em produção, usar BCrypt ou similar)
        String passwordHash = generatePasswordHash(password);

        User user = new User(name, email, passwordHash);
        return userDAO.create(user);
    }

    public User login(String email, String password) throws SQLException {
        User user = userDAO.findByEmail(email);
        if (user == null) {
            throw new IllegalArgumentException("Email não encontrado.");
        }

        // Verificar senha (em produção, usar BCrypt ou similar)
        if (!verifyPassword(password, user.getPasswordHash())) {
            throw new IllegalArgumentException("Senha incorreta.");
        }

        return user;
    }

    public User getUserById(Long userId) throws SQLException {
        User user = userDAO.findById(userId);
        if (user == null) {
            throw new IllegalArgumentException("Usuário não encontrado.");
        }
        return user;
    }

    public List<User> getAllUsers() throws SQLException {
        return userDAO.findAll();
    }

    public User updateUser(User user) throws SQLException {
        User existingUser = userDAO.findById(user.getUserId());
        if (existingUser == null) {
            throw new IllegalArgumentException("Usuário não encontrado.");
        }

        return userDAO.update(user);
    }

    public boolean deleteUser(Long userId) throws SQLException {
        User user = userDAO.findById(userId);
        if (user == null) {
            throw new IllegalArgumentException("Usuário não encontrado.");
        }

        return userDAO.delete(userId);
    }

    private String generatePasswordHash(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(password.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Erro ao gerar hash da senha", e);
        }
    }

    private boolean verifyPassword(String password, String storedHash) {
        String inputHash = generatePasswordHash(password);
        return inputHash.equals(storedHash);
    }
}