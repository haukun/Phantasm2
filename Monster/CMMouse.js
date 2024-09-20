class CMMouse extends BCMonster{
    static INIT = 0;
    static WAIT = 10;
    static WATCH = 20;
    static WALK = 30;

    init(_x, _y) {
        super.init(_x, _y);
        this.r = random(TAU);
        this.state = CMMouse.INIT;
        this.intention = 0
        this.nextR = 0;
        this.nextTurn = false;
    }
    act() {
        switch (this.state) {
            case CMMouse.INIT:
                this.r = this.r % TAU;
                let turn = random(PI) - PI / 2;
                this.nextR = this.r + (turn * (this.nextTurn ? 2 : 1));
                this.intention = 100;
                this.state = CMMouse.WAIT;

                if (random(1) < 0.2) {
                    this.nextR = atan2(HERO._y - this._y, HERO._x- this._x);
                }
            break;
            case CMMouse.WAIT:
                if (random(1) < 0.05) {
                    this.state = CMMouse.WATCH;
                }
                break;
            case CMMouse.WATCH:
                this.r += (this.nextR - this.r) / 20;
                this.intention--;
                if (this.intention < 0) {
                    this.state = CMMouse.WALK;
                    this.intention = 50;
                }
                break;
            case CMMouse.WALK:
                let tx = this._x + cos(this.r);
                let ty = this._y + sin(this.r);
                let result;
                [this._x, this._y, result] = CanMove(this._x, this._y, tx, ty);
                if (!result || (this.intention-- < 0 && random(1) < 0.02)) {
                    this.state = CMMouse.INIT;
                    this.nextTurn = !result;
                }
                break;
        }
    }
    draw() {
        stroke(0)
        strokeWeight(1 * MAG.rate)
        fill(90, 90, 90)
        arc(this._x * MAG.rate - HERO._x * MAG.rate + HW,
            this._y * MAG.rate - HERO._y * MAG.rate + HH,
            30 * MAG.rate, 30 * MAG.rate,
            this.r + .5 * abs(sin(this._tick / 10)),
            this.r - .5 * abs(sin(this._tick / 10)),
            PIE);
    }
}