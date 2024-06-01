import { MAP_MAIN } from "@constants/assets";
import { DOWN } from "@constants/directions";
import { IPosition } from "@constants/position";
import { TYPE_GAME, TYPE_MAIN, } from "@constants/scenes";
import BaseScene from "utilities/base-secne";

class Main extends BaseScene {

  //Coin
  private coinPopup: HTMLElement | null;
  private coinPopupText: HTMLElement | null;
  private popup: HTMLElement | null;
  private popupText: HTMLElement | null;

  constructor() {
    super(TYPE_MAIN);

    //Coin
    this.coinPopup = null;
    this.coinPopupText = null;

    // 팝업 요소 생성
    this.createCoinPopup();
    // 팝업 숨기기
    this.hideCoinPopup();
    
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
      const popupMessage = '코인획득!! 얏따!..';
      if (this.coinPopup && this.coinPopupText) {
        this.coinPopupText.innerText = popupMessage;
        this.showCoinPopup();
      }
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
  private createCoinPopup() {
    this.coinPopup = document.createElement('div');
    this.coinPopup.id = 'popup';
    this.coinPopup.className = 'popups';

    const closeImg = document.createElement('img');
    closeImg.className = 'closePopupImg'
    closeImg.src = "close-img.png"
    this.coinPopup.appendChild(closeImg);
    closeImg.addEventListener('click', () => {
      //collider에서 coin++하면 계속 ++되는 문제 있음
      //닫을 때 ++ 할게요
      this.data.set("Coin", this.data.get("Coin") + 100);
      console.log(this.data.get("Coin"));
      
      //setText 빨간 줄 떠서 왜 그런지 찾아봤는데 별 말이 안나오기도 하고 잘 작동되길래 그냥 뒀어요
      this.children.getByName("coinText")!.setText("Coin: " + this.data.get("Coin"));
      this.hideCoinPopup();
    });

    const popupImg = document.createElement('img');
    popupImg.id = 'coinImg';
    popupImg.src = "https://d1myusrzlknp8y.cloudfront.net/src/assets/maps/PNG_resources/coin.png";
    this.coinPopup.appendChild(popupImg);

    this.coinPopupText = document.createElement('div');
    this.coinPopupText.className = 'popup-text';
    this.coinPopup.appendChild(this.coinPopupText);

    document.body.appendChild(this.coinPopup);
  }

  private showCoinPopup() {
    if (this.coinPopup) {
      this.coinPopup.style.display = 'block';
    }
  }

  private hideCoinPopup() {
    if (this.coinPopup) {
      this.coinPopup.style.display = 'none';

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
