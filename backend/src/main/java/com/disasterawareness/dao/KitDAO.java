package com.disasterawareness.dao;

import java.sql.SQLException;
import java.util.List;

import com.disasterawareness.model.Kit;

public interface KitDAO {
    Kit create(Kit kit) throws SQLException;

    Kit findById(Long kitId) throws SQLException;

    List<Kit> findByHouseType(String houseType) throws SQLException;

    List<Kit> findByRegion(String region) throws SQLException;

    List<Kit> findAll() throws SQLException;

    List<Kit> findByUserId(Long userId) throws SQLException;

    Kit update(Kit kit) throws SQLException;

    boolean delete(Long kitId) throws SQLException;
}