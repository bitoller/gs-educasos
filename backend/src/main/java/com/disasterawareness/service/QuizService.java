package com.disasterawareness.service;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.disasterawareness.dao.QuizDAO;
import com.disasterawareness.dao.QuizDAOImpl;
import com.disasterawareness.model.AnswerChoice;
import com.disasterawareness.model.Quiz;

public class QuizService {

    private QuizDAO quizDAO;
    private UserService userService;

    public QuizService() {
        this.quizDAO = new QuizDAOImpl();
        this.userService = new UserService();
    }

    public List<Quiz> getAllQuizzes() throws SQLException {
        return quizDAO.getAllQuizzes();
    }

    public Quiz getQuizById(Long quizId) throws SQLException {
        return quizDAO.getQuizById(quizId);
    }

    public int processQuizSubmission(Long quizId, Long userId, Map<Long, Long> submittedAnswers) throws SQLException {

        Quiz quiz = quizDAO.getQuizById(quizId);
        if (quiz == null || quiz.getQuestions() == null || quiz.getQuestions().isEmpty()) {
            return 0;
        }

        List<Long> questionIds = quiz.getQuestions().stream()
                .map(q -> q.getQuestionId())
                .collect(Collectors.toList());

        List<AnswerChoice> correctChoices = quizDAO.getCorrectAnswerChoicesForQuestions(questionIds);
        Map<Long, Long> correctChoiceMap = correctChoices.stream()
                .collect(Collectors.toMap(
                        AnswerChoice::getQuestionId,
                        AnswerChoice::getChoiceId));

        int totalScoreEarnedThisSubmission = 0;

        for (com.disasterawareness.model.Question question : quiz.getQuestions()) {
            Long submittedChoiceId = submittedAnswers.get(question.getQuestionId());
            Long correctAnswerId = correctChoiceMap.get(question.getQuestionId());

            if (submittedChoiceId != null && submittedChoiceId.equals(correctAnswerId)) {
                if (!userService.hasUserEarnedPointsForQuestion(userId, question.getQuestionId())) {
                    totalScoreEarnedThisSubmission += question.getPoints();
                    userService.recordUserEarnedPointsForQuestion(userId, question.getQuestionId());
                }
            }
        }

        if (totalScoreEarnedThisSubmission > 0) {
            userService.updateUserScore(userId, totalScoreEarnedThisSubmission);
        }

        return totalScoreEarnedThisSubmission;
    }

    public QuizService(QuizDAO quizDAO, UserService userService) {
        this.quizDAO = quizDAO;
        this.userService = userService;
    }
}