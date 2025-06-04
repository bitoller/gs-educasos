package com.disasterawareness.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import com.disasterawareness.utils.ConnectionFactory;

public class UserEarnedQuestionPointsDAOImpl implements UserEarnedQuestionPointsDAO {

    @Override
    public boolean hasUserEarnedPointsForQuestion(Long userId, Long questionId) throws SQLException {
        String sql = "SELECT COUNT(*) FROM user_earned_question_points WHERE user_id = ? AND question_id = ?";

        try (Connection conn = ConnectionFactory.getConnection();
                PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setLong(1, userId);
            stmt.setLong(2, questionId);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt(1) > 0;
                }
            }
        }
        return false;
    }

    @Override
    public void recordUserEarnedPointsForQuestion(Long userId, Long questionId) throws SQLException {
        if (!hasUserEarnedPointsForQuestion(userId, questionId)) {
            String sql = "INSERT INTO user_earned_question_points (user_id, question_id) VALUES (?, ?)";

            try (Connection conn = ConnectionFactory.getConnection();
                    PreparedStatement stmt = conn.prepareStatement(sql)) {

                stmt.setLong(1, userId);
                stmt.setLong(2, questionId);

                stmt.executeUpdate();
            }
        }
    }
}