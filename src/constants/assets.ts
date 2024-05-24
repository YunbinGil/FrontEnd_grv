export const IMAGE_PLAYER = "player";
export const MAP_MAIN = "map-main";

type LayerTilesetMap = {
  [key: string]: string[];
};

export const layerTilesetMap: LayerTilesetMap = {
  collision: ["meta_tile"],
  lakeTile: ["galletcity_tiles128"],
  statue: ["cow", "mic128"],
  statueGrass: ["trees"],
  fence: ["settlement"],
  dirtLake: ["water", "settlement", "forest_cliff", "forest_props", "forest"],
  grassRoad: ["forest"],
  building: [
    "galletcity1024",
    "galletcity2048",
    "galletcity_tiles128",
    "konkuk_edge",
    "konkuk_edge_white",
    "settlement",
  ],
  stageMarket: ["market_assets", "forest_cliff"],
  road: ["galletcity1024", "galletcity2048", "galletcity_tiles128"],
  decoRock: ["forest_props"],
  decoGrass: ["forest_structure", "forest_props", "forest_cliff"],
  collisionStatue: ["meta_tile"],
};
