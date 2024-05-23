import { MAP_MAIN } from "@constants/assets";
import { DOWN } from "@constants/directions";
import { IPosition } from "@constants/position";
import { TYPE_MAIN } from "@constants/scenes";
import BaseScene from "utilities/base-secne";

class Main extends BaseScene {
  constructor() {
    super(TYPE_MAIN);
  }

  init() {
    super.init(this.getPosition());
  }

  create(): void {
    return super.create(
      MAP_MAIN,
      [
        "cow",
        "forest",
        "forest_cliff",
        "forest_props",
        "forest_structures",
        "galletcity_tiles128",
        "galletcity1024",
        "galletcity2048",
        "konkuk_edge",
        "konkuk_edge_white",
        "market_assets",
        "mic128",
        "settlement",
        "trees",
        "water",
      ],
      false
    );
  }

  registerCollision() {
    this.map.layers.map((layer) => {
      console.log(layer);
    });

    let player = this.player.players[this.player.username];
  }

  getPosition(): IPosition {
    return {
      x: 400,
      y: 300,
      direction: DOWN,
    };
  }
}

export default Main;
