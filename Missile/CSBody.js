class CSBody extends BCCollidableObject {

    init(obj) {
        super.init(obj);
        this.l = obj.l;
        this.evil = true;
        this.r = obj.r;
        this.power = obj.power;
    }

    hit(t) {
        HERO.hit(this.power);

        this.live = false;

        for (let i = 0; i < 10; i++) {
            EFFECTS.push(new CEHit({ x: t.x, y: t.y, r: this.r + PI + random(PI) - PI / 2, s: random(2) }))
        }
    }
    
    act() {
        if (this.tick > 1) {
            this.live = false;
        }
    }

    draw() {
    }
}