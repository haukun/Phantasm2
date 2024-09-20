class CHero extends BCObject{
  born() {
    this.life = 100;
    this.max_life = 100;
    this.mana = 100;
    this.max_mana = 100;
    this.fire = 100;
    this.water = 100;
    this.air = 100;
    this.earth = 100;
  }

  init(_x, _y) {
    this._x = TILE_PX / 2;
    this._y = TILE_PX / 2;
  }

  //--------------------------------------------------
  //  draw
  //--------------------------------------------------
  draw() {
    fill(255);

    let angle = atan2(mouseY - HH, mouseX - HW);

    arc(
      WW / 2,
      WH / 2,
      36 * MAG.rate,
      36 * MAG.rate,
      angle + 0.5,
      angle - 0.5,
      PIE
    );
  }

  act() {
    let g = GetTile(this.getMx(), this.getMy());
    switch (g.cells[this.getCx()][this.getCy()]) {
      case STAIR:
        MSG.send({ msg: MSG_REACH_STAIR });
        break;
    }
  }

  move(_x, _y){
    let speed = 2;

    if(keyIsDown(SHIFT)){
      speed *= 4;
    }

    let tx = HERO._x + _x * speed;
    let ty = HERO._y + _y * speed;
    [HERO._x, HERO._y] = CanMove(HERO._x, HERO._y, tx, ty);
  }
}
