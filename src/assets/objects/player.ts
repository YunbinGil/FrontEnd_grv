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
  PUB_CHAT_ALL,
  SUB_CHAT_ALL,
} from "@constants/actions";
import { DOWN, LEFT, RIGHT, TDirection, UP } from "@constants/directions";
import { IMAGE_PLAYER, IMAGE_EMOJI } from "@constants/assets";
import { FADE_DURATION } from "@constants/config";
import { nanoid } from "nanoid";
import { LIKE, DOT, SURPRISE, QUESTION } from "@constants/emojis";

class Player {
  scene: BaseScene;
  room: TScenes;
  position: IPosition;
  socket: StompJs.Client;
  username: string;
  players: {
    [key: string]: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody & {
      username?: Phaser.GameObjects.Text;
      chatBubble?: Phaser.GameObjects.Text; // 추가된 부분
      emojiBubble?: Phaser.GameObjects.Sprite; 
    };
  };

  constructor(scene: BaseScene, room: TScenes, position: IPosition) {
    const storedUsername = localStorage.getItem("username");
    this.scene = scene;
    this.room = room;
    this.position = position;
    this.username = storedUsername || nanoid(5);
    this.players = {};
    this.socket = new StompJs.Client({
      //brokerURL: "ws://localhost:3000/ws",
      brokerURL: "wss://api.getaguitar.site/ws",
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
        if (username !== this.username) {
          this.players[username].x = x;
          this.players[username].y = y;
          this.players[username].username!.x = x - 25;
          this.players[username].username!.y = y - 35;
          this.players[username].anims.play(direction, true);
        }
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

      this.socket.subscribe(SUB_CHAT_ALL, (data) => {
        const chats = JSON.parse(data.body);
        let messages = document.getElementById(MESSAGES)!;
        chats.forEach((chatMessage: any) => {
          const { username, text } = chatMessage;

          if (this.players[username]) {
            this.displayChatMessage(username, text);
          }

          // 메시지 요소에 추가
          messages.innerHTML += `${username} : ${text}<br>`;
        });
        messages.scrollTo(0, messages.scrollHeight);
      });

      this.socket.publish({
        destination: PUB_ALL_PLAYER,
      });

      this.socket.publish({
        destination: PUB_CHAT_ALL,
      });

      this.socket.subscribe('/topic/emoji', (data) => {
        const { username, emojiKey } = JSON.parse(data.body);
        if (username !== this.username && this.players[username]) {
          this.displayOtherPlayerEmoji(username, emojiKey);
        }
      });


      this.registerChat();
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
      this.displayChatMessage(username, text); // 메시지 표시
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
    const player = this.players[this.username];
    player.username!.x = player.x - 30;
    player.body.setVelocity(-SPEED, 0);
    player.anims.play(LEFT, true);
    this.socket.publish({
      destination: PUB_MOVE,
      body: JSON.stringify({
        username: this.username,
        direction: LEFT,
        x: player.x,
        y: player.y,
      }),
    });
  }

  right() {
    const player = this.players[this.username];
    player.username!.x = player.x - 22;
    player.body.setVelocity(SPEED, 0);
    player.anims.play(RIGHT, true);
    this.socket.publish({
      destination: PUB_MOVE,
      body: JSON.stringify({
        username: this.username,
        direction: RIGHT,
        x: player.x,
        y: player.y,
      }),
    });
  }

  up() {
    const player = this.players[this.username];
    player.username!.y = player.y - 40;
    player.body.setVelocity(0, -SPEED);
    player.anims.play(UP, true);
    this.socket.publish({
      destination: PUB_MOVE,
      body: JSON.stringify({
        username: this.username,
        direction: UP,
        x: player.x,
        y: player.y,
      }),
    });
  }

  down() {
    const player = this.players[this.username];
    player.username!.y = player.y - 33;
    player.body.setVelocity(0, SPEED);
    player.anims.play(DOWN, true);
    this.socket.publish({
      destination: PUB_MOVE,
      body: JSON.stringify({
        username: this.username,
        direction: DOWN,
        x: player.x,
        y: player.y,
      }),
    });
  }

  stop() {
    if (this.players[this.username].anims.isPlaying) {
      this.players[this.username].body.setVelocity(0, 0);
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
  },emoji: {
    isF1: boolean;
    isF2: boolean;
    isF3: boolean;
    isF4: boolean;
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

    // 플레이어의 위치를 업데이트한 후에 말풍선의 위치도 업데이트
  for (const username in this.players) {
    const player = this.players[username];
    if (player.chatBubble) {
      player.chatBubble.x = player.x;
      player.chatBubble.y = player.y - 50;
    }
    if (player.emojiBubble) {
      player.emojiBubble.x = player.x;
      player.emojiBubble.y = player.y - 25;
    }
  }

  // 이모지 말풍선 표시 여부 확인
  const { isF1, isF2, isF3, isF4 } = emoji;
  if (isF1) {
    this.showBalloon(LIKE);
  }
  if (isF2) {
    this.showBalloon(DOT);
  }
  if (isF3) {
    this.showBalloon(SURPRISE);
  }
  if (isF4) {
    this.showBalloon(QUESTION);
  }

}
  displayChatMessage(username: string, message: string) {
    if (!this.players[username]) return;
    if (this.players[username].chatBubble) {
      this.players[username].chatBubble!.destroy();
    }
  
    // 줄바꿈 처리 및 길이 제한
    const formattedMessage = this.formatMessage(message, 15, 10);
  
    this.players[username].chatBubble = this.scene.add.text(
      this.players[username].x,
      this.players[username].y - 50,
      formattedMessage,
      { backgroundColor: '#fff', // 말풍선 배경색 흰색
      color: '#000',           // 글자색 검정
      padding: { x: 10, y: 5 },
      align: 'center',
      fontSize: '14px',
      wordWrap: { width: 180 } // 단어 줄바꿈 설정
     }
    ).setOrigin(0.5);
  
    // 5초 후에 말풍선을 제거하는 타이머 설정
    setTimeout(() => {
      if (this.players[username].chatBubble) {
        this.players[username].chatBubble!.destroy();
        this.players[username].chatBubble = undefined; // 말풍선 제거 후 속성을 초기화
      }
    }, 5000);
  }
  
  formatMessage(message: string, maxLength: number, breakLength: number): string {
    let formattedMessage = "";
    let line = "";
    
    for (let i = 0; i < message.length; i++) {
      if (line.length >= breakLength && message[i] === ' ') {
        formattedMessage += line + '\n';
        line = "";
      } else {
        line += message[i];
      }
  
      if (line.length >= maxLength) {
        formattedMessage += line + '\n';
        line = "";
      }
    }
  
    if (line.length > 0) {
      formattedMessage += line;
    }
  
    return formattedMessage;
  }  

  showBalloon(emojiKey: string) {
    if (!this.players[this.username]) return;
    if (this.players[this.username].emojiBubble) {
      this.players[this.username].emojiBubble!.destroy();
    }

    const player = this.players[this.username];
    player.emojiBubble = this.scene.add.sprite(player.x, player.y - 25,
      IMAGE_EMOJI,   emojiKey 
    ).setScale(1).setOrigin(0.5).play(emojiKey);

    // 서버로 이모티콘 업데이트 전송
    this.socket.publish({
      destination: "/topic/emoji",
      body: JSON.stringify({
        username: this.username,
        emojiKey: emojiKey,
      }),
    });
  
    // 5초 후에 emojiBubble을 제거하는 타이머 설정
    setTimeout(() => {
      if (player.emojiBubble) {
        player.emojiBubble!.destroy();
        player.emojiBubble = undefined; // emojiBubble 제거 후 속성을 초기화
      }
    }, 3000);
  }

  displayOtherPlayerEmoji(username: string, emojiKey: string) {
    const player = this.players[username];
  
    if (player.emojiBubble) {
      player.emojiBubble.destroy();
    }
  
    player.emojiBubble = this.scene.add.sprite(player.x, player.y - 25, IMAGE_EMOJI, emojiKey)
      .setScale(1)
      .setOrigin(0.5).play(emojiKey);
  
    // 3초 후에 emojiBubble을 제거하는 타이머 설정
    setTimeout(() => {
      if (player.emojiBubble) {
        player.emojiBubble.destroy();
        player.emojiBubble = undefined; // emojiBubble 제거 후 속성을 초기화
      }
    }, 3000);
  }  


}

export default Player;
