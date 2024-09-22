class CCMaterial extends BCCollidableObject{

    init(obj) {
        super.init(obj);
        this.l = 5
    }

    hit(t) {
        HERO.addMaterial(5);
        this.live = false;
        EFFECTS.push(new CERing({ x: this.x, y: this.y }));
    }

    act() {
        if (this.tick % 40 < 30 && this.tick % 10 == 0) {
            EFFECTS.push(new CEStar({
                x: this.x + random(30) - 15,
                y: this.y + random(30) - 15
            }));
        }
    }

    draw() {
        stroke(0)
        fill(30, 60 - abs(20 - (this.tick  % 40))*3, 60)
        beginShape()
        let f = 0;
        let angle = this.tick / 60;
        for (let r = 0; r < TAU; r += PI / 24) {
            let d = f++ % 8 < 4 ? 10 : 7
            vertex(cos(r + angle)* d * MAG.rate, sin(r + angle) * d * MAG.rate)
        }
        endShape()
        fill(0)
        circle(0,0,5 * MAG.rate)
    }
}