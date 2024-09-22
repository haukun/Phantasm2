class CMMouse extends BCCollidableObject{
    static INIT = 0;
    static WAIT = 10;
    static WATCH = 20;
    static WALK = 30;
    static DAMAGE = 40;
    static CHARGE = 50;

    init(obj) {
        super.init(obj);
        this.l = 15
        this.r = random(TAU);
        this.state = CMMouse.INIT;
        this.intention = 0
        this.nextR = 0;
        this.nextTurn = false;
        this.life = 20;
        this.damageTick = 0;
        this.chewing = 0;
    }

    hit(t) {
        this.state = CMMouse.DAMAGE;
        this.damageTick = 10;
    }

    act() {
        this.chewing++;

        [this.x, this.y] = CanMove(this.x, this.y, this.forceX, this.forceY);
        this.forceX *= 0.9
        this.forceY *= 0.9
        if (abs(this.forceX) < 1) {
            this.forceX = 0;
        }
        if (abs(this.forceY) < 1) {
            this.forceY = 0;
        }

        switch (this.state) {
            case CMMouse.INIT:
                this.r = this.r % TAU;
                let turn = random(PI) - PI / 2;
                this.nextR = this.r + (turn * (this.nextTurn ? 2 : 1));
                this.intention = 100;
                this.state = CMMouse.WAIT;

                if (random(1) < 0.2) {
                    this.nextR = atan2(HERO.y - this.y, HERO.x- this.x);
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
                {
                    let tx = cos(this.r);
                    let ty = sin(this.r);
                    let result;
                    [this.x, this.y, result] = CanMove(this.x, this.y, tx, ty);
                    if (!result || (this.intention-- < 0 && random(1) < 0.02)) {
                        this.state = CMMouse.INIT;
                        this.nextTurn = !result;
                    }

                    if (this.tick % 20 == 0) {
                        MISSILES.push(new CSBody({ x: this.x, y: this.y, r: this.r, l: 15, power: 5 }))
                    }
            
                    if (random(1) < 0.01) {
                        this.state = CMMouse.CHARGE;
                    }
                }
                break;
            case CMMouse.CHARGE:
                {
                    this.chewing += 2;
                    let tx = cos(this.r) * 2;
                    let ty = sin(this.r) * 2;
                    let result;
                    [this.x, this.y, result] = CanMove(this.x, this.y, tx, ty);
                    if (!result || (this.intention-- < 0 && random(1) < 0.02)) {
                        this.state = CMMouse.INIT;
                        this.nextTurn = !result;
                    }

                    if (this.tick % 20 == 0) {
                        MISSILES.push(new CSBody({ x: this.x, y: this.y, r: this.r, l: 15, power: 5 }))
                    }
            
                    if (random(1) < 0.1) {
                        this.state = CMMouse.CHARGE;
                    }
                }
                    break;
            case CMMouse.DAMAGE:
                if (random(1) < 0.05) {
                    this.state = CMMouse.WATCH;
                    this.intention = 100;
                    this.nextR = atan2(HERO.y - this.y, HERO.x- this.x);
                }
                break;
        }

        if (this.life <= 0) {
            this.live = false;
            EFFECTS.push(new CEExplode({x:this.x, y:this.y}))
            for (let i = 0; i < 20; i++) {
                EFFECTS.push(new CEHit({ x: this.x, y: this.y, r:random(TAU), s: random(3)}))
                EFFECTS.push(new CELine({ x: this.x, y: this.y, r:random(TAU), s: random(3)}))
            }

            let rate = min(HERO.earth, 50) / 50
            if (random(1) < (0.2 + rate * 0.8)) {
                CHIPS.push(new CCMaterial({ x: this.x, y: this.y }))   
            }
        }
    }
    draw() {
        stroke(0)
        strokeWeight(1 * MAG.rate)
        fill(90, 90, 90)

        if (this.damageTick > 0 && this.tick % 2 == 0) {
            this.damageTick--;
            fill(0, 90, 90);
        }
        
        arc(0,
            0,
            30 * MAG.rate, 30 * MAG.rate,
            this.r + .5 * abs(sin(this.chewing / 10)),
            this.r - .5 * abs(sin(this.chewing / 10)),
            PIE);
    }
}