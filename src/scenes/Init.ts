import { Scene } from "phaser";

export default class Init extends Scene {
    constructor() {
        super({ key: "Init" });
    }

    create() {
        this.scene.start("Preloader");
    }
}
