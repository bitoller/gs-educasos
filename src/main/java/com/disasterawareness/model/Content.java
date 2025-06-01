package com.disasterawareness.model;

public class Content {
    private Long contentId;
    private String disasterType;
    private String title;
    private String description;
    private String videoUrl;

    public Content() {
    }

    public Content(String disasterType, String title, String description, String videoUrl) {
        this.disasterType = disasterType;
        this.title = title;
        this.description = description;
        this.videoUrl = videoUrl;
    }

    // Getters and Setters
    public Long getContentId() {
        return contentId;
    }

    public void setContentId(Long contentId) {
        this.contentId = contentId;
    }

    public String getDisasterType() {
        return disasterType;
    }

    public void setDisasterType(String disasterType) {
        this.disasterType = disasterType;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getVideoUrl() {
        return videoUrl;
    }

    public void setVideoUrl(String videoUrl) {
        this.videoUrl = videoUrl;
    }
} 