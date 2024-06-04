import { Scene } from "phaser";
import { TYPE_GAME_3 } from "@constants/scenes";
import { isKeyPressed } from "utilities/game-key";

class Game3 extends Scene {
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
  collided: any;
  bottom: any;
  dummyScore: any;
  dummyScoreText: any;
  dummyScoreTimer: any;
  dummyNotes: any;
  lastDummyNoteIndex: any;

  constructor() {
    super({ key: TYPE_GAME_3 });
  }
  preload() {
    this.load.audio(
      "song",
      "https://d1myusrzlknp8y.cloudfront.net/src/assets/game/RIIZE-01-GetAGuitar.mp3"
    );
    this.physics.world.debugGraphic.visible = false;
  }

  create() {   
    this.notesTimestamps =  JSON.parse(
       '[{"timestamp": 583}, {"timestamp": 1916}, {"timestamp": 2062}, {"timestamp": 2749}, {"timestamp": 3020}, {"timestamp": 3958}, {"timestamp": 4520}, {"timestamp": 5083}, {"timestamp": 5249}, {"timestamp": 5354}, {"timestamp": 5458}, {"timestamp": 5729}, {"timestamp": 6270}, {"timestamp": 6833}, {"timestamp": 7354}, {"timestamp": 7812}, {"timestamp": 8062}, {"timestamp": 8416}, {"timestamp": 8916}, {"timestamp": 9311}, {"timestamp": 9479}, {"timestamp": 9729}, {"timestamp": 9833}, {"timestamp": 9958}, {"timestamp": 10458}, {"timestamp": 11083}, {"timestamp": 11479}, {"timestamp": 11854}, {"timestamp": 12437}, {"timestamp": 12729}, {"timestamp": 12833}, {"timestamp": 13270}, {"timestamp": 13666}, {"timestamp": 14083}, {"timestamp": 14958}, {"timestamp": 15479}, {"timestamp": 16041}, {"timestamp": 16562}, {"timestamp": 16770}, {"timestamp": 17145}, {"timestamp": 17708}, {"timestamp": 18229}, {"timestamp": 18395}, {"timestamp": 18520}, {"timestamp": 18624}, {"timestamp": 18854}, {"timestamp": 19354}, {"timestamp": 19854}, {"timestamp": 20291}, {"timestamp": 20437}, {"timestamp": 20541}, {"timestamp": 20937}, {"timestamp": 21332}, {"timestamp": 21520}, {"timestamp": 22020}, {"timestamp": 22145}, {"timestamp": 22270}, {"timestamp": 22624}, {"timestamp": 22770}, {"timestamp": 22895}, {"timestamp": 23166}, {"timestamp": 23686}, {"timestamp": 23791}, {"timestamp": 24249}, {"timestamp": 24748}, {"timestamp": 24874}, {"timestamp": 24979}, {"timestamp": 25333}, {"timestamp": 25895}, {"timestamp": 25979}, {"timestamp": 26416}, {"timestamp": 26562}, {"timestamp": 26687}, {"timestamp": 26979}, {"timestamp": 27124}, {"timestamp": 27229}, {"timestamp": 27541}, {"timestamp": 28062}, {"timestamp": 28187}, {"timestamp": 28520}, {"timestamp": 28854}, {"timestamp": 29145}, {"timestamp": 29291}, {"timestamp": 29583}, {"timestamp": 29854}, {"timestamp": 30166}, {"timestamp": 30437}, {"timestamp": 30729}, {"timestamp": 31062}, {"timestamp": 31333}, {"timestamp": 31583}, {"timestamp": 31729}, {"timestamp": 32145}, {"timestamp": 32458}, {"timestamp": 32729}, {"timestamp": 34416}, {"timestamp": 34645}, {"timestamp": 35145}, {"timestamp": 35249}, {"timestamp": 35687}, {"timestamp": 35812}, {"timestamp": 36562}, {"timestamp": 36812}, {"timestamp": 36937}, {"timestamp": 37041}, {"timestamp": 37416}, {"timestamp": 37916}, {"timestamp": 38479}, {"timestamp": 38958}, {"timestamp": 39457}, {"timestamp": 39562}, {"timestamp": 39666}, {"timestamp": 39812}, {"timestamp": 40124}, {"timestamp": 40229}, {"timestamp": 40374}, {"timestamp": 40541}, {"timestamp": 41083}, {"timestamp": 41333}, {"timestamp": 41729}, {"timestamp": 42145}, {"timestamp": 42291}, {"timestamp": 42812}, {"timestamp": 43333}, {"timestamp": 43791}, {"timestamp": 43874}, {"timestamp": 43999}, {"timestamp": 44124}, {"timestamp": 44458}, {"timestamp": 44583}, {"timestamp": 44708}, {"timestamp": 44833}, {"timestamp": 45499}, {"timestamp": 45999}, {"timestamp": 46354}, {"timestamp": 46666}, {"timestamp": 46958}, {"timestamp": 47229}, {"timestamp": 47354}, {"timestamp": 47479}, {"timestamp": 47604}, {"timestamp": 47999}, {"timestamp": 48270}, {"timestamp": 48541}, {"timestamp": 48833}, {"timestamp": 48979}, {"timestamp": 49083}, {"timestamp": 49229}, {"timestamp": 49874}, {"timestamp": 50416}, {"timestamp": 50749}, {"timestamp": 51041}, {"timestamp": 51333}, {"timestamp": 51583}, {"timestamp": 51729}, {"timestamp": 51854}, {"timestamp": 52020}, {"timestamp": 52416}, {"timestamp": 52708}, {"timestamp": 52979}, {"timestamp": 53229}, {"timestamp": 53374}, {"timestamp": 53499}, {"timestamp": 53666}, {"timestamp": 54208}, {"timestamp": 54729}, {"timestamp": 55124}, {"timestamp": 55374}, {"timestamp": 55687}, {"timestamp": 55916}, {"timestamp": 56104}, {"timestamp": 56479}, {"timestamp": 56999}, {"timestamp": 57270}, {"timestamp": 57583}, {"timestamp": 57895}, {"timestamp": 58124}, {"timestamp": 58249}, {"timestamp": 58354}, {"timestamp": 58624}, {"timestamp": 59166}, {"timestamp": 59499}, {"timestamp": 59770}, {"timestamp": 60083}, {"timestamp": 60229}, {"timestamp": 60812}, {"timestamp": 61333}, {"timestamp": 61624}, {"timestamp": 61937}, {"timestamp": 62229}, {"timestamp": 62458}, {"timestamp": 62583}, {"timestamp": 62729}, {"timestamp": 62999}, {"timestamp": 63312}, {"timestamp": 63812}, {"timestamp": 64083}, {"timestamp": 64249}, {"timestamp": 64666}, {"timestamp": 64916}, {"timestamp": 65041}, {"timestamp": 65415}, {"timestamp": 65729}, {"timestamp": 66041}, {"timestamp": 66291}, {"timestamp": 66416}, {"timestamp": 66833}, {"timestamp": 67083}, {"timestamp": 67208}, {"timestamp": 67437}, {"timestamp": 67583}, {"timestamp": 67895}]'
    );
    this.timeToFall = 1000; // ms, time for the note to go to the bottom. The lower the faster/hardest
    this.lastNoteIndex = 0; // last note spawned
    this.notes = []; // array of notes already spawned
    this.colliders = []; // colliders for player input vs falling note
    this.score = 0; // score, needs no explanation
    this.dummyScore = 0;
    this.dummyNotes = []; // 더미 노트 배열 초기화
    this.lastDummyNoteIndex = 0; // 마지막으로 생성된 더미 노트 인덱스 초기화
    /*--------------*/

    // this is the red bar at the bottom. Does nothing, just for info
    this.noteBar = this.add.rectangle(800 / 2, 520-40, 800, 10, 0xff0000);

    this.bottom = this.add.rectangle(800 / 2, 600, 800, 10, 0x808080);
    this.physics.add.existing(this.bottom);

    // The score text
    this.add.text(30, 30, "MY SCORE", {
      fontFamily: "arial",
      fontSize: "24px",
    });
    this.scoreText = this.add.text(30, 60, "0", {
      fontFamily: "arial",
      fontSize: "32px",
    });

    // Dummy user score text
    this.add.text(600, 30, "RIVAL SCORE", {
      fontFamily: "arial",
      fontSize: "24px",
    });
    this.dummyScoreText = this.add.text(600, 60, "0", {
      fontFamily: "arial",
      fontSize: "32px",
    });

    //Song Title text
    this.add.text(30, 120, "Now Playing ... ▶ Get A Guitar - RIIZE", {
        fontFamily: "arial",
        fontSize: "21px",
    });

    // Help text under the red bar
    this.helpText = this.add.text(
      800 / 2,
      490-40,
      "Press SPACEBAR when yellow dots are on the red line",
      { fontFamily: "arial", fontSize: "24px" }
    );
    this.helpText.setOrigin(0.5, 0.5);

    // We create the audio object and play it
    this.song = this.sound.add("song");
    this.song.volume = 0.1;
    this.song.play();

    // set the start time of the game
    let sync = 350;
    this.startTime = Date.now() + sync;
  }

  update() {
    this.handlePlayerInput();
    this.spawnNotes();
    this.spawnDummyNotes(); // 더미 노트 생성
    this.checkNoteCollisions();
    this.checkDummyNoteCollisions(); // 더미 노트 충돌 검사
  }

spawnNotes() {
    for (let i = this.lastNoteIndex; i < this.lastNoteIndex + 10; i++) {
        let note = this.notesTimestamps[i];
        if (!note) break;

        if (
            note.spawned != true &&
            note.timestamp <= Date.now() - this.startTime + 1000 // 180 BPM, 1초 간격
        ) {
            this.spawnNote();
            this.lastNoteIndex = i;
            note.spawned = true;
        }
    }
}


  spawnNote() {
    // This is self explanatory. Spawn the note and let it fall to the bottom.
    let note = this.add.circle(800 / 2, 0, 17, 0xffff00);
    this.notes.push(note);
    this.physics.add.existing(note);
    this.physics.moveTo(note, 800 / 2, 600, undefined, this.timeToFall);
  }

  handlePlayerInput() {
    if (isKeyPressed("Space")) {
      // we create a new collider at the position of the red bar
      let collider = this.add.circle(800 / 2, 520-50, 15, 0xaaaaff);
      this.collided = false;

      // attach physics
      this.physics.add.existing(collider);

      // little tween to grow
      this.tweens.add({
        targets: collider,
        scale: 4,
        duration: 70,
        alpha: 0,
        onComplete: () => {
          collider.destroy();

          if (!this.collided) {
            this.cameras.main.shake(100, 0.01);
            this.score = Math.max(0, this.score - 200);
            this.updateScoreText();
          }
        },
      });

      // add the collider to the list
      this.colliders.push(collider);
    }
  }

  checkNoteCollisions() {
    this.physics.overlap(this.colliders, this.notes, (collider, note) => {
      this.collided = true;

      // remove the collider from list
      this.colliders.splice(this.colliders.indexOf(collider), 1);

      // destroy the note and remove from list
      note.destroy();
      this.notes.splice(this.notes.indexOf(note), 1);

      // increase the score and update the text
      this.score += 100;
      this.updateScoreText();
    });

    this.physics.overlap(this.notes, this.bottom, (note) => {
      note.destroy();
      this.cameras.main.shake(100, 0.01);
      this.score = Math.max(0, this.score - 200);
      this.updateScoreText();
    });
  }

  updateScoreText() {
    this.scoreText.text = this.score;
  }

  spawnDummyNotes() {
    for (let i = this.lastDummyNoteIndex; i < this.lastDummyNoteIndex + 10; i++) {
      let note = this.notesTimestamps[i];
      if (!note) break;
  
      if (note.dummySpawned != true &&
          note.timestamp <= Date.now() - this.startTime + this.timeToFall) {
        this.spawnDummyNote();
        this.lastDummyNoteIndex = i;
        note.dummySpawned = true;
      }
    }
  }

  spawnDummyNote() {
    let dummyNote = this.add.circle(800 / 2 + 100, 0, 17, 0xff00ff); // 더미 노트는 오른쪽에 위치
    this.dummyNotes.push(dummyNote);
    this.physics.add.existing(dummyNote);
    this.physics.moveTo(dummyNote, 800 / 2 + 100, 600, undefined, this.timeToFall);
  }

  checkDummyNoteCollisions() {
    let dummyNoteCollided = false;
  
    for (let i = 0; i < this.dummyNotes.length; i++) {
      let dummyNote = this.dummyNotes[i];
      if (dummyNote.y >= 520-40 && dummyNote.y <= 530-40) {
        if (Math.random() < 0.8) {
          dummyNote.destroy();
          this.dummyNotes.splice(i, 1);
          dummyNoteCollided = true;
          this.dummyScore += 100;
        }
      }
  
      if (dummyNote.y > 600) {
        dummyNote.destroy();
        this.dummyNotes.splice(i, 1);
        if (!dummyNoteCollided) {
          this.dummyScore = Math.max(0, this.dummyScore - 200);
        }
      }
    }
  
    this.updateDummyScoreText();
  }

  updateDummyScoreText() {
    this.dummyScoreText.text = this.dummyScore;
  }
}

export default Game3;
