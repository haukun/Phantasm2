class CEStar extends BCEffect {
    init(obj) {
        super.init(obj);
    }

    act() {
        if (this.tick > 10) {
            this.live = false;
        }
    }

    draw() {
        noFill();
        stroke(60, 30, 50, 0.5)
        fill(60, 30, 100, 0.5)

        let d = sin(this.tick / 10 * PI) * 10; 

        ellipse(0, 0,
            d / 5 * MAG.rate,
            d / 1 * MAG.rate);
        ellipse(0, 0,
            d / 1 * MAG.rate,
            d / 5 * MAG.rate);
    
    }
}