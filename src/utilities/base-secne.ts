import { IPosition } from "@constants/position";
import { TScenes } from "@constants/scenes";
import { Scene } from "phaser";
import TilesetAnimation from "./tileset-animation";
import { FADE_DURATION } from "@constants/config";
import Player from "assets/objects/player";
import { layerTilesetMap } from "@constants/assets";

class BaseScene extends Scene {
  player!: Player;
  key: TScenes;
  layers!: Phaser.Tilemaps.TilemapLayer[];
  prevSceneKey?: TScenes;
  nextSceneKey?: TScenes;
  transition!: boolean;
  keyboard!: {
    cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
    isUp: () => boolean;
    isLeft: () => boolean;
    isDown: () => boolean;
    isRight: () => boolean;
  };
  withTSAnimation?: boolean;
  map!: Phaser.Tilemaps.Tilemap;
  tilesets!: Phaser.Tilemaps.Tileset[];
  tilesetAnimation!: TilesetAnimation;

  constructor(key: TScenes) {
    super({ key });
    this.key = key;
  }

  init(position: IPosition) {
    this.player = new Player(this, this.key, position);
    this.scene.setVisible(false, this.key);
    this.layers = [];
    this.prevSceneKey = this.key;
    this.transition = true;
    this.input.keyboard!.removeAllListeners();
  }

  initKeyboard() {
    const cursorKeys = this.input.keyboard?.createCursorKeys();

    this.keyboard = {
      cursorKeys: cursorKeys!,
      isUp: () => {
        return cursorKeys!.up.isDown;
      },
      isLeft: () => {
        return cursorKeys!.left.isDown;
      },
      isDown: () => {
        return cursorKeys!.down.isDown;
      },
      isRight: () => {
        return cursorKeys!.right.isDown;
      },
    };
  }

  create(tilemap: string, tilesets: string[], withTSAnimation: boolean) {
    this.withTSAnimation = withTSAnimation;
    this.map = this.add.tilemap(tilemap);
    this.tilesets = tilesets
      .map((tileset) => this.map.addTilesetImage(tileset))
      .filter(
        (tileset): tileset is Phaser.Tilemaps.Tileset => tileset !== null
      );

    this.player.create();

    this.layers = this.map.layers.map((layer) => {
      if (layer.name.startsWith("tree")) {
        return this.map.createLayer(layer.name, "trees", 0, 0)!;
      }
      const tilesetNames = layerTilesetMap[layer.name];
      const tilesets = tilesetNames
        .map((name) => this.tilesets.find((tileset) => tileset.name === name))
        .filter(
          (tileset): tileset is Phaser.Tilemaps.Tileset => tileset !== undefined
        );
      return this.map.createLayer(layer.name, tilesets, 0, 0)!;
    });

    this.cameras.main.setBackgroundColor("#222");
    this.cameras.main.on("camerafadeincomplete", () => {
      this.transition = false;

      this.input.keyboard!.on("keyup", (event: { keyCode: number }) => {
        if (event.keyCode >= 37 && event.keyCode <= 40) {
          this.player.stop();
        }
      });

      this.registerCollision();
    });

    this.initKeyboard();
    this.cameras.main.on("camerafadeoutcomplete", this.changeScene.bind(this));
  }

  update() {
    if (this.transition === false) {
      this.player.update({
        isUp: this.keyboard.isUp(),
        isDown: this.keyboard.isDown(),
        isLeft: this.keyboard.isLeft(),
        isRight: this.keyboard.isRight(),
      });
    }
  }

  onChangeScene() {
    this.transition = true;
    this.player.stop();
    this.cameras.main.fadeOut(FADE_DURATION);
  }

  changeScene() {
    if (this.withTSAnimation) this.tilesetAnimation.destroy();
    this.player.socket.deactivate();
    this.scene.start(this.nextSceneKey, this.prevSceneKey as Object);
  }

  registerCollision() {
    throw new Error("registerCollision() not implemented");
  }

  registerTilesetAnimation(layer: Phaser.Tilemaps.TilemapLayer) {
    this.tilesetAnimation = new TilesetAnimation();
    this.tilesets.forEach((tileset) => {
      this.tilesetAnimation.register(layer, tileset.tileData);
    });
    this.tilesetAnimation.start();
  }
}

export default BaseScene;
