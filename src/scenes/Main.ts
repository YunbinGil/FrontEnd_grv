import { MAP_MAIN } from "@constants/assets";
import { DOWN } from "@constants/directions";
import { IPosition } from "@constants/position";
import { TYPE_GAME_2, TYPE_MAIN } from "@constants/scenes";
import BaseScene from "utilities/base-secne";

class Main extends BaseScene {
  coinPopup!: HTMLElement;
  coinPopupText!: HTMLElement;
  popup!: HTMLElement;
  popupText!: HTMLElement;
  coin: number = 0;

  constructor() {
    super(TYPE_MAIN);
  }

  init() {
    super.init(this.getPosition());
  }

  create(): void {
    this.createCoinPopup();
    this.createPopup();

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
      this.scene.start(TYPE_GAME_2);
    });

    // CollisionBox
    this.layers[31].setCollisionByExclusion([-1]);
    this.physics.add.collider(player, this.layers[31], () => {
      const popupMessage = "코인획득!! 얏따!..";
      if (this.coinPopup && this.coinPopupText) {
        this.coinPopupText.innerText = popupMessage;
        this.coinPopup.style.display = "block";
      }
    });

    // CollisionMarket
    this.layers[32].setCollisionByExclusion([-1]);
    this.physics.add.collider(player, this.layers[32], () => {
      const popupMessage = "추후 개발 예정입니다..";
      if (this.popup && this.popupText) {
        this.popupText.innerText = popupMessage;
        this.popup.style.display = "block";
      }
    });
  }

  getPosition(): IPosition {
    return {
      x: 400,
      y: 300,
      direction: DOWN,
    };
  }

  createCoinPopup() {
    this.coinPopup = document.createElement("div");
    this.coinPopup.id = "coin-popup";
    this.coinPopup.className = "popups";

    const closeImg = document.createElement("img");
    closeImg.id = "closePopupImg";
    closeImg.src =
      "https://d1myusrzlknp8y.cloudfront.net/src/assets/maps/PNG_resources/close.png";
    this.coinPopup.appendChild(closeImg);

    closeImg.addEventListener("click", () => {
      this.coin += 100;
      super.updateCoinText(this.coin);
      this.coinPopup!.style.display = "none";
    });

    const popupImg = document.createElement("img");
    popupImg.id = "coinImg";
    popupImg.src =
      "https://d1myusrzlknp8y.cloudfront.net/src/assets/maps/PNG_resources/coin.png";
    this.coinPopup.appendChild(popupImg);

    this.coinPopupText = document.createElement("div");
    this.coinPopupText.className = "popup-text";
    this.coinPopup.appendChild(this.coinPopupText);

    document.body.appendChild(this.coinPopup);
  }

  createPopup() {
    this.popup = document.createElement("div");
    this.popup.id = "popup";
    this.popup.className = "popups";

    const closeImg = document.createElement("img");
    closeImg.id = "closePopupImg";
    closeImg.src =
      "https://d1myusrzlknp8y.cloudfront.net/src/assets/maps/PNG_resources/close.png";
    this.popup.appendChild(closeImg);

    closeImg.addEventListener("click", () => {
      this.popup!.style.display = "none";
    });

    const popupImg = document.createElement("img");
    popupImg.id = "popupImg";
    popupImg.src =
      "https://d1myusrzlknp8y.cloudfront.net/src/assets/maps/PNG_resources/fake.png";
    this.popup.appendChild(popupImg);

    this.popupText = document.createElement("div");
    this.popupText.className = "popup-text";
    this.popup.appendChild(this.popupText);

    document.body.appendChild(this.popup);
  }
}

export default Main;
