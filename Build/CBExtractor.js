class CBExtractor extends BCCollidableObject{
    static NON_ACTIVE = 0
    static ACTIVE = 10;
    static SUPPLY = 20;

    init(obj) {
        super.init(obj);
        this.l = 15
        this.life = 20;
        this.damageTick = 0;
        this.state = CBExtractor.NON_ACTIVE;
    }

    hit(t) {
        this.damageTick = 10;
    }

    act() {
        let g = GetTile(this.getMx(), this.getMy());

        if (g.fire == true ||
            g.water == true ||
            g.air == true ||
            g.earth == true
        ) {
            this.state = CBExtractor.ACTIVE;
        }

        if (HERO.getMx() == this.getMx() && HERO.getMy() == this.getMy()) {
            if (g.fire == true) {
                HERO.addFire(.5);
                this.state = CBExtractor.SUPPLY;
            }
            if (g.water == true) {
                HERO.addWater(.5);
                this.state = CBExtractor.SUPPLY;
            }
            if (g.air == true) {
                HERO.addAir(.5);
                this.state = CBExtractor.SUPPLY;
            }
            if (g.earth == true) {
                HERO.addEarth(.5);
                this.state = CBExtractor.SUPPLY;
            }
        }


        if (this.life <= 0) {
            this.live = false;
            EFFECTS.push(new CEExplode({x:this.x, y:this.y}))
            for (let i = 0; i < 20; i++) {
                EFFECTS.push(new CEHit({ x: this.x, y: this.y, r:random(TAU), s: random(3)}))
                EFFECTS.push(new CELine({ x: this.x, y: this.y, r:random(TAU), s: random(3)}))
            }
        }
    }
    draw() {
        stroke(0)
        strokeWeight(1 * MAG.rate)
        fill(255)

        if (this.damageTick > 0 && this.tick % 2 == 0) {
            this.damageTick--;
            fill(60, 90, 90);
        }

        if (this.state == CBExtractor.SUPPLY) {
            fill(this.tick * 5 % 360, 100 - this.tick % 5 * 10, this.tick % 10 * 10 + 50)
        }
        
        rect(this.x * MAG.rate - HERO.x * MAG.rate + HW,
            this.y * MAG.rate - HERO.y * MAG.rate + HH,
            20 * MAG.rate,
            30 * MAG.rate);
        line(this.x * MAG.rate - HERO.x * MAG.rate + HW,
            this.y * MAG.rate - HERO.y * MAG.rate + HH + 30 - this.tick % 30,
            this.x * MAG.rate - HERO.x * MAG.rate + HW + 20,
            this.y * MAG.rate - HERO.y * MAG.rate + HH + 30 - this.tick % 30);
    }
}