import { TScenes } from "@constants/scenes";
import { Scene } from "phaser";

class BaseScene extends Scene {
    key: TScenes;

    constructor(key: TScenes) {
        super({ key });
        this.key = key;
    }
}
