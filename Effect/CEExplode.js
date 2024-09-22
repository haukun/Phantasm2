class CEExplode extends BCEffect {
    init(obj) {
        super.init(obj);
    }

    act() {
        if (this.tick > 50) {
            this.live = false;
        }
    }

    draw() {
        noStroke();
        fill(255, 0.4 - this.tick / 80);
        circle(0,
            0,
            this.tick * 3 * MAG.rate);

    }
}