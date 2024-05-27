import { Scene } from "phaser";
// import { DOWN, LEFT, RIGHT, TOWN, UP } from "@constants/directions";
import { IMAGE_PLAYER, MAP_MAIN } from "@constants/assets";
import { TYPE_INIT, TYPE_USERNAME } from "@constants/scenes";
import { LEFT, RIGHT, UP, DOWN } from "@constants/directions";
import { enrollEvent } from "utilities/game-key";

class Init extends Scene {
  progressBar: Phaser.GameObjects.Graphics | null;
  progressCompleteRect: Phaser.Geom.Rectangle | null;
  progressRect: Phaser.Geom.Rectangle | null;

  constructor() {
    super({ key: TYPE_INIT });
    this.progressBar = null;
    this.progressCompleteRect = null;
    this.progressRect = null;
  }

  preload() {
    enrollEvent();

    this.load.tilemapTiledJSON(
      MAP_MAIN,
      "https://d1myusrzlknp8y.cloudfront.net/src/assets/maps/combine0520.json"
    );
    this.load.spritesheet(
      "cow",
      "https://d1myusrzlknp8y.cloudfront.net/src/assets/maps/PNG_resources/cow.png",
      {
        frameWidth: 32,
        frameHeight: 32,
      }
    );
    this.load.spritesheet(
      "forest",
      "https://d1myusrzlknp8y.cloudfront.net/src/assets/maps/PNG_resources/forest.png",
      {
        frameWidth: 16,
        frameHeight: 16,
      }
    );
    this.load.spritesheet(
      "forest_cliff",
      "https://d1myusrzlknp8y.cloudfront.net/src/assets/maps/PNG_resources/forest_cliff.png",
      {
        frameWidth: 16,
        frameHeight: 16,
      }
    );
    this.load.spritesheet(
      "forest_props",
      "https://d1myusrzlknp8y.cloudfront.net/src/assets/maps/PNG_resources/forest_props.png",
      {
        frameWidth: 16,
        frameHeight: 16,
      }
    );
    this.load.spritesheet(
      "forest_structures",
      "https://d1myusrzlknp8y.cloudfront.net/src/assets/maps/PNG_resources/forest_structures.png",
      {
        frameWidth: 16,
        frameHeight: 16,
      }
    );
    this.load.spritesheet(
      "galletcity_tiles128",
      "https://d1myusrzlknp8y.cloudfront.net/src/assets/maps/PNG_resources/galletcity_tiles128.png",
      {
        frameWidth: 16,
        frameHeight: 16,
      }
    );
    this.load.spritesheet(
      "galletcity1024",
      "https://d1myusrzlknp8y.cloudfront.net/src/assets/maps/PNG_resources/galletcity1024.png",
      {
        frameWidth: 16,
        frameHeight: 16,
      }
    );
    this.load.spritesheet(
      "galletcity2048",
      "https://d1myusrzlknp8y.cloudfront.net/src/assets/maps/PNG_resources/galletcity2048.png",
      {
        frameWidth: 16,
        frameHeight: 16,
      }
    );
    this.load.spritesheet(
      "konkuk_edge",
      "https://d1myusrzlknp8y.cloudfront.net/src/assets/maps/PNG_resources/konkuk_edge.png",
      {
        frameWidth: 16,
        frameHeight: 16,
      }
    );
    this.load.spritesheet(
      "konkuk_edge_white",
      "https://d1myusrzlknp8y.cloudfront.net/src/assets/maps/PNG_resources/konkuk_edge_white.png",
      {
        frameWidth: 16,
        frameHeight: 16,
      }
    );
    this.load.spritesheet(
      "market_assets",
      "https://d1myusrzlknp8y.cloudfront.net/src/assets/maps/PNG_resources/market_assets.png",
      {
        frameWidth: 16,
        frameHeight: 16,
      }
    );
    this.load.spritesheet(
      "mic128",
      "https://d1myusrzlknp8y.cloudfront.net/src/assets/maps/PNG_resources/mic128.png",
      {
        frameWidth: 16,
        frameHeight: 16,
      }
    );
    this.load.spritesheet(
      "settlement",
      "https://d1myusrzlknp8y.cloudfront.net/src/assets/maps/PNG_resources/settlement.png",
      {
        frameWidth: 16,
        frameHeight: 16,
      }
    );
    this.load.spritesheet(
      "trees",
      "https://d1myusrzlknp8y.cloudfront.net/src/assets/maps/PNG_resources/trees.png",
      {
        frameWidth: 16,
        frameHeight: 16,
      }
    );
    this.load.spritesheet(
      "water",
      "https://d1myusrzlknp8y.cloudfront.net/src/assets/maps/PNG_resources/water.png",
      {
        frameWidth: 16,
        frameHeight: 16,
      }
    );
    this.load.spritesheet(
      "meta_tile",
      "https://d1myusrzlknp8y.cloudfront.net/src/assets/maps/PNG_resources/meta_tile.png",
      {
        frameWidth: 16,
        frameHeight: 16,
      }
    );

    this.load.spritesheet(
      IMAGE_PLAYER,
      "https://d1myusrzlknp8y.cloudfront.net/src/assets/sprites/player.png",
      {
        frameWidth: 32,
        frameHeight: 32,
      }
    );

    this.load.image(
      "logo",
      "https://d1myusrzlknp8y.cloudfront.net/src/assets/sprites/logo.png"
    );

    /* this.load.audio('music-town', ['assets/music/town.mp3']); */

    this.load.on("progress", this.onLoadProgress, this);
    this.load.on("complete", this.onLoadComplete, this);
    this.createProgressBar();
  }

  create() {
    /*
        this.music = this.sound.add('music-town', { loop: true });
        this.music.play();
    */

    this.anims.create({
      key: LEFT,
      frames: this.anims.generateFrameNumbers(IMAGE_PLAYER, {
        start: 3,
        end: 5,
      }),
      frameRate: 13,
      repeat: -1,
    });

    this.anims.create({
      key: RIGHT,
      frames: this.anims.generateFrameNumbers(IMAGE_PLAYER, {
        start: 6,
        end: 8,
      }),
      frameRate: 13,
      repeat: -1,
    });

    this.anims.create({
      key: UP,
      frames: this.anims.generateFrameNumbers(IMAGE_PLAYER, {
        start: 9,
        end: 11,
      }),
      frameRate: 13,
      repeat: -1,
    });

    this.anims.create({
      key: DOWN,
      frames: this.anims.generateFrameNumbers(IMAGE_PLAYER, {
        start: 0,
        end: 2,
      }),
      frameRate: 13,
      repeat: -1,
    });

    document
      .querySelector("canvas")!
      .addEventListener("pointerdown", function () {
        const activeElement = document.activeElement! as HTMLInputElement;

        if (document.activeElement !== document.body) {
          activeElement.setAttribute("readonly", "readonly");
          activeElement.setAttribute("disabled", "true");

          setTimeout(function () {
            activeElement.blur();
            activeElement.removeAttribute("readonly");
            activeElement.removeAttribute("disabled");
          }, 100);
        }
      });
  }

  createProgressBar() {
    let Rectangle = Phaser.Geom.Rectangle;
    let main = Rectangle.Clone(
      this.cameras.main as unknown as Phaser.Geom.Rectangle
    );

    this.progressRect = new Rectangle(0, 0, main.width / 2, 50);
    Rectangle.CenterOn(this.progressRect, main.centerX, main.centerY);

    this.progressCompleteRect = Phaser.Geom.Rectangle.Clone(this.progressRect);

    this.progressBar = this.add.graphics();
  }

  onLoadComplete() {
    this.scene.start(TYPE_USERNAME);
  }

  onLoadProgress(progress: number) {
    let color = 0xffffff;

    this.progressRect!.width = progress * this.progressCompleteRect!.width;
    this.progressBar!.clear()
      .fillStyle(0x222222)
      .fillRectShape(this.progressCompleteRect!)
      .fillStyle(color)
      .fillRectShape(this.progressRect!);
  }
}

export default Init;
