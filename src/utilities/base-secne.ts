import { IPosition } from "@constants/position";
import { TScenes } from "@constants/scenes";
import { Scene } from "phaser";

class BaseScene extends Scene {
    key: TScenes;
    layers!: Phaser.Tilemaps.TilemapLayer[];
    prevSceneKey?: TScenes;
    nextSceneKey?: TScenes;
    transition!: boolean;

    constructor(key: TScenes) {
        super({ key });
        this.key = key;
    }

    init(position: IPosition) {
        this.scene.setVisible(false, this.key);
        // this.player = new Player(this, this.key, position);
        this.layers = [];
        this.prevSceneKey = this.key;
        this.transition = true;
        // this.input.keyboard.removeAllListeners();
    }
}
