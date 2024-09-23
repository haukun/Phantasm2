class CMCannon extends BCCollidableObject{
    static INIT = 0;
    static ROTATE = 5;
    static WALK = 10;
    static SHOOT = 20;

    init(obj) {
        super.init(obj);
        this.l = 15
        this.r = random(TAU);
        this.state = CMMouse.INIT;
        this.intention = 0
        this.nextR = 0;
        this.nextTurn = false;
        this.life = 15;
        this.damageTick = 0;
        this.direction = random(1) > .5 ? 1 : -1
        this.breath = 0;
        this.shootDirection = 0;
    }

    hit(t) {
        this.state = CMMouse.INIT;
        this.damageTick = 10;
    }

    act() {
        [this.x, this.y] = CanMove(this.x, this.y, this.forceX, this.forceY);
        this.forceX *= 0.9
        this.forceY *= 0.9
        if (abs(this.forceX) < 1) {
            this.forceX = 0;
        }
        if (abs(this.forceY) < 1) {
            this.forceY = 0;
        }

        this.breath++;

        switch (this.state) {
            case CMCannon.INIT:
                this.state = CMCannon.WALK;
                this.r += random(PI / 8) - PI / 16;
                this.intention = 60;
                break;
            case CMCannon.ROTATE:
                this.state = CMCannon.WALK;
                this.r += random(PI / 8) - PI / 16;
                this.intention = 60;
                break;
            case CMCannon.WALK:
                this.intention--;

                let tx = cos(this.r) / 3;
                let ty = sin(this.r) / 3;
                let result;
                [this.x, this.y, result] = CanMove(this.x, this.y, tx, ty);
                if (result != MOVED) {
                    this.state = CMCannon.INIT;
                    this.r += PI;
                }

                if (random(1) < 0.01) {
                    if (dist(HERO.getMx(), HERO.getMy(), this.getMx(), this.getMy()) < 2) {
                        this.state = CMCannon.SHOOT;
                    }
                } else {
                    if (this.intention < 0) {
                        this.state = CMCannon.ROTATE;
                    }
                }

                break;
            case CMCannon.SHOOT:
                this.breath += 10;
                if (this.tick % 90 == 0) {
                    this.shootDirection++;
                    let rr = this.shootDirection * PI/4
                    for (let r = 0; r < TAU; r += PI / 2) {
                        MISSILES.push(new CSBullet({ x: this.x, y: this.y, r: this.r + r + rr, power: 5 }))
                    }
                    if (random(1) < 0.5) {
                        this.state = CMCannon.WALK;
                    }
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
            if (random(1) < (0.4 + rate * 0.6)) {
                if (random(1) < .5) {
                    CHIPS.push(new CCElement({ x: this.x, y: this.y }))
                } else {
                    CHIPS.push(new CCMaterial({ x: this.x, y: this.y }))
                }
            }
        }
    }
    draw() {
        stroke(0)
        strokeWeight(1 * MAG.rate)
        fill(40, 70, 90 + abs(10 - this.tick/2 % 20))

        if (this.damageTick > 0 && this.tick % 2 == 0) {
            this.damageTick--;
            fill(0, 90, 90);
        }
        
        let breath = sin(this.breath / 50) ** 3 * 2;
        rotate(this.tick / 100 * this.direction)
        square(0, 0 , (18 + breath) * MAG.rate)
        rotate(PI/4)
        square(0, 0, 18 * MAG.rate)
    }
}