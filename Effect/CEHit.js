class CEHit extends BCEffect {
    init(obj) {
        super.init(obj);
        this.r = obj.r;
        this.acc = obj.s;
        this.color = random(360);
        this.angle = random(TAU);
        this.direction = random(1) > 0.5 ? 1 : -1;
    }

    act() {
        this.x += cos(this.r) * this.acc;
        this.y += sin(this.r) * this.acc;
        this.acc *= .95
        this.angle += 0.1 * this.direction;
        if (this.acc < 0.1) {
            this.live = false;
        }
    }

    draw() {
        noFill();
        stroke(this.color, 70, 100, this.acc);
        strokeWeight(this.acc * MAG.rate);

        rotate(this.angle);
        square(0, 0, this.acc * 10 * MAG.rate);

        fill(255, this.acc / 10);
        noStroke();
        square(0, 0, this.acc * 20 * MAG.rate, this.acc * 10 * MAG.rate);
    }
}