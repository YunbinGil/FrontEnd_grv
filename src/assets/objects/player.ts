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
        this.username = "";
        this.players = {};
        this.socket = new StompJs.Client({
            brokerURL: "ws://localhost:8080/ws",
            debug: (str) => {
                console.log(str);
            },
            reconnectDelay: 5000, // 자동 재 연결
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        fetch("http://localhost:8080/api/user", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                this.username = data.username;
            });
    }

    create() {
        this.socket.activate();

        this.socket.onConnect = () => {
            console.log("Connected");

            this.socket.publish({
                destination: PUB_NEW_PLAYER,
                body: JSON.stringify({
                    room: this.room,
                    position: this.position,
                }),
            });

            this.socket.subscribe(SUB_NEW_PLAYER, (data) => {
                const { id, x, y, direction } = JSON.parse(data.body);
                this.addPlayer(id, x, y, direction);
            });

            this.socket.subscribe(SUB_ALL_PLAYER, (data) => {
                this.scene.cameras.main.fadeFrom(FADE_DURATION);
                this.scene.scene.setVisible(true, this.room);

                const players = JSON.parse(data.body);
                for (const player of players) {
                    this.addPlayer(
                        player.id,
                        player.x,
                        player.y,
                        player.direction
                    );
                }

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
                this.scene.cameras.main.startFollow(
                    this.players[this.username]
                );
                this.players[this.username].setCollideWorldBounds(true);

                this.socket.subscribe(SUB_PLAYER_MOVE, (data) => {
                    const { id, x, y, direction } = JSON.parse(data.body);
                    this.players[id].x = x;
                    this.players[id].y = y;
                    this.players[id].username!.x = x - 25;
                    this.players[id].username!.y = y - 35;
                    this.players[id].anims.play(direction);
                });

                this.socket.subscribe(SUB_PLAYER_STOP, (data) => {
                    const { id, x, y } = JSON.parse(data.body);
                    this.players[id].x = x;
                    this.players[id].y = y;
                    this.players[id].anims.stop();
                });

                this.socket.subscribe(SUB_PLAYER_REMOVE, (data) => {
                    const id = JSON.parse(data.body);
                    this.players[id].username!.destroy();
                    this.players[id].destroy();
                    delete this.players[id];
                });

                this.registerChat();
            });
        };
    }

    addPlayer(id: string, x: number, y: number, direction: TDirection) {
        this.players[id] = this.scene.physics.add.sprite(x, y, IMAGE_PLAYER);
        this.players[id].username = this.scene.add.text(x - 25, y - 35, id);
        this.players[id].anims.play(direction);
        this.players[id].anims.stop();
    }

    registerChat() {
        let chat = document.getElementById(CHAT)!;
        let messages = document.getElementById(MESSAGES)!;

        chat.onsubmit = (e) => {
            e.preventDefault();
            let input = document.getElementById(INPUT)! as HTMLInputElement;

            this.socket.publish({
                destination: PUB_CHAT,
                body: JSON.stringify({
                    room: this.room,
                    message: input.value,
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

        this.socket.subscribe(SUB_CHAT, (data) => {
            const { username, message } = JSON.parse(data.body);
            messages.innerHTML += `${username} : ${message}<br>`;
            messages.scrollTo(0, messages.scrollHeight);
        });
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
                direction: LEFT,
                x: this.players[this.username].x,
                y: this.players[this.username].y,
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
                direction: RIGHT,
                x: this.players[this.username].x,
                y: this.players[this.username].y,
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
                direction: UP,
                x: this.players[this.username].x,
                y: this.players[this.username].y,
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
                direction: DOWN,
                x: this.players[this.username].x,
                y: this.players[this.username].y,
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
                    x: this.players[this.username].x,
                    y: this.players[this.username].y,
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
