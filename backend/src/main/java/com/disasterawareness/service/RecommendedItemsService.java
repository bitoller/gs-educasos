package com.disasterawareness.service;

import java.util.ArrayList;
import java.util.List;

import com.disasterawareness.model.Kit;
import com.google.gson.Gson;
import com.google.gson.annotations.SerializedName;

public class RecommendedItemsService {

    private final Gson gson = new Gson();

    private static class RecommendedItem {
        @SerializedName("name")
        private String name;
        @SerializedName("description")
        private String description;

        public RecommendedItem(String name, String description) {
            this.name = name;
            this.description = description;
        }
    }

    public String generateRecommendedItems(Kit kit) {
        List<RecommendedItem> items = new ArrayList<>();

        addBasicItems(items, kit.getResidents());

        if (kit.getHasChildren()) {
            addChildrenItems(items);
        }

        if (kit.getHasElderly()) {
            addElderlyItems(items);
        }

        if (kit.getHasPets()) {
            addPetItems(items);
        }

        addRegionItems(items, kit.getRegion());
        addHouseTypeItems(items, kit.getHouseType());

        return gson.toJson(items);
    }

    private void addBasicItems(List<RecommendedItem> items, int residents) {
        items.add(new RecommendedItem("Água", String.format(
                "Estoque de água para \\~%.1f litros por pessoa. Essencial para hidratação em emergências prolongadas.",
                residents * 4.0)));
        items.add(new RecommendedItem("Comida não perecível", String.format(
                "Suprimento para \\~3 dias por pessoa. Escolha itens fáceis de preparar que não necessitem de refrigeração.",
                residents * 3)));
        items.add(new RecommendedItem("Kit de Primeiros Socorros",
                "Um kit completo com bandagens, antissépticos, analgésicos e medicamentos pessoais."));
        items.add(new RecommendedItem("Lanterna e pilhas extras", "Para iluminação em caso de falta de energia."));
        items.add(new RecommendedItem("Apito", "Para sinalizar por ajuda."));
        items.add(new RecommendedItem("Máscaras contra poeira",
                "Para filtrar o ar em ambientes com poeira ou detritos."));
        items.add(new RecommendedItem("Lona plástica e fita adesiva", "Para criar um abrigo temporário."));
        items.add(new RecommendedItem("Chave inglesa ou alicate", "Para desligar serviços públicos, se necessário."));
        items.add(new RecommendedItem("Abridor de latas manual", "Para alimentos enlatados."));
        items.add(new RecommendedItem("Mapas locais", "Caso os sistemas de navegação eletrônica falhem."));
        items.add(new RecommendedItem("Telefone celular com carregadores portáteis", "Para comunicação."));
    }

    private void addChildrenItems(List<RecommendedItem> items) {
        items.add(new RecommendedItem("Suprimentos para bebês/crianças",
                "Inclui fraldas, lenços umedecidos, fórmula/comida para bebê, e medicamentos específicos."));
        items.add(new RecommendedItem("Jogos ou livros", "Para ajudar a manter as crianças calmas e ocupadas."));
    }

    private void addElderlyItems(List<RecommendedItem> items) {
        items.add(new RecommendedItem("Medicamentos extras e equipamentos médicos",
                "Certifique-se de ter um suprimento extra de medicamentos prescritos e quaisquer equipamentos médicos necessários."));
        items.add(new RecommendedItem("Óculos extras ou lentes de contato", "Se aplicável."));
    }

    private void addPetItems(List<RecommendedItem> items) {
        items.add(new RecommendedItem("Comida para pet e água", "Estoque suficiente para vários dias."));
        items.add(new RecommendedItem("Coleira, guia e identificação do pet",
                "Para manter seu pet seguro e identificável."));
        items.add(new RecommendedItem("Caixa de transporte ou bolsa para pet", "Para transporte seguro."));
        items.add(new RecommendedItem("Medicamentos para pet", "Se aplicável."));
    }

    private void addRegionItems(List<RecommendedItem> items, String region) {
        if (region != null) {
            switch (region.toLowerCase()) {
                case "southeast":
                    items.add(new RecommendedItem("Capa de chuva e galochas",
                            "Para proteção contra chuvas fortes comuns na região."));
                    break;
                case "northeast":
                    items.add(new RecommendedItem("Cobertores extras", "Para se proteger do frio."));
                    break;
            }
        }
    }

    private void addHouseTypeItems(List<RecommendedItem> items, String houseType) {
        if (houseType != null) {
            switch (houseType.toLowerCase()) {
                case "house":
                    items.add(new RecommendedItem("Ferramentas básicas",
                            "Martelo, pregos, chave de fenda para pequenos reparos de emergência."));
                    break;
                case "apartment":
                    items.add(new RecommendedItem("Extintor de incêndio portátil",
                            "Um item importante para segurança em apartamentos."));
                    break;
            }
        }
    }
}