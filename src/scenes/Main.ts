import { MAP_MAIN } from "@constants/assets";
import { DOWN } from "@constants/directions";
import { IPosition } from "@constants/position";
import { TYPE_GAME, TYPE_MAIN } from "@constants/scenes";
import BaseScene from "utilities/base-secne";

class Main extends BaseScene {
  private popup: HTMLElement | null;
  private popupText: HTMLElement | null;
  constructor() {
    super(TYPE_MAIN);

    this.popup = null;
    this.popupText = null;
    // 팝업 요소 생성
    this.createPopup();

    // 팝업 숨기기
    this.hidePopup();
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
    });

    // CollisionMarket
    this.layers[32].setCollisionByExclusion([-1]);
    this.physics.add.collider(player, this.layers[32], () => {
      console.log("CollisionMarket"); // 여기에 마켓 충돌 시 동작 추가

      const popupMessage = '추후 개발 예정입니다..';
      if (this.popup && this.popupText) {
        this.popupText.innerText = popupMessage;
        this.showPopup();
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

  private createPopup() {
    this.popup = document.createElement('div');
    this.popup.id = 'popup';
    this.popup.className = 'popups';

    const closeImg = document.createElement('img');
    closeImg.id = 'closePopupImg'
    closeImg.src = "close-img.png"
    this.popup.appendChild(closeImg);
    closeImg.addEventListener('click', () => {
      this.hidePopup();
    });

    const popupImg = document.createElement('img');
    popupImg.id = 'popupImg';
    popupImg.src = "힝속았지.png";
    this.popup.appendChild(popupImg);

    this.popupText = document.createElement('div');
    this.popupText.id = 'popup-text';
    this.popup.appendChild(this.popupText);

    document.body.appendChild(this.popup);
  }

  private showPopup() {
    if (this.popup) {
      this.popup.style.display = 'block';
    }
  }

  private hidePopup() {
    if (this.popup) {
      this.popup.style.display = 'none';
    }
  }
}

export default Main;
