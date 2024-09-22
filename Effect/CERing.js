class CERing extends BCEffect {
    init(obj) {
        super.init(obj);
    }

    act() {
        if (this.tick > 20) {
            this.live = false;
        }
    }

    draw() {
        noFill();
        strokeWeight(5 * (1 - this.tick / 20) * MAG.rate);
        stroke(255, 0.8 - this.tick / 20);
        circle(0,
            0,
            this.tick * 10 * MAG.rate);

    }
}