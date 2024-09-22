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
            let g = TILES.find(e => e.mx == this.getMx() && e.my == this.getMy());
            if (g != undefined) {
                push();
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