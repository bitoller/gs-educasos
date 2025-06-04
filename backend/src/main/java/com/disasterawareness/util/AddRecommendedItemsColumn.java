package com.disasterawareness.util;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;

import com.disasterawareness.utils.ConnectionFactory;

public class AddRecommendedItemsColumn {

    public static void main(String[] args) {
        String sql = "ALTER TABLE kits ADD recommended_items CLOB";

        try (Connection conn = ConnectionFactory.getConnection();
                Statement stmt = conn.createStatement()) {

            stmt.executeUpdate(sql);
            System.out.println("Column 'recommended_items' added to table 'kits' successfully.");

        } catch (SQLException e) {
            System.err.println("Error adding column 'recommended_items': " + e.getMessage());
            e.printStackTrace();
        }
    }
}