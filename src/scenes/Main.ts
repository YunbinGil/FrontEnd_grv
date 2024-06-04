import { MAP_MAIN } from "@constants/assets";
import { DOWN } from "@constants/directions";
import { IPosition } from "@constants/position";
import { TYPE_GAME, TYPE_GAME_2, TYPE_GAME_3, TYPE_MAIN } from "@constants/scenes";
import BaseScene from "utilities/base-secne";

class Main extends BaseScene {
  coinPopup!: HTMLElement;
  coinPopupText!: HTMLElement;
  popup!: HTMLElement;
  popupText!: HTMLElement;
  songPopup!: HTMLElement;
  songPopupText!: HTMLElement;
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
    this.createSongPopup();

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
      // const gameTypes = [TYPE_GAME, TYPE_GAME_2, TYPE_GAME_3];
      // const selectedGameType = gameTypes[Math.floor(Math.random() * gameTypes.length)];
      // this.scene.start(selectedGameType);
      if (this.songPopup) {
        this.songPopup.style.display = "block";
    }
    
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

  createSongPopup() {
    // 팝업 생성
    this.songPopup = document.createElement("div");
    this.songPopup.id = "songPopup";
    this.songPopup.className = "popups";
    this.songPopup.style.top="50%";

    const closeImg = document.createElement("img");
    closeImg.id = "closeSongPopupImg";
    closeImg.src = "https://d1myusrzlknp8y.cloudfront.net/src/assets/maps/PNG_resources/close.png";
    closeImg.style.width = "40px"; closeImg.style.height="20px";
    this.songPopup.appendChild(closeImg);

    closeImg.addEventListener("click", () => {
        this.songPopup!.style.display = "none";
    });

     const textElement = document.createElement("div");
     textElement.innerText = "Select a Song to play";
     textElement.style.position = "absolute";
     textElement.style.top = "10px";
     textElement.style.right = "85px";
     textElement.style.fontSize = "16px";
     this.songPopup.appendChild(textElement);
 

    this.songPopupText = document.createElement("div");
    this.songPopupText.className = "popup-text";
    this.songPopup.appendChild(this.songPopupText);

    // 버튼 1
    const game1Button = document.createElement("button");
    game1Button.innerText = "Song-unknown";
    game1Button.style.display = "block";
        game1Button.style.width = "100%";
        game1Button.style.margin = "10px 0";
        game1Button.style.padding = "10px";
        game1Button.style.cursor = "pointer";
    game1Button.addEventListener("click", () => {
      this.songPopup!.style.display = "none";
      this.scene.start(TYPE_GAME);})
    this.songPopup.appendChild(game1Button);

    // 버튼 2
    const game2Button = document.createElement("button");
    game2Button.innerText = "Supernova - aespa";
    game2Button.style.display = "block";
        game2Button.style.width = "100%";
        game2Button.style.margin = "10px 0";
        game2Button.style.padding = "10px";
        game2Button.style.cursor = "pointer";
    game2Button.addEventListener("click", () => {
      this.songPopup!.style.display = "none";
      this.scene.start(TYPE_GAME_2);})
    this.songPopup.appendChild(game2Button);

    // 버튼 3
    const game3Button = document.createElement("button");
    game3Button.innerText = "Get A Guitar - RIIZE";
    game3Button.style.display = "block";
        game3Button.style.width = "100%";
        game3Button.style.margin = "10px 0";
        game3Button.style.padding = "10px";
        game3Button.style.cursor = "pointer";
    game3Button.addEventListener("click", () => {
      this.songPopup!.style.display = "none";
      this.scene.start(TYPE_GAME_3);})
    this.songPopup.appendChild(game3Button);

    document.body.appendChild(this.songPopup);
}
}

export default Main;
