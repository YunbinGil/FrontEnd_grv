import { Scene } from "phaser";
import { TYPE_GAME } from "@constants/scenes";
import { isKeyPressed } from "utilities/game-key";

class Game extends Scene {
  notesTimestamps: any;
  timeToFall: any;
  lastNoteIndex: any;
  notes: any;
  colliders: any;
  score: any;
  noteBar: any;
  startTime: any;
  scoreText: any;
  song: any;
  helpText: any;
  constructor() {
    super({ key: TYPE_GAME });
  }
  preload() {
    this.load.audio(
      "song",
      "https://d1myusrzlknp8y.cloudfront.net/src/assets/game/galactic_dancing.ogg"
    );
  }

  create() {
    /*---------------*/
    // Notes timestamps, made with the other script "record.html". They are relative to the start of the song, meaning a value of 1000 equals to 1 second after the song has started
    this.notesTimestamps = JSON.parse(
      '[{"timestamp":944},{"timestamp":1383},{"timestamp":1768},{"timestamp":2173},{"timestamp":2364},{"timestamp":2562},{"timestamp":2951},{"timestamp":3560},{"timestamp":3767},{"timestamp":3969},{"timestamp":4164},{"timestamp":4565},{"timestamp":4760},{"timestamp":4971},{"timestamp":5377},{"timestamp":5567},{"timestamp":5766},{"timestamp":6163},{"timestamp":6776},{"timestamp":6978},{"timestamp":7181},{"timestamp":7388},{"timestamp":7781},{"timestamp":8174},{"timestamp":8576},{"timestamp":8770},{"timestamp":8965},{"timestamp":9358},{"timestamp":9970},{"timestamp":10177},{"timestamp":10376},{"timestamp":10570},{"timestamp":10964},{"timestamp":11162},{"timestamp":11365},{"timestamp":11762},{"timestamp":11961},{"timestamp":12184},{"timestamp":12561},{"timestamp":13165},{"timestamp":13380},{"timestamp":13575},{"timestamp":13778},{"timestamp":14167},{"timestamp":14370},{"timestamp":14585},{"timestamp":14978},{"timestamp":15177},{"timestamp":15400},{"timestamp":15764},{"timestamp":16356},{"timestamp":16563},{"timestamp":16766},{"timestamp":16973},{"timestamp":17391},{"timestamp":17594},{"timestamp":17792},{"timestamp":17987},{"timestamp":18181},{"timestamp":18367},{"timestamp":18570},{"timestamp":18765},{"timestamp":19145},{"timestamp":19535},{"timestamp":19750},{"timestamp":19961},{"timestamp":20172},{"timestamp":20573},{"timestamp":20772},{"timestamp":20975},{"timestamp":21372},{"timestamp":21579},{"timestamp":21790},{"timestamp":22167},{"timestamp":22771},{"timestamp":22982},{"timestamp":23185},{"timestamp":23578},{"timestamp":23785},{"timestamp":23988},{"timestamp":24182},{"timestamp":24393},{"timestamp":24592},{"timestamp":24790},{"timestamp":24981},{"timestamp":25378},{"timestamp":25771},{"timestamp":26190}]'
    );
    this.timeToFall = 1000; // ms, time for the note to go to the bottom. The lower the faster/hardest
    this.lastNoteIndex = 0; // last note spawned
    this.notes = []; // array of notes already spawned
    this.colliders = []; // colliders for player input vs falling note
    this.score = 0; // score, needs no explanation
    /*--------------*/

    // this is the red bar at the bottom. Does nothing, just for info
    this.noteBar = this.add.rectangle(1920 / 2, 1000, 1920, 10, 0xff0000);

    // The score text
    this.scoreText = this.add.text(100, 100, "SCORE", {
      fontFamily: "arial",
      fontSize: "100px",
    });

    // Help text under the red bar
    this.helpText = this.add.text(
      1920 / 2,
      1050,
      "Press SPACEBAR when yellow dots are on the red line",
      { fontFamily: "arial", fontSize: "50px" }
    );
    this.helpText.setOrigin(0.5, 0.5);

    // We create the audio object and play it
    this.song = this.sound.add("song");
    this.song.volume = 0.1;
    this.song.play();

    // set the start time of the game
    this.startTime = Date.now();
  }

  update() {
    this.handlePlayerInput();
    this.spawnNotes();
    this.checkNoteCollisions();
  }

  spawnNotes() {
    // lets look up to the 10 next notes and spawn if needed
    for (let i = this.lastNoteIndex; i < this.lastNoteIndex + 10; i++) {
      let note = this.notesTimestamps[i];
      if (!note) break;

      // Spawn note if: is not already spawned, and the timing is right. From the start of the song, we need to consider the time it takes for the note to fall so we start it at the timestamp minus the time to fall
      if (
        note.spawned != true &&
        note.timestamp <= Date.now() - this.startTime + this.timeToFall
      ) {
        this.spawnNote();
        this.lastNoteIndex = i;
        note.spawned = true;
      }
    }
  }

  spawnNote() {
    // This is self explanatory. Spawn the note and let it fall to the bottom.
    let note = this.add.circle(1920 / 2, 0, 20, 0xffff00);
    this.notes.push(note);
    this.physics.add.existing(note);
    this.physics.moveTo(note, 1920 / 2, 1000, undefined, this.timeToFall);
  }

  handlePlayerInput() {
    if (isKeyPressed("Space")) {
      // we create a new collider at the position of the red bar
      let collider = this.add.circle(1920 / 2, 1000, 30, 0xaaaaff);

      // attach physics
      this.physics.add.existing(collider);

      // little tween to grow
      this.tweens.add({
        targets: collider,
        scale: 4,
        duration: 100,
        alpha: 0,
        onComplete: () => {
          collider.destroy();

          // If the collider did not hit a note, its a miss, so lets lower the score
          // if (collider.collided != true) {
          //   this.cameras.main.shake(100, 0.01);
          //   this.score -= 200;
          //   this.updateScoreText();
          // }
        },
      });

      // add the collider to the list
      this.colliders.push(collider);
    }
  }

  checkNoteCollisions() {
    this.physics.overlap(this.colliders, this.notes, (collider, note) => {
      // the collider collided
      // collider.collided = true;

      // remove the collider from list
      this.colliders.splice(this.colliders.indexOf(collider), 1);

      // destroy the note and remove from list
      note.destroy();
      this.notes.splice(this.notes.indexOf(note), 1);

      // increase the score and update the text
      this.score += 100;
      this.updateScoreText();
    });
  }

  updateScoreText() {
    this.scoreText.text = this.score;
  }
}

export default Game;
