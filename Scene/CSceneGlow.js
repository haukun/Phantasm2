class CSceneGlow extends BCSCene {

    constructor(_callback) {
        super();
        this.backPicture = get();
        this.mouseReleased = false;

        this.tick = 0;
        this.callback = _callback;
    }

    act() {
        this.tick++;
        image(this.backPicture, 0, 0);
        background(0, min(this.tick, 30) / 60);

        push()
        rectMode(CENTER);
        strokeWeight(5)
        stroke(255)
      
        let centerX = HW - (HERO.glows.length - 1) * 150;
        for (let i = 0; i < HERO.glows.length; i++) {
          let x = centerX + i * 300;
          let y = HH + cos(min(this.tick, 30) / 30 * PI / 2) * WH;
          fill(0)
          if (IsInner(mouseX, mouseY, x - 140, y - 200, 280, 400)) {
            fill(30)
          }
          rect(x, y, 280, 400, 50)
        }
      
        HID.drawGlowCursor();
      

        pop();
  
        this.input();
    }

    input() {
        let centerX = HW - (HERO.glows.length - 1) * 150;
        if (mouseIsPressed) {
            if (this.mouseReleased) {
                this.mouseReleased = false;
                if (mouseButton == LEFT) {
                    let isSelected = false;
                    for (let i = 0; i < HERO.glows.length; i++) {
                        let x = centerX + i * 300;
                        let y = HH + cos(min(this.tick, 30) / 30 * PI / 2) * WH;
                        if (IsInner(mouseX, mouseY, x - 140, y - 200, 280, 400)) {
                            isSelected = true;
                            HERO.addSkill(i);
                            this.callback();
                        }
                    }
              
                    if (!isSelected) {
                        this.callback();
                    }
                }
            }
        } else {
            this.mouseReleased = true;
        }
    }
}