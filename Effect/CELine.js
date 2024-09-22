class CELine extends BCEffect {
    init(obj) {
        super.init(obj);
        this.r = obj.r;
        this.acc = obj.s;
        this.color = random(360);
        this.angle = random(TAU);
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
        stroke(this.color, 70, 100, this.acc);
        strokeWeight(3 * this.acc * MAG.rate);

        line(0,
            0,
            cos(this.r) * this.tick * MAG.rate,
            sin(this.r) * this.tick * MAG.rate);

    }
}