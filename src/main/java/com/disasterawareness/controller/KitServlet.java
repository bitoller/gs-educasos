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

        try {
            if (pathInfo == null || pathInfo.equals("/")) {
                List<Kit> kits = kitService.getAllKits();
                response.getWriter().write(gson.toJson(kits));
            } else if (pathInfo.startsWith("/house/")) {
                String houseType = pathInfo.substring("/house/".length());
                List<Kit> kits = kitService.getKitsByHouseType(houseType);
                response.getWriter().write(gson.toJson(kits));
            } else if (pathInfo.startsWith("/region/")) {
                String region = pathInfo.substring("/region/".length());
                List<Kit> kits = kitService.getKitsByRegion(region);
                response.getWriter().write(gson.toJson(kits));
            } else {
                Long kitId = Long.parseLong(pathInfo.substring(1));
                Kit kit = kitService.getKitById(kitId);
                response.getWriter().write(gson.toJson(kit));
            }

            response.setStatus(HttpServletResponse.SC_OK);

        } catch (NumberFormatException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write(gson.toJson(new ErrorResponse("ID inválido.")));
        } catch (IllegalArgumentException e) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            response.getWriter().write(gson.toJson(new ErrorResponse(e.getMessage())));
        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write(gson.toJson(new ErrorResponse("Erro ao buscar kit.")));
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {
            String houseType = request.getParameter("houseType");
            int numResidents = Integer.parseInt(request.getParameter("numResidents"));
            boolean hasChildren = Boolean.parseBoolean(request.getParameter("hasChildren"));
            boolean hasElderly = Boolean.parseBoolean(request.getParameter("hasElderly"));
            boolean hasPets = Boolean.parseBoolean(request.getParameter("hasPets"));
            String region = request.getParameter("region");

            Kit kit = kitService.createKit(houseType, numResidents, hasChildren, hasElderly, hasPets, region);

            response.setStatus(HttpServletResponse.SC_CREATED);
            response.getWriter().write(gson.toJson(new SuccessResponse("Kit criado com sucesso.", kit)));

        } catch (NumberFormatException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write(gson.toJson(new ErrorResponse("Parâmetros inválidos.")));
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
            String houseType = request.getParameter("houseType");
            int numResidents = Integer.parseInt(request.getParameter("numResidents"));
            boolean hasChildren = Boolean.parseBoolean(request.getParameter("hasChildren"));
            boolean hasElderly = Boolean.parseBoolean(request.getParameter("hasElderly"));
            boolean hasPets = Boolean.parseBoolean(request.getParameter("hasPets"));
            String region = request.getParameter("region");

            Kit kit = new Kit();
            kit.setKitId(kitId);
            kit.setHouseType(houseType);
            kit.setResidents(numResidents);
            kit.setHasChildren(hasChildren);
            kit.setHasElderly(hasElderly);
            kit.setHasPets(hasPets);
            kit.setRegion(region);

            Kit updatedKit = kitService.updateKit(kit);

            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().write(gson.toJson(new SuccessResponse("Kit atualizado com sucesso.", updatedKit)));

        } catch (NumberFormatException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write(gson.toJson(new ErrorResponse("Parâmetros inválidos.")));
        } catch (IllegalArgumentException e) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
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