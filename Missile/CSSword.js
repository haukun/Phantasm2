class CSSword extends BCMover {

    init(obj) {
        super.init(obj);
        this.l = 10;
        this.r = obj.r;
        this.acc = 0;
        this.first = true;
    }

    hit(t) {
        t.forceX += cos(this.r) * 5;
        t.forceY += sin(this.r) * 5;

        t.life -= 5;

        this.live = false;

        for (let i = 0; i < 10; i++) {
            EFFECTS.push(new CEHit({ x: t.x, y: t.y, r: this.r + PI + random(PI) - PI / 2, s: random(2) }))
        }
    }
    
    act() {
        if (this.first) {
            this.acc = 30;
        }
        this.acc += 0.1;
        let ax = cos(this.r) * this.acc;
        let ay = sin(this.r) * this.acc;
        let result = false;
        [this.x, this.y, result] = CanMove(this.x, this.y, ax, ay);

        if (this.first) {
            this.acc = 0;
            this.first = false;
        }

        if (result != MOVED) {
            this.live = false;
            for (let i = 0; i < 3; i++) {
                EFFECTS.push(new CEHit({ x: this.x, y: this.y, r: this.r + PI + random(PI) - PI / 2, s: random(1) + 0.5 }))
            }
        }
    }

    draw() {
        stroke(60, 100, 100, this.tick / 100 * 5);
        fill(60, 80, 80, this.tick / 100 * 5)
        translate(this.x * MAG.rate - HERO.x * MAG.rate + HW,
            this.y * MAG.rate - HERO.y * MAG.rate + HH
        )
        rotate(this.r);
        ellipse(0,
            0,
            40 * MAG.rate,
            5 * MAG.rate);
        ellipse(-10 * MAG.rate,
            0,
            5 * MAG.rate,
            10 * MAG.rate);
        }
}