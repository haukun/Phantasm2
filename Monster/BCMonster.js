class BCMonster extends BCObject{
    static _nextId = 0;

    init(_x, _y) {
        // max is 9007199254740991. Probably not over :)
        this._id = BCMonster._nextId++;

        this._live = true;
        this._tick = 0;
    }

    doDraw() {
        let g = TILES.find(e => e.mx == this.getMx() && e.my == this.getMy());
        if (g != undefined && g.look) {
            push();
            this.draw();
            pop();
        }
    }

    doAct() {
        this._tick++;
        this.act();
    }
}