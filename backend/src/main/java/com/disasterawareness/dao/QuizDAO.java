package com.disasterawareness.dao;

import java.sql.SQLException;
import java.util.List;

import com.disasterawareness.model.AnswerChoice;
import com.disasterawareness.model.Quiz;

public interface QuizDAO {

    List<Quiz> getAllQuizzes() throws SQLException;

    Quiz getQuizById(Long quizId) throws SQLException;

    List<AnswerChoice> getCorrectAnswerChoicesForQuestions(List<Long> questionIds) throws SQLException;
}