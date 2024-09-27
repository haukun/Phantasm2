class CDebugInfo {
    constructor() {
        this.INPUTS = [];
    }

    act() {
        push()
  
        noFill();
        stroke(255);
        textSize(12)
        this.INPUTS.shift ? fill(255) : noFill();
        rect(10, 150, 20, 10);
        this.INPUTS.tab ? fill(255) : noFill();
        rect(11, 120, 15, 10);
        this.INPUTS.escape ? fill(255) : noFill();
        rect(11, 110, 15, 8);
    
        this.INPUTS.w ? fill(255) : noFill();
        rect(40, 120, 10, 10);
        this.INPUTS.a ? fill(255) : noFill();
        rect(30, 130, 10, 10);
        this.INPUTS.s ? fill(255) : noFill();
        rect(40, 130, 10, 10);
        this.INPUTS.d ? fill(255) : noFill();
        rect(50, 130, 10, 10);
        this.INPUTS.q ? fill(255) : noFill();
        rect(30, 120, 10, 10);
        this.INPUTS.e ? fill(255) : noFill();
        rect(50, 120, 10, 10);
        this.INPUTS.space ? fill(255) : noFill();
        rect(40, 160, 30, 10);
  
        this.INPUTS.wheelu ? fill(255) : noFill();
        rect(81, 120, 4, 4)
        this.INPUTS.wheeld ? fill(255) : noFill();
        rect(81, 124, 4, 4)
  
        this.INPUTS.lclick ? fill(255) : noFill();
        arc(80, 130, 10, 20, PI, PI / 2 * 3, PIE)
        this.INPUTS.rclick ? fill(255) : noFill();
        arc(85, 130, 10, 20, PI / 2 * 3, TAU, PIE)
        noFill()
        arc(83, 130, 16, 20, 0, PI, PIE)
  
        stroke(0)
        fill(255)
        textSize(12)
  
        let texts = [];
  
        texts.push(`Frame: ${FRAME_RATE.rate} MAX: ${FRAME_RATE.max} MIN:${FRAME_RATE.min}`)
        texts.push(`TILES  : ${TM.TILES.length}`);
        texts.push(`MONSTER: ${MONSTERS.length}`);
        texts.push(`MISSILE: ${MISSILES.length}`);
        texts.push(`BUILD  : ${BUILDS.length}`);
        texts.push(`CHIP   : ${CHIPS.length}`);
        texts.push(`EFFECT : ${EFFECTS.length}`);
  
        let hx = HERO.getMx();
        let hy = HERO.getMy();
        let cx = HERO.getCx();
        let cy = HERO.getCy();
    
        texts.push(`POS:${NOW_FLOOR}F M(${hx},${hy}) C(${cx},${cy}) P(${HERO.x},${HERO.y}) D(${HERO.getDx()},${HERO.getDy()})`);
        texts.push(`MS:(${mouseX},${mouseY})`)
        texts.push(`MAG:(${MAG.rate})`)
  
        for (let i = 0; i < texts.length; i++) {
            text(texts[i], 10, i * 20 + 200)
        }
        pop()
    }
}