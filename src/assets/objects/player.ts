import { IPosition } from "@constants/position";
import { TScenes } from "@constants/scenes";
import BaseScene from "utilities/base-secne";
import * as StompJs from "@stomp/stompjs";
import { PUB_NEW_PLAYER, SUB_NEW_PLAYER } from "@constants/actions/player";
import { TDirection } from "@constants/directions";
import { IMAGE_PLAYER } from "@constants/assets";

class Player {
    scene: BaseScene;
    room: TScenes;
    position: IPosition;
    socket: StompJs.Client;
    players: {
        [key: string]: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody & {
            username?: Phaser.GameObjects.Text;
        };
    };

    constructor(scene: BaseScene, room: TScenes, position: IPosition) {
        this.scene = scene;
        this.room = room;
        this.position = position;
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
        };
    }

    addPlayer(id: string, x: number, y: number, direction: TDirection) {
        this.players[id] = this.scene.physics.add.sprite(x, y, IMAGE_PLAYER);
        this.players[id].username = this.scene.add.text(x - 25, y - 35, id);
        this.players[id].anims.play(direction);
        this.players[id].anims.stop();
    }
}

export default Player;
