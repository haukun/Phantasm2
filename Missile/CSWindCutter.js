class CSWindCutter extends BCCollidableObject {

    init(obj) {
        super.init(obj);
        this.l = 20;
        this.r = obj.r;
        this.evil = false;
        this.add = 5;
        this.first = true;
    }

    hit(t) {
        t.forceX += cos(this.r) * 5;
        t.forceY += sin(this.r) * 5;

        t.life -= 3;

        //this.live = false;

        for (let i = 0; i < 10; i++) {
            EFFECTS.push(new CEHit({ x: t.x, y: t.y, r: this.r + PI + random(PI) - PI / 2, s: random(2) }))
        }
    }
    
    act() {
        let ax = cos(this.r) * this.add;
        let ay = sin(this.r) * this.add;
        let result = false;
        [this.x, this.y, result] = CanMove(this.x, this.y, ax, ay);

        if (this.first) {
            this.add = 8;
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
        strokeWeight(5)
        stroke(150, 90, 90)
        fill(150, 60, 90);
        arc(0, 0, 60, 60, this.r - PI/6, this.r + PI/6 , CHORD);
    }
}