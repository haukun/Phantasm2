class CSceneDebugCommand extends BCSCene {

    constructor(_callback) {
        super();
        this.backPicture = get();
        this.tick = 0;
        this.callback = _callback;
        cursor();
        this.keyReleased = false;
        this.command = "";
        this.keysReleased = [];
    }

    act() {
        this.tick++;
        image(this.backPicture, 0, 0);
        background(0, 0.5);

        push();
        stroke(0)
        textSize(30);
        textAlign(LEFT);
        text("> " + this.command, 10, 895);
        pop();
  
        this.input();
    }

    input() {
        if (keyIsDown(27)) {
            this.callback();
        }
        if (keyIsPressed) {
            if (keyCode == ENTER) {
                if (this.keyReleased) {
                    this.exec();
                    this.callback();
                }
            } else if (keyIsDown(SHIFT)) {
            } else if (keyCode == BACKSPACE) {
                if (this.keyReleased && this.command.length > 0) {
                    this.command = this.command.slice(0, -1);
                }
            } else {
                this.keysReleased.forEach(e => {
                    if (!keyIsDown(key.charCodeAt(0) - 32)) {
                        let index = this.keysReleased.indexOf(key);
                        this.keysReleased.splice(index, 1);
                    }
                })

                if (!this.keysReleased.includes(key) && keyIsDown(key.charCodeAt(0) - 32)) {
                    this.command += key;
                    this.keysReleased.push(key);
                }
            }
            this.keyReleased = false;
        } else {
            this.keyReleased = true;
            this.keysReleased = [];
        }
    }

    exec() {
        let parts = this.command.trim().split(/\s+/);

        switch (parts[0]) {
            case "show":
                for (let y = 0; y < TM.worldHeight; y++) {
                    for (let x = 0; x < TM.worldWidth; x++) {
                        TM.TILES[y][x].show = 255;
                    }
                }
                break;
            case "next":
                MSG.send({ msg: MSG_REACH_STAIR });
                break;
        }

        this.command = "";
    }
}