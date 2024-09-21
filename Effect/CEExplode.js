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
        circle(this.x * MAG.rate - HERO.x * MAG.rate + HW,
            this.y * MAG.rate - HERO.y * MAG.rate + HH,
            this.tick * 3 * MAG.rate);

    }
}