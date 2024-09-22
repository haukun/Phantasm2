class BCCollidableObject extends BCObject {
  static nextId = 0;
  init(obj) {
    this.id = BCCollidableObject.nextId++;
    this.live = true;
    this.tick = 0;
    this.hits = [];
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
