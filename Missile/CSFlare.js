class CSFlare extends BCCollidableObject {

    init(obj) {
        super.init(obj);
        this.l = 1;
        this.r = obj.r;
        this.evil = false;
        this.add = 20;
        this.first = true;
    }

    hit(t) {
        t.forceX += cos(this.r) * 5;
        t.forceY += sin(this.r) * 5;

        t.life -= 15;

        this.live = false;

        for (let i = 0; i < 10; i++) {
            EFFECTS.push(new CEHit({ x: t.x, y: t.y, r: this.r + PI + random(PI) - PI / 2, s: random(2) }))
        }
    }
    
    act() {
        let ax = cos(this.r) * this.add;
        let ay = sin(this.r) * this.add;
        let result = false;
        [this.x, this.y, result] = CanMove(this.x, this.y, ax, ay);

        this.add *= 0.98

        if (this.first) {
            this.add = 3;
            this.first = false;
        }

        if (result != MOVED) {
            this.live = false;
            for (let i = 0; i < 3; i++) {
                EFFECTS.push(new CEHit({ x: this.x, y: this.y, r: this.r + PI + random(PI) - PI / 2, s: random(1) + 0.5 }))
            }
        }

        this.l = sin(this.tick / 60 * PI) * 25;

        if (this.tick > 60) {
            this.live = false;
        }
    }

    draw() {
        fill(0, 90, 90);
        circle(0, 0, this.l);
        fill(20, 70, 90);
        circle(0, 0, this.l * 0.7);
        fill(40, 40, 90);
        circle(0, 0, this.l * 0.6);
    }
}