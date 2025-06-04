package com.disasterawareness.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.disasterawareness.model.Kit;
import com.disasterawareness.utils.ConnectionFactory;

public class KitDAOImpl implements KitDAO {

    @Override
    public Kit create(Kit kit) throws SQLException {
        String sql = "INSERT INTO kits (house_type, num_residents, has_children, has_elderly, has_pets, region, recommended_items, is_custom) "
                +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = ConnectionFactory.getConnection();
                PreparedStatement stmt = conn.prepareStatement(sql, new String[] { "kit_id" })) {

            stmt.setString(1, kit.getHouseType());
            stmt.setInt(2, kit.getResidents());
            stmt.setBoolean(3, kit.getHasChildren());
            stmt.setBoolean(4, kit.getHasElderly());
            stmt.setBoolean(5, kit.getHasPets());
            stmt.setString(6, kit.getRegion());
            stmt.setString(7, kit.getRecommendedItems());
            stmt.setBoolean(8, kit.getIsCustom());

            int affectedRows = stmt.executeUpdate();

            if (affectedRows == 0) {
                throw new SQLException("Falha ao criar kit, nenhuma linha afetada.");
            }

            try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    java.math.BigDecimal id = generatedKeys.getBigDecimal(1);
                    kit.setKitId(id.longValue());
                    return kit;
                } else {
                    throw new SQLException("Falha ao criar kit, nenhum ID obtido.");
                }
            }
        }
    }

    @Override
    public Kit findById(Long kitId) throws SQLException {
        String sql = "SELECT * FROM kits WHERE kit_id = ?";

        try (Connection conn = ConnectionFactory.getConnection();
                PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setLong(1, kitId);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToKit(rs);
                }
            }
        }
        return null;
    }

    @Override
    public List<Kit> findByHouseType(String houseType) throws SQLException {
        String sql = "SELECT * FROM kits WHERE house_type = ?";
        List<Kit> kits = new ArrayList<>();

        try (Connection conn = ConnectionFactory.getConnection();
                PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, houseType);

            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    kits.add(mapResultSetToKit(rs));
                }
            }
        }
        return kits;
    }

    @Override
    public List<Kit> findByRegion(String region) throws SQLException {
        String sql = "SELECT * FROM kits WHERE region = ?";
        List<Kit> kits = new ArrayList<>();

        try (Connection conn = ConnectionFactory.getConnection();
                PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, region);

            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    kits.add(mapResultSetToKit(rs));
                }
            }
        }
        return kits;
    }

    @Override
    public List<Kit> findAll() throws SQLException {
        String sql = "SELECT * FROM kits";
        List<Kit> kits = new ArrayList<>();

        try (Connection conn = ConnectionFactory.getConnection();
                PreparedStatement stmt = conn.prepareStatement(sql);
                ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                kits.add(mapResultSetToKit(rs));
            }
        }
        return kits;
    }

    @Override
    public Kit update(Kit kit) throws SQLException {
        String sql = "UPDATE kits SET house_type = ?, num_residents = ?, has_children = ?, " +
                "has_elderly = ?, has_pets = ?, region = ?, recommended_items = ?, is_custom = ? WHERE kit_id = ?";

        try (Connection conn = ConnectionFactory.getConnection();
                PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, kit.getHouseType());
            stmt.setInt(2, kit.getResidents());
            stmt.setBoolean(3, kit.getHasChildren());
            stmt.setBoolean(4, kit.getHasElderly());
            stmt.setBoolean(5, kit.getHasPets());
            stmt.setString(6, kit.getRegion());
            stmt.setString(7, kit.getRecommendedItems());
            stmt.setBoolean(8, kit.getIsCustom());
            stmt.setLong(9, kit.getKitId());

            int affectedRows = stmt.executeUpdate();

            if (affectedRows == 0) {
                throw new SQLException("Falha ao atualizar kit, nenhuma linha afetada.");
            }

            return kit;
        }
    }

    @Override
    public boolean delete(Long kitId) throws SQLException {
        String sql = "DELETE FROM kits WHERE kit_id = ?";

        try (Connection conn = ConnectionFactory.getConnection();
                PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setLong(1, kitId);

            int affectedRows = stmt.executeUpdate();
            return affectedRows > 0;
        }
    }

    private Kit mapResultSetToKit(ResultSet rs) throws SQLException {
        Kit kit = new Kit();
        kit.setKitId(rs.getLong("kit_id"));
        kit.setHouseType(rs.getString("house_type"));
        kit.setResidents(rs.getInt("num_residents"));
        kit.setHasChildren(rs.getBoolean("has_children"));
        kit.setHasElderly(rs.getBoolean("has_elderly"));
        kit.setHasPets(rs.getBoolean("has_pets"));
        kit.setRegion(rs.getString("region"));
        kit.setRecommendedItems(rs.getString("recommended_items"));
        kit.setIsCustom(rs.getBoolean("is_custom"));
        return kit;
    }
}