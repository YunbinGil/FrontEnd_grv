import { IPosition } from "@constants/position";
import { TScenes } from "@constants/scenes";
import BaseScene from "utilities/base-secne";
import * as StompJs from "@stomp/stompjs";
import {
  CHAT,
  INPUT,
  MESSAGES,
  PUB_CHAT,
  PUB_MOVE,
  PUB_NEW_PLAYER,
  PUB_STOP,
  PUB_ALL_PLAYER,
  SPEED,
  SUB_ALL_PLAYER,
  SUB_CHAT,
  SUB_NEW_PLAYER,
  SUB_PLAYER_MOVE,
  SUB_PLAYER_REMOVE,
  SUB_PLAYER_STOP,
} from "@constants/actions";
import { DOWN, LEFT, RIGHT, TDirection, UP } from "@constants/directions";
import { IMAGE_PLAYER } from "@constants/assets";
import { FADE_DURATION } from "@constants/config";
import { nanoid } from "nanoid";

class Player {
  scene: BaseScene;
  room: TScenes;
  position: IPosition;
  socket: StompJs.Client;
  username: string;
  players: {
    [key: string]: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody & {
      username?: Phaser.GameObjects.Text;
    };
  };

  constructor(scene: BaseScene, room: TScenes, position: IPosition) {
    this.scene = scene;
    this.room = room;
    this.position = position;
    this.username = nanoid(5);
    this.players = {};
    this.socket = new StompJs.Client({
      brokerURL: "ws://localhost:3000/ws",
      //brokerURL: "wss://api.getaguitar.site/ws",
      debug: (str) => {
        console.log(str);
      },
      reconnectDelay: 0, // 자동 재 연결 없음
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });
  }

  create() {
    this.socket.activate();
    this.socket.onConnect = () => {
      console.log("Connected");

      this.registerChat();

      // set the scene visible
      this.scene.cameras.main.fadeFrom(FADE_DURATION);
      this.scene.scene.setVisible(true, this.room);
      this.scene.physics.world.setBounds(
        0,
        0,
        this.scene.map.widthInPixels,
        this.scene.map.heightInPixels
      );
      this.scene.cameras.main.setBounds(
        0,
        0,
        this.scene.map.widthInPixels,
        this.scene.map.heightInPixels
      );

      this.socket.subscribe(SUB_NEW_PLAYER, (data) => {
        const { username, x, y, direction } = JSON.parse(data.body);
        this.addPlayer(username, x, y, direction);
        this.scene.cameras.main.startFollow(this.players[this.username]);
        this.players[this.username].setCollideWorldBounds(true);
      });

      this.socket.publish({
        destination: PUB_NEW_PLAYER,
        body: JSON.stringify({
          username: this.username,
          room: this.room,
          position: this.position,
        }),
      });

      this.socket.subscribe(SUB_ALL_PLAYER, (data) => {
        const players = JSON.parse(data.body);
        for (const player of players) {
          this.addPlayer(player.username, player.x, player.y, player.direction);
        }
      });

      this.socket.subscribe(SUB_PLAYER_MOVE, (data) => {
        const { username, x, y, direction } = JSON.parse(data.body);
        this.players[username].x = x;
        this.players[username].y = y;
        this.players[username].username!.x = x - 25;
        this.players[username].username!.y = y - 35;
        this.players[username].anims.play(direction, true);
      });

      this.socket.subscribe(SUB_PLAYER_STOP, (data) => {
        const { username, x, y } = JSON.parse(data.body);
        this.players[username].x = x;
        this.players[username].y = y;
        this.players[username].anims.stop();
      });

      this.socket.subscribe(SUB_PLAYER_REMOVE, (data) => {
        const username = data.body;
        this.players[username].username!.destroy();
        this.players[username].destroy();
        delete this.players[username];
      });

      this.socket.publish({
        destination: PUB_ALL_PLAYER,
      });
    };
  }

  addPlayer(username: string, x: number, y: number, direction: TDirection) {
    if (this.players[username]) return;
    this.players[username] = this.scene.physics.add.sprite(x, y, IMAGE_PLAYER);
    this.players[username].username = this.scene.add.text(
      x - 25,
      y - 35,
      username
    );
    this.players[username].anims.play(direction);
    this.players[username].anims.stop();
  }

  registerChat() {
    let chat = document.getElementById(CHAT)!;
    let messages = document.getElementById(MESSAGES)!;

    this.socket.subscribe(SUB_CHAT, (data) => {
      const { text, username } = JSON.parse(data.body);
      messages.innerHTML += `${username} : ${text}<br>`;
      messages.scrollTo(0, messages.scrollHeight);
    });

    chat.onsubmit = (e) => {
      e.preventDefault();
      let input = document.getElementById(INPUT)! as HTMLInputElement;

      this.socket.publish({
        destination: PUB_CHAT,
        body: JSON.stringify({
          room: this.room.toString(),
          text: input.value,
          username: this.username,
        }),
      });
      input.value = "";

      const activeElement = document.activeElement as HTMLElement;

      if (activeElement !== document.body) {
        activeElement.setAttribute("readonly", "readonly");
        activeElement.setAttribute("disabled", "true");

        setTimeout(() => {
          activeElement.removeAttribute("readonly");
          activeElement.removeAttribute("disabled");
        }, 100);
      }
    };
  }

  left() {
    this.players[this.username].username!.x =
      this.players[this.username].x - 30;
    this.players[this.username].body.velocity.x = -SPEED;
    this.players[this.username].body.velocity.y = 0;
    this.players[this.username].anims.play(LEFT, true);
    this.socket.publish({
      destination: PUB_MOVE,
      body: JSON.stringify({
        username: this.username,
        direction: LEFT,
      }),
    });
  }

  right() {
    this.players[this.username].username!.x =
      this.players[this.username].x - 22;
    this.players[this.username].body.velocity.x = SPEED;
    this.players[this.username].body.velocity.y = 0;
    this.players[this.username].anims.play(RIGHT, true);
    this.socket.publish({
      destination: PUB_MOVE,
      body: JSON.stringify({
        username: this.username,
        direction: RIGHT,
      }),
    });
  }

  up() {
    this.players[this.username].username!.y =
      this.players[this.username].y - 40;
    this.players[this.username].body.velocity.x = 0;
    this.players[this.username].body.velocity.y = -SPEED;
    this.players[this.username].anims.play(UP, true);
    this.socket.publish({
      destination: PUB_MOVE,
      body: JSON.stringify({
        username: this.username,
        direction: UP,
      }),
    });
  }

  down() {
    this.players[this.username].username!.y =
      this.players[this.username].y - 33;
    this.players[this.username].body.velocity.x = 0;
    this.players[this.username].body.velocity.y = SPEED;
    this.players[this.username].anims.play(DOWN, true);
    this.socket.publish({
      destination: PUB_MOVE,
      body: JSON.stringify({
        username: this.username,
        direction: DOWN,
      }),
    });
  }

  stop() {
    if (this.players[this.username].anims.isPlaying) {
      this.players[this.username].body.velocity.x = 0;
      this.players[this.username].body.velocity.y = 0;
      this.players[this.username].anims.stop();
      this.socket.publish({
        destination: PUB_STOP,
        body: JSON.stringify({
          username: this.username,
        }),
      });
    }
  }

  update(direction: {
    isUp: boolean;
    isDown: boolean;
    isLeft: boolean;
    isRight: boolean;
  }) {
    const { isUp, isDown, isLeft, isRight } = direction;
    if (isUp) {
      this.up();
    } else if (isDown) {
      this.down();
    } else if (isLeft) {
      this.left();
    } else if (isRight) {
      this.right();
    } else {
      this.stop();
    }
  }
}

export default Player;
