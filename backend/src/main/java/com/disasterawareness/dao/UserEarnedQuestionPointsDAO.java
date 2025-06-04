package com.disasterawareness.dao;

import java.sql.SQLException;

public interface UserEarnedQuestionPointsDAO {
    boolean hasUserEarnedPointsForQuestion(Long userId, Long questionId) throws SQLException;

    void recordUserEarnedPointsForQuestion(Long userId, Long questionId) throws SQLException;
}