class BCEffect extends BCObject{
    static nextId = 0;
    init(obj) {
        this.id = BCCollidableObject.nextId++;
        this.live = true;
        this.tick = 0;

        super.init(obj);
        this.r = obj.r;
    }

    doDraw() {
        if (this.live) {
            let g = TM.get(this.getMx(), this.getMy());
            if (g != undefined) {
                push();
                translate(this.x * MAG.rate - HERO.x * MAG.rate + HW,
                    this.y * MAG.rate - HERO.y * MAG.rate + HH)

                this.draw();
                pop();
            }
        }
    }

    doAct() {
        this.tick++;
        this.act();
    }
}