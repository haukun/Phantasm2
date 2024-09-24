class BCCollidableObject extends BCObject {
  static nextId = 0;
  init(obj) {
    this.id = BCCollidableObject.nextId++;
    this.live = true;
    this.tick = 0;
    this.hits = [];
    this.memory = [];
    this.forceX = 0;
    this.forceY = 0;

    super.init(obj);
    this.r = obj.r;
  }

  doDraw() {    
    if (this.live) {
      let g = TILES.find((e) => e.mx == this.getMx() && e.my == this.getMy());
      if (g != undefined && g.look) {
        push();
        rectMode(CENTER);
        translate(this.x * MAG.rate - HERO.x * MAG.rate + HW,
          this.y * MAG.rate - HERO.y * MAG.rate + HH)
        this.draw();
        pop();
      }
    }
  }

  doAct() {
    this.tick++;

    let r;
    while ((r = this.hits.shift()) !== undefined) {
      this.hit(r);
    }

    this.act();
  }
}
