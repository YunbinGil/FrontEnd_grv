import { IPosition } from "@constants/position";
import { TScenes } from "@constants/scenes";
import BaseScene from "utilities/base-secne";

class Player {
    scene: BaseScene;
    room: TScenes;
    position: IPosition;

    constructor(scene: BaseScene, room: TScenes, position: IPosition) {
        this.scene = scene;
        this.room = room;
        this.position = position;
    }
}
