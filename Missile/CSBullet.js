class CSBullet extends BCCollidableObject {

    init(obj) {
        super.init(obj);
        this.l = 3;
        this.r = obj.r;
        this.evil = true;
        this.power = obj.power;

    }

    hit(t) {
        HERO.hit(this.power);

        this.live = false;
    }
    
    act() {
        this.acc += 0.1;
        let ax = cos(this.r) * 1;
        let ay = sin(this.r) * 1;
        let result = false;
        [this.x, this.y, result] = CanMove(this.x, this.y, ax, ay);

        if (result != MOVED) {
            this.live = false;
        }
    }

    draw() {
        strokeWeight(this.tick % 8 < 4 ? 4 : 2);
        stroke(30, 100, 50, this.tick / 100 * 5);
        fill(30, 80, 80, this.tick / 100 * 5)
        rotate(this.r);
        circle(0,
            0,
            10 * MAG.rate)
        }
}