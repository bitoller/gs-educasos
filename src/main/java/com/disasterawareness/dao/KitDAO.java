package com.disasterawareness.dao;

import com.disasterawareness.model.Kit;
import java.sql.SQLException;
import java.util.List;

public interface KitDAO {
    Kit create(Kit kit) throws SQLException;
    Kit findById(Long kitId) throws SQLException;
    List<Kit> findByHouseType(String houseType) throws SQLException;
    List<Kit> findByRegion(String region) throws SQLException;
    List<Kit> findAll() throws SQLException;
    Kit update(Kit kit) throws SQLException;
    boolean delete(Long kitId) throws SQLException;
} 