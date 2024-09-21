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

    this.cooltime = 0;
  }

  init(obj) {
    this.x = TILE_PX / 2;
    this.y = TILE_PX / 2;
    this.r = 0;
  }

  //--------------------------------------------------
  //  draw
  //--------------------------------------------------
  draw() {
    fill(255);

    arc(
      WW / 2,
      WH / 2,
      36 * MAG.rate,
      36 * MAG.rate,
      this.r + 0.5,
      this.r - 0.5,
      PIE
    );
  }

  act() {
    if (this.cooltime > 0) {
      this.cooltime--;
    }

    this.r = atan2(mouseY - HH, mouseX - HW);


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

    [HERO.x, HERO.y] = CanMove(HERO.x, HERO.y, _x * speed, _y * speed);
  }
}
