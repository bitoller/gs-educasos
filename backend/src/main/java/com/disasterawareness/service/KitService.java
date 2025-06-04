package com.disasterawareness.service;

import java.sql.SQLException;
import java.util.List;

import com.disasterawareness.dao.KitDAO;
import com.disasterawareness.dao.KitDAOImpl;
import com.disasterawareness.model.Kit;

public class KitService {
    private final KitDAO kitDAO;
    private final RecommendedItemsService recommendedItemsService;

    public KitService() {
        this.kitDAO = new KitDAOImpl();
        this.recommendedItemsService = new RecommendedItemsService();
    }

    public Kit createKit(String houseType, int residents, boolean hasChildren,
            boolean hasElderly, boolean hasPets, String region, boolean isCustom, String customRecommendedItems)
            throws SQLException {

        Kit kit = new Kit(houseType, residents, hasChildren, hasElderly, hasPets, region, "", isCustom);

        validateKit(kit);

        if (isCustom) {
            if (customRecommendedItems == null || customRecommendedItems.trim().isEmpty()) {
                throw new IllegalArgumentException("Item de recomendação é obrigatório para kits personalizados.");
            }
            kit.setRecommendedItems(customRecommendedItems);
        } else {
            kit.setRecommendedItems(recommendedItemsService.generateRecommendedItems(kit));
        }

        return kitDAO.create(kit);
    }

    public Kit getKitById(Long kitId) throws SQLException {
        Kit kit = kitDAO.findById(kitId);
        if (kit == null) {
            throw new IllegalArgumentException("Kit não encontrado.");
        }
        return kit;
    }

    public List<Kit> getKitsByHouseType(String houseType) throws SQLException {
        return kitDAO.findByHouseType(houseType);
    }

    public List<Kit> getKitsByRegion(String region) throws SQLException {
        return kitDAO.findByRegion(region);
    }

    public List<Kit> getAllKits() throws SQLException {
        return kitDAO.findAll();
    }

    public Kit updateKit(Kit kit) throws SQLException {
        Kit existingKit = kitDAO.findById(kit.getKitId());
        if (existingKit == null) {
            throw new IllegalArgumentException("Kit não encontrado.");
        }

        validateKit(kit);

        if (kit.getIsCustom()) {
            if (kit.getRecommendedItems() == null || kit.getRecommendedItems().trim().isEmpty()) {
                throw new IllegalArgumentException("Item de recomendação é obrigatório para kits personalizados.");
            }
        } else {
            kit.setRecommendedItems(recommendedItemsService.generateRecommendedItems(kit));
        }

        return kitDAO.update(kit);
    }

    public boolean deleteKit(Long kitId) throws SQLException {
        Kit kit = kitDAO.findById(kitId);
        if (kit == null) {
            throw new IllegalArgumentException("Kit não encontrado.");
        }

        return kitDAO.delete(kitId);
    }

    public void validateKit(Kit kit) {
        if (kit.getHouseType() == null || kit.getHouseType().trim().isEmpty()) {
            throw new IllegalArgumentException("Tipo de residência é obrigatório.");
        }

        if (kit.getResidents() <= 0) {
            throw new IllegalArgumentException("Número de residentes deve ser maior que zero.");
        }

        if (kit.getRegion() == null || kit.getRegion().trim().isEmpty()) {
            throw new IllegalArgumentException("Região é obrigatória.");
        }
    }
}