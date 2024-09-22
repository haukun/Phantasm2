class CHero extends BCObject{
  born() {
    this.life = 100;
    this.max_life = 100;
    this.mana = 100;
    this.max_mana = 100;
    this.mana_recover_acc = 1;
    this.fire = 100;
    this.water = 100;
    this.air = 100;
    this.earth = 100;
    this.material = 50;
    this.max_material = 100;
    this.rune = 100;
    this.max_rune = 100;

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
      this.mana_recover_acc = 1;
    }

    if (this.mana < this.max_mana) {
      this.mana += 0.1 * this.mana_recover_acc;
      this.mana_recover_acc += 0.01
    }
    if (this.mana >= this.max_mana) {
      this.mana = this.max_mana;
      this.mana_recover_acc = 1;
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

    let result;
    [HERO.x, HERO.y, result] = CanMove(HERO.x, HERO.y, _x * speed, _y * speed);
    if (result != STOP) {
      this.fire -= 0.01
      this.water -= 0.01
      this.air -= 0.01
      this.earth -= 0.01

      if (this.fire < 0) {
        this.fire = 0;
      }
      if (this.water < 0) {
        this.water = 0;
      }
      if (this.air < 0) {
        this.air = 0;
      }
      if (this.earth < 0) {
        this.earth = 0;
      }
    }
  }

  addFire(value) {
    this.fire += value;
    if (this.fire > 100) {
      this.fire = 100;
    } else if (this.fire < 0) {
      this.fire = 0;
    }
  }

  addWater(value) {
    this.water += value;
    if (this.water > 100) {
      this.water = 100;
    } else if (this.water < 0) {
      this.water = 0;
    }
  }

  addAir(value) {
    this.air += value;
    if (this.air > 100) {
      this.air = 100;
    } else if (this.air < 0) {
      this.air = 0;
    }
  }

  addEarth(value) {
    this.earth += value;
    if (this.earth > 100) {
      this.earth = 100;
    } else if (this.earth < 0) {
      this.earth = 0;
    }
  }
}
