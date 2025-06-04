package com.disasterawareness.model;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class User {
    private Long userId;
    private String name;
    private String email;
    @JsonIgnore
    private String passwordHash;
    private Integer score;
    private Boolean isAdmin;
    private Set<Long> completedQuizzes;

    public User() {
        this.completedQuizzes = new HashSet<>();
    }

    public User(String name, String email, String passwordHash) {
        this.name = name;
        this.email = email;
        this.passwordHash = passwordHash;
        this.score = 0;
        this.isAdmin = false;
        this.completedQuizzes = new HashSet<>();
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public Boolean getIsAdmin() {
        return isAdmin;
    }

    public void setIsAdmin(Boolean isAdmin) {
        this.isAdmin = isAdmin;
    }

    public Set<Long> getCompletedQuizzes() {
        return completedQuizzes;
    }

    public void setCompletedQuizzes(Set<Long> completedQuizzes) {
        this.completedQuizzes = completedQuizzes;
    }

    public void addCompletedQuiz(Long quizId) {
        if (this.completedQuizzes == null) {
            this.completedQuizzes = new HashSet<>();
        }
        this.completedQuizzes.add(quizId);
    }

    public boolean hasCompletedQuiz(Long quizId) {
        return this.completedQuizzes != null && this.completedQuizzes.contains(quizId);
    }
}