class CCElement extends BCCollidableObject{

    static FIRE = 10;
    static WATER = 20;
    static AIR = 30;
    static EARTH = 40;
    static ELEMENTS = [CCElement.FIRE, CCElement.WATER, CCElement.AIR, CCElement.EARTH];

    init(obj) {
        super.init(obj);
        this.l = 10
        this.element =  obj.element == undefined ? CCElement.ELEMENTS[int(random(4))] : obj.element;
    }

    hit(t) {
        HERO.addElement(this.element);
        this.live = false;
        EFFECTS.push(new CERing({ x: this.x, y: this.y }));
    }

    act() {
        if (this.tick % 50 < 40 && this.tick % 8 == 0) {
            EFFECTS.push(new CEStar({
                x: this.x + random(40) - 20,
                y: this.y + random(40) - 20
            }));
        }
    }

    draw() {
        stroke(0)
        let hue;
        let bri;
        switch (this.element) {
            case CCElement.FIRE:
                hue = 0;
                bri = 50;
                break;
            case CCElement.WATER:
                hue = 240;
                bri = 50;
                break;
            case CCElement.AIR:
                hue = 150;
                bri = 30;
                break;
            case CCElement.EARTH:
                hue = 60;
                bri = 30;
                break;
        }
        scale(sin(this.tick/20), 1)
        rotate(PI / 4);

        fill(hue, 90, bri);
        square(0, 0, 20 * MAG.rate);

        stroke(hue, 50, bri);
        fill(hue, 30, 60);
        square(0, 0, 15 * MAG.rate);

    }
}