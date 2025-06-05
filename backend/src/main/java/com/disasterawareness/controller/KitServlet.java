package com.disasterawareness.controller;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.disasterawareness.model.Kit;
import com.disasterawareness.service.KitService;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

@WebServlet("/api/kit/*")
public class KitServlet extends HttpServlet {
    private final KitService kitService;
    private final Gson gson;

    public KitServlet() {
        this.kitService = new KitService();
        this.gson = new Gson();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String pathInfo = request.getPathInfo();
        Long userId = (Long) request.getAttribute("userId");
        Boolean isAdmin = (Boolean) request.getAttribute("isAdmin");

        try {
            if (pathInfo == null || pathInfo.equals("/")) {
                List<Kit> kits;
                if (isAdmin != null && isAdmin) {
                    kits = kitService.getAllKitsForAdmin();
                } else {
                    kits = kitService.getKitsForUser(userId);
                }
                response.setStatus(HttpServletResponse.SC_OK);
                response.getWriter().write(gson.toJson(kits));
            } else {
                Long kitId = Long.parseLong(pathInfo.substring(1));
                Kit kit = kitService.getKitById(kitId);

                if (kit == null) {
                    response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                    response.getWriter().write(gson.toJson(new ErrorResponse("Kit não encontrado.")));
                } else {
                    if (kit.getUserId().equals(userId) || (isAdmin != null && isAdmin)) {
                        response.setStatus(HttpServletResponse.SC_OK);
                        response.getWriter().write(gson.toJson(kit));
                    } else {
                        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                        response.getWriter().write(
                                gson.toJson(new ErrorResponse("Você não tem permissão para visualizar este kit.")));
                    }
                }
            }
        } catch (NumberFormatException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write(gson.toJson(new ErrorResponse("ID do kit inválido.")));
        } catch (IllegalArgumentException e) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            response.getWriter().write(gson.toJson(new ErrorResponse(e.getMessage())));
        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write(gson.toJson(new ErrorResponse("Erro ao buscar kit(s).")));
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        Long userId = (Long) request.getAttribute("userId");

        try {
            JsonObject jsonRequest = gson.fromJson(request.getReader(), JsonObject.class);

            String houseType = jsonRequest.get("houseType").getAsString();
            int numResidents = jsonRequest.get("numResidents").getAsInt();
            boolean hasChildren = jsonRequest.get("hasChildren").getAsBoolean();
            boolean hasElderly = jsonRequest.get("hasElderly").getAsBoolean();
            boolean hasPets = jsonRequest.get("hasPets").getAsBoolean();
            String region = jsonRequest.get("region").getAsString();

            // Extract isCustom and recommendedItems for custom kits
            boolean isCustom = jsonRequest.has("isCustom") ? jsonRequest.get("isCustom").getAsBoolean() : false;
            String recommendedItems = jsonRequest.has("recommendedItems")
                    ? jsonRequest.get("recommendedItems").getAsString()
                    : null;

            Kit kit = kitService.createKit(houseType, numResidents, hasChildren, hasElderly, hasPets, region, isCustom,
                    recommendedItems, userId);

            response.setStatus(HttpServletResponse.SC_CREATED);
            response.getWriter().write(gson.toJson(new SuccessResponse("Kit criado com sucesso.", kit)));

        } catch (IllegalArgumentException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write(gson.toJson(new ErrorResponse(e.getMessage())));
        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write(gson.toJson(new ErrorResponse("Erro ao criar kit.")));
        }
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String pathInfo = request.getPathInfo();

        try {
            if (pathInfo == null || pathInfo.equals("/")) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write(gson.toJson(new ErrorResponse("ID do kit é obrigatório.")));
                return;
            }

            Long kitId = Long.parseLong(pathInfo.substring(1));

            JsonObject jsonRequest = gson.fromJson(request.getReader(), JsonObject.class);

            String houseType = jsonRequest.get("houseType").getAsString();
            int numResidents = jsonRequest.get("numResidents").getAsInt();
            boolean hasChildren = jsonRequest.get("hasChildren").getAsBoolean();
            boolean hasElderly = jsonRequest.get("hasElderly").getAsBoolean();
            boolean hasPets = jsonRequest.get("hasPets").getAsBoolean();
            String region = jsonRequest.get("region").getAsString();

            boolean isCustom = jsonRequest.has("isCustom") ? jsonRequest.get("isCustom").getAsBoolean() : false;
            String recommendedItems = jsonRequest.has("recommendedItems")
                    ? jsonRequest.get("recommendedItems").getAsString()
                    : null;

            Kit kit = new Kit();
            kit.setKitId(kitId);
            kit.setHouseType(houseType);
            kit.setResidents(numResidents);
            kit.setHasChildren(hasChildren);
            kit.setHasElderly(hasElderly);
            kit.setHasPets(hasPets);
            kit.setRegion(region);
            kit.setIsCustom(isCustom);
            kit.setRecommendedItems(recommendedItems);

            Kit updatedKit = kitService.updateKit(kit);
            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().write(gson.toJson(new SuccessResponse("Kit atualizado com sucesso.", updatedKit)));

        } catch (IllegalArgumentException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write(gson.toJson(new ErrorResponse(e.getMessage())));
        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write(gson.toJson(new ErrorResponse("Erro ao atualizar kit.")));
        }
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String pathInfo = request.getPathInfo();

        try {
            if (pathInfo == null || pathInfo.equals("/")) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write(gson.toJson(new ErrorResponse("ID do kit é obrigatório.")));
                return;
            }

            Long kitId = Long.parseLong(pathInfo.substring(1));
            kitService.deleteKit(kitId);

            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().write(gson.toJson(new SuccessResponse("Kit excluído com sucesso.", null)));

        } catch (NumberFormatException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write(gson.toJson(new ErrorResponse("ID inválido.")));
        } catch (IllegalArgumentException e) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            response.getWriter().write(gson.toJson(new ErrorResponse(e.getMessage())));
        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write(gson.toJson(new ErrorResponse("Erro ao excluir kit.")));
        }
    }

    private static class SuccessResponse {
        private final String message;
        private final Kit kit;

        public SuccessResponse(String message, Kit kit) {
            this.message = message;
            this.kit = kit;
        }
    }

    private static class ErrorResponse {
        private final String error;

        public ErrorResponse(String error) {
            this.error = error;
        }
    }
}