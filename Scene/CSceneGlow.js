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
        push();
        image(this.backPicture, 0, 0);
        background(0, min(this.tick, 30) / 60);
        rectMode(CENTER);

      
        let centerX = HW - (HERO.glows.length - 1) * 150;
        for (let i = 0; i < HERO.glows.length; i++) {
            let x = centerX + i * 300;
            let y = HH + cos(min(this.tick, 30) / 30 * PI / 2) * WH;
            
            push()
            strokeWeight(5)
            stroke(255)
                fill(0)
            if (IsInner(mouseX, mouseY, x - 140, y - 200, 280, 400)) {
                fill(30)
            }
            rect(x, y, 280, 400, 50)
            pop();

            let func, exp;
            [func, exp] = HERO.getGlowInfo(HERO.glows[i]);
            push();
            translate(x, y - 100);
            push()
            func(1);
            pop()
            strokeWeight(1);
            stroke(0);
            fill(255);
            textAlign(CENTER);
            textSize(32)
            text(exp, 0, 100)
            pop();
        }
      
        push()
        HID.drawGlowCursor();
        pop();

  
        this.input();
        pop();
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