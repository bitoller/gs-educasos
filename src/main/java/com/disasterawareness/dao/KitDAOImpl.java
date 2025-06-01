package com.disasterawareness.dao;

import com.disasterawareness.model.Kit;
import com.disasterawareness.utils.ConnectionFactory;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class KitDAOImpl implements KitDAO {
    
    @Override
    public Kit create(Kit kit) throws SQLException {
        String sql = "INSERT INTO Kits (house_type, residents, has_children, has_elderly, has_pets, region, recommended_items) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?)";
        
        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            
            stmt.setString(1, kit.getHouseType());
            stmt.setInt(2, kit.getResidents());
            stmt.setBoolean(3, kit.getHasChildren());
            stmt.setBoolean(4, kit.getHasElderly());
            stmt.setBoolean(5, kit.getHasPets());
            stmt.setString(6, kit.getRegion());
            stmt.setString(7, kit.getRecommendedItems());
            
            int affectedRows = stmt.executeUpdate();
            
            if (affectedRows == 0) {
                throw new SQLException("Falha ao criar kit, nenhuma linha afetada.");
            }
            
            try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    kit.setKitId(generatedKeys.getLong(1));
                    return kit;
                } else {
                    throw new SQLException("Falha ao criar kit, nenhum ID obtido.");
                }
            }
        }
    }
    
    @Override
    public Kit findById(Long kitId) throws SQLException {
        String sql = "SELECT * FROM Kits WHERE kit_id = ?";
        
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
        String sql = "SELECT * FROM Kits WHERE house_type = ?";
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
        String sql = "SELECT * FROM Kits WHERE region = ?";
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
        String sql = "SELECT * FROM Kits";
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
        String sql = "UPDATE Kits SET house_type = ?, residents = ?, has_children = ?, " +
                    "has_elderly = ?, has_pets = ?, region = ?, recommended_items = ? WHERE kit_id = ?";
        
        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, kit.getHouseType());
            stmt.setInt(2, kit.getResidents());
            stmt.setBoolean(3, kit.getHasChildren());
            stmt.setBoolean(4, kit.getHasElderly());
            stmt.setBoolean(5, kit.getHasPets());
            stmt.setString(6, kit.getRegion());
            stmt.setString(7, kit.getRecommendedItems());
            stmt.setLong(8, kit.getKitId());
            
            int affectedRows = stmt.executeUpdate();
            
            if (affectedRows == 0) {
                throw new SQLException("Falha ao atualizar kit, nenhuma linha afetada.");
            }
            
            return kit;
        }
    }
    
    @Override
    public boolean delete(Long kitId) throws SQLException {
        String sql = "DELETE FROM Kits WHERE kit_id = ?";
        
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
        kit.setResidents(rs.getInt("residents"));
        kit.setHasChildren(rs.getBoolean("has_children"));
        kit.setHasElderly(rs.getBoolean("has_elderly"));
        kit.setHasPets(rs.getBoolean("has_pets"));
        kit.setRegion(rs.getString("region"));
        kit.setRecommendedItems(rs.getString("recommended_items"));
        return kit;
    }
} 