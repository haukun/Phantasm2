class CScenePause extends BCSCene {

    constructor(_callback) {
        super();
        this.backPicture = get();
        this.tick = 0;
        this.callback = _callback;
        cursor();
    }

    act() {
        this.tick++;
        image(this.backPicture, 0, 0);
        background(0, min(this.tick, 30) / 60);

        push();
        stroke(0)
        textSize(50);
        textAlign(CENTER)
        fill(255);
        text("Press 'Q' to return to the game.", HW, HH);
        pop();
  
        this.input();
    }

    input() {
        if (keyIsDown(81)) {
            noCursor();
            this.callback();
        }
    }
}