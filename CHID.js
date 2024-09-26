class CHID {

    constructor() {
        this.elementalBreakTick = 0;
    }

    //--------------------------------------------------
    //  drawHID
    //--------------------------------------------------
    draw() {
        push()
  
        push()
        if (COMMAND == COMMAND_TUNNEL) {
            strokeWeight(2);
            stroke(60, 90, 90)
            fill(64)
        } else {
            strokeWeight(1);
            stroke(255)
            fill(0)
        }
        square(600, 850, 40)
  
        stroke(255)
        for (let r = 0; r < TAU; r += PI / 4) {
            line(620 + cos(r) * 5, 870 + sin(r) * 5, 620 + cos(r) * 15, 870 + sin(r) * 15)
        }
  
        if (COMMAND == COMMAND_EXTRACTOR) {
            strokeWeight(2);
            stroke(60, 90, 90)
            fill(64)
        } else {
            strokeWeight(1);
            stroke(255)
            fill(0)
        }
        square(650, 850, 40)
  
        fill(255);
        rect(660, 855, 20, 30)
        stroke(0)
        line(660, 870, 680, 870)
        pop()
  
        textAlign(RIGHT);
  
        //  life
        let lifeRate = HERO.life / HERO.max_life;
        if (lifeRate < 0.2 && TICK % 20 < 10) {
            stroke(0, 100, 100);
        } else {
            stroke(120, 100, 100);
        }
        noFill()
        rect(19, 774, 202, 17);
        line(223, 791, 285, 791)
        noStroke();
  
        fill(120, 100, 50, .8);
        rect(20, 775, 200 * lifeRate, 15);
  
        noStroke()
        fill(255, 0.8)
        textSize(16)
        text(ceil(HERO.life), 255, 789)
        fill(255, 0.5)
        text("/", 260, 789)
        textSize(12)
        text(ceil(HERO.max_life), 280, 789)
  
        //  mana
        stroke(210, 70, 100);
        noFill()
        rect(19, 799, 202, 17);
        line(223, 816, 285, 816)
        noStroke();
  
        let manaRate = HERO.mana / HERO.max_mana;
        fill(210, 100, 70, .8);
        rect(20, 800, 200 * manaRate, 15);
  
        noStroke()
        fill(255, 0.8)
        textSize(16)
        text(ceil(HERO.mana), 255, 814)
        fill(255, 0.5)
        text("/", 260, 814)
        textSize(12)
        text(ceil(HERO.max_mana), 280, 814)

        //  health
        if (HERO.health == 0 && TICK % 40 < 20) {
            stroke(0, 100, 100);
        } else {   
            stroke(30, 70, 100);
        }
        noFill()
        rect(19, 824, 202, 17);
        line(223, 841, 285, 841)
        noStroke();
    
        let healthRate = HERO.health / HERO.max_health;
        fill(30, 100, 70, .8);
        rect(20, 825, 200 * healthRate, 15);
    
        noStroke()
        fill(255, 0.8)
        textSize(16)
        text(ceil(HERO.health), 255, 839)
        fill(255, 0.5)
        text("/", 260, 839)
        textSize(12)
        text(ceil(HERO.max_health), 280, 839)

        //  rune
        stroke(60, 70, 100);
        noFill()
        rect(19, 849, 202, 7);
        line(223, 856, 260, 856)
        noStroke();
  
        let runeRate = HERO.rune / HERO.max_rune;
        fill(60, 100, 50, .8);
        rect(20, 850, 200 * runeRate, 5);
  
        noStroke()
        fill(255, 0.7)
        textSize(12)
        text(ceil(HERO.rune), 255, 854)
  
        //  material
        stroke(30, 30, 100);
        noFill()
        rect(19, 864, 202, 7);
        line(223, 871, 260, 871)
        noStroke();
  
        let materialRate = HERO.material / HERO.max_material;
        fill(30, 30, 50, .8);
        rect(20, 865, 200 * materialRate, 5);
  
        noStroke()
        fill(255, 0.7)
        textSize(12)
        text(ceil(HERO.material), 255, 869)
  
        //  fire
        stroke(0, 100, 100);
        noFill()
        rect(1379, 814, 202, 12);
        line(1350, 826, 1379, 826)
        noStroke();
  
        let fireRate = HERO.fire / 100;
        fill(0, 70, 100, .8);
        rect(1380, 815, 200 * fireRate, 10);
  
        noStroke()
        fill(255, 0.7)
        textSize(12)
        text(ceil(HERO.fire), 1375, 824)
  
        //  water
        stroke(210, 100, 100);
        noFill()
        rect(1379, 829, 202, 12);
        line(1350, 840, 1379, 840)
        noStroke();
  
        let waterRate = HERO.water / 100;
        fill(210, 70, 100, .8);
        rect(1380, 830, 200 * waterRate, 10);
  
        noStroke()
        fill(255, 0.7)
        textSize(12)
        text(ceil(HERO.water), 1375, 839)
  
        //  air
        stroke(150, 100, 100);
        noFill()
        rect(1379, 844, 202, 12);
        line(1350, 855, 1379, 855)
        noStroke();
  
        let airRate = HERO.air / 100;
        fill(150, 70, 100, .8);
        rect(1380, 845, 200 * airRate, 10);
  
        noStroke()
        fill(255, 0.7)
        textSize(12)
        text(ceil(HERO.air), 1375, 854)
  
        //  earth
        stroke(60, 100, 100);
        noFill()
        rect(1379, 859, 202, 12);
        line(1350, 870, 1379, 870)
        noStroke();
  
        let earthRate = HERO.earth / 100;
        fill(60, 70, 100, .8);
        rect(1380, 860, 200 * earthRate, 10);
  
        noStroke()
        fill(255, 0.7)
        textSize(12)
        text(ceil(HERO.earth), 1375, 869)
  
        pop()

        // crystal ball
        push()
        rectMode(CENTER)
        stroke(255 , 0.5);
        let offsetX = (random(this.elementalBreakTick) - this.elementalBreakTick / 2) / 2;
        let offsetY = (random(this.elementalBreakTick) - this.elementalBreakTick / 2) / 2;
        fill(0);
        if (this.elementalBreakTick > 0) {
            this.elementalBreakTick--;
            fill(0, 100, random(100));
        }
        if (HERO.elements.length == 3) {
            fill(30 - abs(TICK % 60 - 30));
            if (IsInner(mouseX, mouseY, 300, 825, 100, 50)) {
                fill(50);
            }
        }
        rect(350 + offsetX, 850 + offsetY, 100, 50, 30);

        if (HERO.elements.length == 3) {
            noFill();
            stroke(255, 1 - (TICK % 60)/ 60)
            strokeWeight(2);
            rect(350, 850, 100 + (TICK % 60)/2, 50 + (TICK % 60)/2, 30 + (TICK % 60)/2);
        }

        switch (HERO.elements.length) {
            case 0:
                break;
            case 1:
                this.drawElement(350, 850, HERO.elements[0]);
                break;
            case 2:
                this.drawElement(335, 850, HERO.elements[0]);
                this.drawElement(365, 850, HERO.elements[1]);
                break;
            case 3:
                this.drawElement(320, 850, HERO.elements[0]);
                this.drawElement(350, 850, HERO.elements[1]);
                this.drawElement(380, 850, HERO.elements[2]);
                break;
        }
        pop()

        //  Equip
        push()

        fill(HERO.equipNum == 0 ? 20 : 0)
        strokeWeight(HERO.equipNum == 0 ? 2 : 1)
        stroke(255, HERO.equipNum == 0 ? 1 : 0.5);
        square(20, 720, 40)
        fill(HERO.equipNum == 1 ? 20 : 0)
        strokeWeight(HERO.equipNum == 1 ? 2 : 1)
        stroke(255, HERO.equipNum == 1 ? 1 : 0.5);
        square(70, 720, 40)
        fill(HERO.equipNum == 2 ? 20 : 0)
        strokeWeight(HERO.equipNum == 2 ? 2 : 1)
        stroke(255, HERO.equipNum == 2 ? 1 : 0.5);
        square(120, 720, 40)

        pop();

        for (let i = 0; i < HERO.equips.length; i++) {
            push()
            translate(40 + i * 50, 740);
            switch (HERO.equips[i]) {
                case CHero.PHANTASMAL_SWORD:
                CSSword.drawIcon();
                break;
                case CHero.WIND_CUTTER:
                CSWindCutter.drawIcon();
                break;
                case CHero.FLARE:
                CSFlare.drawIcon();
                break;
            }
            pop()

        }

        //  cursor
        push()
        if (lifeRate >= 1) {
            HERO.lifeHighlightTime++;
        } else {
            if (HERO.lifeHighlightTime > 0) {
                HERO.lifeHighlightTime = -20;
            } else if (HERO.lifeHighlightTime == 0) {
                //  nothing
            } else {
                HERO.lifeHighlightTime++;

            }
        }

        if (manaRate >= 1) {
            HERO.manaHighlightTime++;
        } else {
            if (HERO.manaHighlightTime > 0) {
                HERO.manaHighlightTime = -20;
            } else if (HERO.manaHighlightTime == 0) {
                //  nothing
            } else {
                HERO.manaHighlightTime++;

            }
        }
        
        noFill()
        strokeWeight(12)
        stroke(120, 100, 50, max (0.7 - (max(abs(HERO.lifeHighlightTime, 60))-60) / 240, 0.3));
        arc(mouseX - 4, mouseY, 200, 200, PI / 2, -PI / 2);

        strokeWeight(6)
        stroke(120, 60, 70, max(0.7 - (max(abs(HERO.lifeHighlightTime, 60))-60) / 240, 0.3));
        arc(mouseX - 4, mouseY, 200, 200, PI / 2, -PI / 2 - (PI * (1 - lifeRate)));


        strokeWeight(12)
        stroke(210, 100, 50, max (0.7 - abs(HERO.manaHighlightTime) / 30, 0.3));
        arc(mouseX + 4, mouseY, 200, 200, -PI / 2, PI / 2);

        strokeWeight(6)
        stroke(210, 60, 70, max(0.7 - abs(HERO.manaHighlightTime) / 30, 0.3));
        arc(mouseX + 4, mouseY, 200, 200, PI / 2 - (PI * ( manaRate)), PI / 2);

        strokeWeight(2);
        noFill();
        stroke(0, 0, 5);
        circle(mouseX, mouseY, 10);

        blendMode(ADD)
        stroke(255, 0.5)
        noFill()
        strokeWeight(5)
        circle(mouseX, mouseY, 10);
        strokeWeight(3)
        stroke(255, 0.3)
        line(mouseX + 10, mouseY, mouseX  + 14, mouseY); 
        line(mouseX - 10, mouseY, mouseX  - 14, mouseY); 
        line(mouseX, mouseY + 10, mouseX, mouseY + 14); 
        line(mouseX, mouseY - 10, mouseX, mouseY - 14); 
        strokeWeight(2)
        line(mouseX + 15, mouseY, mouseX  + 19, mouseY); 
        line(mouseX - 15, mouseY, mouseX  - 19, mouseY); 
        line(mouseX, mouseY + 15, mouseX, mouseY + 19); 
        line(mouseX, mouseY - 15, mouseX, mouseY - 19); 
        strokeWeight(1)
        line(mouseX + 20, mouseY, mouseX  + 24, mouseY); 
        line(mouseX - 20, mouseY, mouseX  - 24, mouseY); 
        line(mouseX, mouseY + 20, mouseX, mouseY + 24); 
        line(mouseX, mouseY - 20, mouseX, mouseY - 24); 
        pop();
    }

    drawGlowCursor() {
        push()
        strokeWeight(3);
        noFill();
        stroke(0, 0, 5);
        circle(mouseX, mouseY, 20);
      
        blendMode(ADD)
        stroke(255, 0.5)
        noFill()
        strokeWeight(5)
        circle(mouseX, mouseY, 20);
      
        noStroke();
        fill(255, 0.05);
        for (let i = 0; i < 10; i++) {
          circle(mouseX, mouseY, i * 10);
        }
        pop()
    }

    drawElement(x, y, element, index) {
        push();
        stroke(0)
        let hue;
        let bri;
        switch (element) {
            case CCElement.FIRE:
                hue = 0;
                bri = 50;
                break;
            case CCElement.WATER:
                hue = 240;
                bri = 50;
                break;
            case CCElement.AIR:
                hue = 150;
                bri = 30;
                break;
            case CCElement.EARTH:
                hue = 60;
                bri = 30;
                break;
        }
        translate(x, y);
        scale(sin(TICK/20), 1)
        rotate(PI / 4);

        fill(hue, 90, bri);
        square(0, 0, 20);

        stroke(hue, 50, bri);
        fill(hue, 30, 60);
        square(0, 0, 15);
        pop();
    }
  
}