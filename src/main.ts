import Phaser, { Game } from "phaser";
import VirtualJoystickPlugin from "phaser3-rex-plugins/plugins/virtualjoystick-plugin";
import { HEIGHT, WIDTH } from "@constants/config";
import { USERNAME, INIT } from "@constants/scenes";
import scene from "@scenes/index";

const config = {
  type: Phaser.AUTO,
  width: WIDTH,
  height: HEIGHT,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: true,
    },
  },
  plugins: {
    global: [
      {
        key: "virtualJoystick",
        plugin: VirtualJoystickPlugin,
        start: true,
      },
    ],
  },
  scene: scene,
};

new Game(config);