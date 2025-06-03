package com.disasterawareness.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.disasterawareness.model.AnswerChoice;
import com.disasterawareness.model.Question;
import com.disasterawareness.model.Quiz;
import com.disasterawareness.utils.ConnectionFactory;

public class QuizDAOImpl implements QuizDAO {

    @Override
    public List<Quiz> getAllQuizzes() throws SQLException {
        List<Quiz> quizzes = new ArrayList<>();
        String sql = "SELECT quiz_id, title, disaster_type FROM quizzes";

        try (Connection conn = ConnectionFactory.getConnection();
                PreparedStatement stmt = conn.prepareStatement(sql);
                ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                quizzes.add(mapResultSetToQuiz(rs));
            }
        }
        return quizzes;
    }

    @Override
    public Quiz getQuizById(Long quizId) throws SQLException {
        Quiz quiz = null;
        String quizSql = "SELECT quiz_id, title, disaster_type FROM quizzes WHERE quiz_id = ?";
        String questionsSql = "SELECT question_id, quiz_id, question_text, points FROM questions WHERE quiz_id = ? ORDER BY question_id";
        String choicesSql = "SELECT choice_id, question_id, choice_text, is_correct FROM answer_choices WHERE question_id IN (SELECT question_id FROM questions WHERE quiz_id = ?)";

        try (Connection conn = ConnectionFactory.getConnection()) {
            try (PreparedStatement stmt = conn.prepareStatement(quizSql)) {
                stmt.setLong(1, quizId);
                try (ResultSet rs = stmt.executeQuery()) {
                    if (rs.next()) {
                        quiz = mapResultSetToQuiz(rs);
                        quiz.setQuestions(new ArrayList<>());
                    } else {
                        return null;
                    }
                }
            }

            Map<Long, Question> questionMap = new HashMap<>();
            try (PreparedStatement stmt = conn.prepareStatement(questionsSql)) {
                stmt.setLong(1, quizId);
                try (ResultSet rs = stmt.executeQuery()) {
                    while (rs.next()) {
                        Question question = mapResultSetToQuestion(rs);
                        question.setAnswerChoices(new ArrayList<>());
                        quiz.getQuestions().add(question);
                        questionMap.put(question.getQuestionId(), question);
                    }
                }
            }

            try (PreparedStatement stmt = conn.prepareStatement(choicesSql)) {
                stmt.setLong(1, quizId);
                try (ResultSet rs = stmt.executeQuery()) {
                    while (rs.next()) {
                        AnswerChoice choice = mapResultSetToAnswerChoice(rs);
                        Question question = questionMap.get(choice.getQuestionId());
                        if (question != null) {
                            question.getAnswerChoices().add(choice);
                        }
                    }
                }
            }

        }
        return quiz;
    }

    @Override
    public List<AnswerChoice> getCorrectAnswerChoicesForQuestions(List<Long> questionIds) throws SQLException {
        List<AnswerChoice> correctChoices = new ArrayList<>();
        if (questionIds == null || questionIds.isEmpty()) {
            return correctChoices;
        }

        StringBuilder sql = new StringBuilder(
                "SELECT choice_id, question_id, choice_text, is_correct FROM answer_choices WHERE is_correct = 1 AND question_id IN (");
        for (int i = 0; i < questionIds.size(); i++) {
            sql.append("?");
            if (i < questionIds.size() - 1) {
                sql.append(",");
            }
        }
        sql.append(")");

        try (Connection conn = ConnectionFactory.getConnection();
                PreparedStatement stmt = conn.prepareStatement(sql.toString())) {

            for (int i = 0; i < questionIds.size(); i++) {
                stmt.setLong(i + 1, questionIds.get(i));
            }

            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    correctChoices.add(mapResultSetToAnswerChoice(rs));
                }
            }
        }
        return correctChoices;
    }

    private Quiz mapResultSetToQuiz(ResultSet rs) throws SQLException {
        Quiz quiz = new Quiz();
        quiz.setQuizId(rs.getLong("quiz_id"));
        quiz.setTitle(rs.getString("title"));
        quiz.setDisasterType(rs.getString("disaster_type"));
        return quiz;
    }

    private Question mapResultSetToQuestion(ResultSet rs) throws SQLException {
        Question question = new Question();
        question.setQuestionId(rs.getLong("question_id"));
        question.setQuizId(rs.getLong("quiz_id"));
        question.setQuestionText(rs.getString("question_text"));
        question.setPoints(rs.getInt("points"));
        return question;
    }

    private AnswerChoice mapResultSetToAnswerChoice(ResultSet rs) throws SQLException {
        AnswerChoice choice = new AnswerChoice();
        choice.setChoiceId(rs.getLong("choice_id"));
        choice.setQuestionId(rs.getLong("question_id"));
        choice.setChoiceText(rs.getString("choice_text"));
        choice.setIsCorrect(rs.getInt("is_correct") == 1);
        return choice;
    }
}