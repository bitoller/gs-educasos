package com.disasterawareness.model;

public class Kit {
    private Long kitId;
    private String houseType;
    private int residents;
    private boolean hasChildren;
    private boolean hasElderly;
    private boolean hasPets;
    private String region;
    private String recommendedItems;
    private boolean isCustom;

    public Kit() {
    }

    public Kit(String houseType, int residents, boolean hasChildren, boolean hasElderly,
            boolean hasPets, String region, String recommendedItems, boolean isCustom) {
        this.houseType = houseType;
        this.residents = residents;
        this.hasChildren = hasChildren;
        this.hasElderly = hasElderly;
        this.hasPets = hasPets;
        this.region = region;
        this.recommendedItems = recommendedItems;
        this.isCustom = isCustom;
    }

    public Long getKitId() {
        return kitId;
    }

    public void setKitId(Long kitId) {
        this.kitId = kitId;
    }

    public String getHouseType() {
        return houseType;
    }

    public void setHouseType(String houseType) {
        this.houseType = houseType;
    }

    public int getResidents() {
        return residents;
    }

    public void setResidents(int residents) {
        this.residents = residents;
    }

    public boolean getHasChildren() {
        return hasChildren;
    }

    public void setHasChildren(boolean hasChildren) {
        this.hasChildren = hasChildren;
    }

    public boolean getHasElderly() {
        return hasElderly;
    }

    public void setHasElderly(boolean hasElderly) {
        this.hasElderly = hasElderly;
    }

    public boolean getHasPets() {
        return hasPets;
    }

    public void setHasPets(boolean hasPets) {
        this.hasPets = hasPets;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public String getRecommendedItems() {
        return recommendedItems;
    }

    public void setRecommendedItems(String recommendedItems) {
        this.recommendedItems = recommendedItems;
    }

    public boolean getIsCustom() {
        return isCustom;
    }

    public void setIsCustom(boolean isCustom) {
        this.isCustom = isCustom;
    }
}