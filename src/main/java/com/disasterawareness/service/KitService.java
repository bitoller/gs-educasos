package com.disasterawareness.service;

import java.sql.SQLException;
import java.util.List;

import com.disasterawareness.dao.KitDAO;
import com.disasterawareness.dao.KitDAOImpl;
import com.disasterawareness.model.Kit;

public class KitService {
    private final KitDAO kitDAO;

    public KitService() {
        this.kitDAO = new KitDAOImpl();
    }

    public Kit createKit(String houseType, int residents, boolean hasChildren,
            boolean hasElderly, boolean hasPets, String region) throws SQLException {
        Kit kit = new Kit(houseType, residents, hasChildren, hasElderly, hasPets, region, "");
        validateKit(kit);
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

    public String generateRecommendedItems(Kit kit) {
        StringBuilder items = new StringBuilder();

        // Itens básicos para qualquer kit
        items.append("Água potável (4L por pessoa por dia)\n");
        items.append("Alimentos não perecíveis\n");
        items.append("Lanterna e pilhas extras\n");
        items.append("Rádio portátil\n");
        items.append("Kit de primeiros socorros\n");
        items.append("Documentos importantes\n");
        items.append("Dinheiro em espécie\n");

        // Itens específicos baseados no tipo de residência
        switch (kit.getHouseType().toLowerCase()) {
            case "apartamento":
                items.append("Escada de emergência\n");
                items.append("Extintor de incêndio\n");
                break;
            case "casa":
                items.append("Ferramentas básicas\n");
                items.append("Corda resistente\n");
                break;
        }

        // Itens específicos para crianças
        if (kit.getHasChildren()) {
            items.append("Fórmula infantil (se aplicável)\n");
            items.append("Fraldas\n");
            items.append("Brinquedos e jogos\n");
        }

        // Itens específicos para idosos
        if (kit.getHasElderly()) {
            items.append("Medicamentos essenciais\n");
            items.append("Óculos e aparelhos auditivos extras\n");
            items.append("Cadeira de rodas portátil (se necessário)\n");
        }

        // Itens específicos para pets
        if (kit.getHasPets()) {
            items.append("Ração para animais\n");
            items.append("Coleira e guia extras\n");
            items.append("Documentação dos animais\n");
        }

        return items.toString();
    }
}