export const disasterTranslations = {
  FLOOD: "ENCHENTE",
  EARTHQUAKE: "TERREMOTO",
  FIRE: "INCENDIO",
  HURRICANE: "FURACAO",
  TORNADO: "TORNADO",
  LANDSLIDE: "DESLIZAMENTO",
  DROUGHT: "SECA",
  TSUNAMI: "TSUNAMI",
  STORM: "TEMPESTADE",

  FLOOD_DESC: "Enchente",
  EARTHQUAKE_DESC: "Terremoto",
  FIRE_DESC: "Incêndio",
  HURRICANE_DESC: "Furacão",
  TORNADO_DESC: "Tornado",
  LANDSLIDE_DESC: "Deslizamento",
  DROUGHT_DESC: "Seca",
  TSUNAMI_DESC: "Tsunami",
  STORM_DESC: "Tempestade",
};

export const translateDisasterType = (type) => {
  return disasterTranslations[type] || type;
};

export const getDisasterDescription = (type) => {
  const descKey = `${type}_DESC`;
  return disasterTranslations[descKey] || type;
};
