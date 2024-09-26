class CHero extends BCObject{

  static PHANTASMAL_SWORD = 10;
  static WIND_CUTTER = 20;
  static FLARE = 30;

  static GLOW_EARTH = 1
  static GLOW_PHANTASMAL_SWORD = 2;
  static GLOW_RUNE_TELEPORT = 3
  static GLOW_FIRE = 101;
  static GLOW_FLARE = 102;
  static GLOW_RUNE_POWER_UP = 103;
  static GLOW_WATER = 201;
  static GLOW_RUNE_HEAL = 202;
  static GLOW_RUNE_ENERGY = 203;
  static GLOW_EFFICIENCY = 204;
  static GLOW_AIR = 301;
  static GLOW_WIND_CUTTER = 302;

  born() {
    this.life = 100;
    this.max_life = 100;
    this.mana = 100;
    this.max_mana = 100;
    this.mana_recover_acc = 1;
    this.fire = 50;
    this.water = 50;
    this.air = 50;
    this.earth = 50;
    this.material = 50;
    this.max_material = 100;
    this.rune = 100;
    this.max_rune = 100;
    this.health = 100;
    this.max_health = 100;
    this.elements = [];
    this.glows = [];

    this.skill_phantasmal_sword = 1;
    this.skill_wind_cutter = 0;
    this.skill_flare = 0;
    this.skill_rune_teleport = 0;
    this.skill_rune_heal = 0;
    this.skill_rune_power_up = 0;
    this.skill_rune_energy = 0;
    this.skill_earth = 0;
    this.skill_fire = 0;
    this.skill_water = 0;
    this.skill_air = 0;
    this.skill_efficiency = 0;

    this.cooltime = 0;

    this.lifeHighlightTime = 0;
    this.manaHighlightTime = 0;

    this.equips = [];
    this.equipNum = 0;
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
      this.mana_recover_acc = 1 + (min(this.water, 50) / 50) ** 2;
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


    let g = TM.get(this.getMx(), this.getMy());
    switch (g.cells[this.getCy()][this.getCx()]) {
      case STAIR:
        MSG.send({ msg: MSG_REACH_STAIR });
        break;
    }
  }

  move(_x, _y){
    let speed = 1.5 + (2 * min(HERO.air, 50) / 50);

    if(keyIsDown(SHIFT)){
      speed *= 4;
    }

    let result;
    [HERO.x, HERO.y, result] = CanMove(HERO.x, HERO.y, _x * speed, _y * speed);
    if (result != STOP) {
      this.fire -= 0.005
      this.water -= 0.005
      this.air -= 0.005
      this.earth -= 0.005

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

      this.health -= 0.002
      if (this.health < 0) {
        this.health = 0;
      }

      if (this.health == 0) {
        this.life -= 0.01
        if (TICK % 100 == 0) {
          MSG.send({ msg: MSG_DAMAGED });
        }
      } else {
        this.life += (min(this.water, 50) / 50) ** 2 / 30
        if (this.life >= this.max_life) {
          this.life = this.max_life;
        }
      }
    }
  }

  hit(damage) {
    this.life -= damage;
    MSG.send({ msg: MSG_DAMAGED });
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

  addMaterial(value) {
    this.material += value;
    if (this.material > 100) {
      this.material = 100;
    } else if (this.material < 0) {
      this.material = 0;
    }
  }

  addHealth(value) {
    this.health += value;
    if (this.health > 100) {
      this.health = 100;
    } else if (this.health < 0) {
      this.health = 0;
    }
  }

  addSkill(index) {
    switch (this.glows[index]) {
      case CHero.GLOW_WIND_CUTTER:
        this.skill_wind_cutter++;
        if (this.equips.length == 1) {
          this.equips[1] = CHero.WIND_CUTTER;
        }
        break;
    }

    HERO.max_life += 5;
    HERO.life += 5;
    HERO.max_mana += 5;
    HERO.mana += 5;
    HERO.elements = [];
  }

  addElement(element) {
    switch (this.elements.length) {
      case 0:
        this.elements.push(element);
        break;
      default:
        if (this.elements[0] != element) {
          this.elements = [];
          MSG.send({ msg: MSG_ELEMENTAL_BREAK });
        } else {
          if (this.elements.length < 3) {
            this.elements.push(element);
          }
          if (this.elements.length == 3) {
            this.glows = [];
            let candidates = []
            switch (this.elements[0]) {
              case CCElement.FIRE:
                //candidates.push(GLOW_FIRE);
                //candidates.push(GLOW_FLARE);
                //candidates.push(GLOW_RUNE_POWER_UP);
                break;
              case CCElement.WATER:
                //candidates.push(GLOW_WATER);
                //if (this.skill_rune_heal == 3) {
                //  candidates.push(GLOW_RUNE_HEAL);
               // }
                //candidates.push(GLOW_RUNE_ENERGY);
                //candidates.push(GLOW_EFFICIENCY);
                break;
              case CCElement.AIR:
                //candidates.push(GLOW_AIR);
                candidates.push(CHero.GLOW_WIND_CUTTER);
                break;
              case CCElement.EARTH:
                //candidates.push(GLOW_EARTH);
                //candidates.push(GLOW_PHANTASMAL_SWORD);
                //if (this.skill_rune_teleport <= 3) {
                //  candidates.push(GLOW_RUNE_TELEPORT);
               // }
                //break;
            }
            candidates.forEach(c => {
              this.glows.push(c);
            });
            print(this.glows.length);
          }
        }
        break;
    }
  }
}
