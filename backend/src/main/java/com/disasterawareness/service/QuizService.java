package com.disasterawareness.service;

import com.disasterawareness.dao.QuizDAO;
import com.disasterawareness.dao.QuizDAOImpl;
import com.disasterawareness.dao.UserDAO;
import com.disasterawareness.dao.UserDAOImpl;
import com.disasterawareness.model.AnswerChoice;
import com.disasterawareness.model.Quiz;
import com.disasterawareness.model.Question;
import com.disasterawareness.model.User;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class QuizService {

    private QuizDAO quizDAO;
    private UserService userService; // Use the existing UserService

    public QuizService() {
        this.quizDAO = new QuizDAOImpl();
        this.userService = new UserService(); // Instantiate UserService
    }

    // Method to get all quizzes
    public List<Quiz> getAllQuizzes() throws SQLException {
        return quizDAO.getAllQuizzes();
    }

    // Method to get a quiz by ID with questions and choices
    public Quiz getQuizById(Long quizId) throws SQLException {
        return quizDAO.getQuizById(quizId);
    }

    // Method to process quiz submission, calculate score, and update user score
    public int processQuizSubmission(Long quizId, Long userId, Map<Long, Long> submittedAnswers) throws SQLException {
        // submittedAnswers is a map of QuestionId -> SubmittedAnswerChoiceId

        Quiz quiz = quizDAO.getQuizById(quizId);
        if (quiz == null || quiz.getQuestions() == null || quiz.getQuestions().isEmpty()) {
            // Handle case where quiz or questions are not found
            return 0; // Or throw an exception
        }

        List<Long> questionIds = quiz.getQuestions().stream()
                                    .map(q -> q.getQuestionId())
                                    .collect(Collectors.toList());

        System.out.println("DEBUG: Processing quiz submission for Quiz ID: " + quizId + ", User ID: " + userId);
        System.out.println("DEBUG: Question IDs in quiz: " + questionIds);
        System.out.println("DEBUG: Submitted answers: " + submittedAnswers);

        List<AnswerChoice> correctChoices = quizDAO.getCorrectAnswerChoicesForQuestions(questionIds);
        Map<Long, Long> correctChoiceMap = correctChoices.stream()
                .collect(Collectors.toMap(
                        AnswerChoice::getQuestionId,
                        AnswerChoice::getChoiceId
                ));

        System.out.println("DEBUG: Correct answer choices retrieved from DB: " + correctChoices.stream().collect(Collectors.toMap(AnswerChoice::getQuestionId, AnswerChoice::getChoiceId)));

        int totalScoreEarned = 0;

        // Calculate score
        for (com.disasterawareness.model.Question question : quiz.getQuestions()) {
            Long submittedChoiceId = submittedAnswers.get(question.getQuestionId());
            Long correctAnswerId = correctChoiceMap.get(question.getQuestionId());

            System.out.println("DEBUG: Question ID: " + question.getQuestionId() + ", Submitted Choice ID: " + submittedChoiceId + ", Correct Choice ID: " + correctAnswerId);

            // Check if the submitted answer is correct
            if (submittedChoiceId != null && submittedChoiceId.equals(correctAnswerId)) {
                totalScoreEarned += question.getPoints();
                System.out.println("DEBUG: Answer for Question " + question.getQuestionId() + " is CORRECT. Earned points: " + question.getPoints());
            } else {
                 System.out.println("DEBUG: Answer for Question " + question.getQuestionId() + " is INCORRECT or not submitted.");
            }
        }

        System.out.println("DEBUG: Total score earned before updating user: " + totalScoreEarned);

        // Update user's score
        userService.updateUserScore(userId, totalScoreEarned);

        System.out.println("DEBUG: User score updated.");

        return totalScoreEarned;
    }

     // Dependency injection constructor (optional, for testing)
     public QuizService(QuizDAO quizDAO, UserService userService) {
        this.quizDAO = quizDAO;
        this.userService = userService;
    }
} 