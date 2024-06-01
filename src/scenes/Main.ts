import { MAP_MAIN } from "@constants/assets";
import { DOWN } from "@constants/directions";
import { IPosition } from "@constants/position";
import { TYPE_GAME, TYPE_MAIN } from "@constants/scenes";
import BaseScene from "utilities/base-secne";
import CoinManager from './Coin';

class Main extends BaseScene {
  private coinManager: CoinManager;//추가

  constructor() {
    super(TYPE_MAIN);
    this.coinManager = new CoinManager(this); //추가
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
        "box",
      ],
      false
    );
  }

  registerCollision() {
    // Collision
    const player = this.player.players[this.player.username];
    this.layers[29].setCollisionByExclusion([-1]);
    this.physics.add.collider(player, this.layers[29]);

    // CollisionStatue
    this.layers[30].setCollisionByExclusion([-1]);
    this.physics.add.collider(player, this.layers[30], () => {
      //this.game.scale.setGameSize(1980, 1080);
      this.scene.start(TYPE_GAME);
    });

    // CollisionBox
    this.layers[31].setCollisionByExclusion([-1]);
    this.physics.add.collider(player, this.layers[31], () => {
      console.log("CollisionBox"); // 여기에 박스 충돌 시 동작 추가
      this.coinManager.showPopup(); //추가
    });

    // CollisionMarket
    this.layers[32].setCollisionByExclusion([-1]);
    this.physics.add.collider(player, this.layers[32], () => {
      console.log("CollisionMarket"); // 여기에 마켓 충돌 시 동작 추가
    });
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
