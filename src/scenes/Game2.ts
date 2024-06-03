import { Scene } from "phaser";
import { TYPE_GAME_2 } from "@constants/scenes";
import { isKeyPressed } from "utilities/game-key";

class Game2 extends Scene {
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
    super({ key: TYPE_GAME_2 });
  }
  preload() {
    this.load.audio(
      "song",
      "https://d1myusrzlknp8y.cloudfront.net/src/assets/game/aespa_Supernova.mp3"
    );
    this.physics.world.debugGraphic.visible = false;
    // this.load.json('noteData', 'timestamps_supernova.json');
  }

  create() {
    /*---------------*/
    // 타임스탬프 JSON 파일을 읽어들입니다.
    // fetch('notes_timestamps.json')
    //     .then(response => response.json())
    //     .then(data => {
    //         this.notesTimestamps = JSON.parse(data);
    //     })
    //     .catch(error => {
    //         console.error(error);
    // });

   
    this.notesTimestamps =  JSON.parse(
        '[{"timestamp": 666}, {"timestamp": 2665}, {"timestamp": 3249}, {"timestamp": 3416}, {"timestamp": 4249}, {"timestamp": 4583}, {"timestamp": 4749}, {"timestamp": 5499}, {"timestamp": 5749}, {"timestamp": 5916}, {"timestamp": 5999}, {"timestamp": 7083}, {"timestamp": 7333}, {"timestamp": 8333}, {"timestamp": 8416}, {"timestamp": 8499}, {"timestamp": 9249}, {"timestamp": 10249}, {"timestamp": 11249}, {"timestamp": 12166}, {"timestamp": 13166}, {"timestamp": 13749}, {"timestamp": 13999}, {"timestamp": 14166}, {"timestamp": 14916}, {"timestamp": 15166}, {"timestamp": 15416}, {"timestamp": 15666}, {"timestamp": 16166}, {"timestamp": 16249}, {"timestamp": 17166}, {"timestamp": 18249}, {"timestamp": 19166}, {"timestamp": 19582}, {"timestamp": 20208}, {"timestamp": 21166}, {"timestamp": 21666}, {"timestamp": 21833}, {"timestamp": 22124}, {"timestamp": 22665}, {"timestamp": 23041}, {"timestamp": 23291}, {"timestamp": 23499}, {"timestamp": 23749}, {"timestamp": 24208}, {"timestamp": 25166}, {"timestamp": 25708}, {"timestamp": 25916}, {"timestamp": 26208}, {"timestamp": 26582}, {"timestamp": 27166}, {"timestamp": 27624}, {"timestamp": 27874}, {"timestamp": 28166}, {"timestamp": 28582}, {"timestamp": 29166}, {"timestamp": 30166}, {"timestamp": 31083}, {"timestamp": 32124}, {"timestamp": 33083}, {"timestamp": 33624}, {"timestamp": 33958}, {"timestamp": 34333}, {"timestamp": 34833}, {"timestamp": 35166}, {"timestamp": 36208}, {"timestamp": 37208}, {"timestamp": 38166}, {"timestamp": 38999}, {"timestamp": 39249}, {"timestamp": 39499}, {"timestamp": 39749}, {"timestamp": 39958}, {"timestamp": 39999}, {"timestamp": 40208}, {"timestamp": 40333}, {"timestamp": 41124}, {"timestamp": 42124}, {"timestamp": 42583}, {"timestamp": 42791}, {"timestamp": 43541}, {"timestamp": 43708}, {"timestamp": 44166}, {"timestamp": 44666}, {"timestamp": 44874}, {"timestamp": 46208}, {"timestamp": 46791}, {"timestamp": 46916}, {"timestamp": 47666}, {"timestamp": 47791}, {"timestamp": 48499}, {"timestamp": 48749}, {"timestamp": 49333}, {"timestamp": 50166}, {"timestamp": 51166}, {"timestamp": 51999}, {"timestamp": 52541}, {"timestamp": 52749}, {"timestamp": 53124}, {"timestamp": 54083}, {"timestamp": 54583}, {"timestamp": 54791}, {"timestamp": 55499}, {"timestamp": 55708}, {"timestamp": 56708}, {"timestamp": 57124}, {"timestamp": 57624}, {"timestamp": 58083}, {"timestamp": 58333}, {"timestamp": 58708}, {"timestamp": 59666}, {"timestamp": 59708}, {"timestamp": 60333}, {"timestamp": 60583}, {"timestamp": 61083}, {"timestamp": 61458}, {"timestamp": 61833}, {"timestamp": 62166}, {"timestamp": 62541}, {"timestamp": 62916}]'
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
    this.noteBar = this.add.rectangle(800 / 2, 520, 800, 10, 0xff0000);

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

    // Help text under the red bar
    this.helpText = this.add.text(
      800 / 2,
      490,
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

//   spawnNotes() {
//     // lets look up to the 10 next notes and spawn if needed
//     for (let i = this.lastNoteIndex; i < this.lastNoteIndex + 10; i++) {
//       let note = this.notesTimestamps[i];
//       if (!note) break;

//       // Spawn note if: is not already spawned, and the timing is right. From the start of the song, we need to consider the time it takes for the note to fall so we start it at the timestamp minus the time to fall
//       if (
//         note.spawned != true &&
//         note.timestamp <= Date.now() - this.startTime + this.timeToFall
//       ) {
//         this.spawnNote();
//         this.lastNoteIndex = i;
//         note.spawned = true;
//       }
//     }
//   }
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
      let collider = this.add.circle(800 / 2, 520, 15, 0xaaaaff);
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
      if (dummyNote.y >= 520 && dummyNote.y <= 530) {
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

export default Game2;
