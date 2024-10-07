class CSceneMain extends BCSCene{

  constructor() {
    super();
    this.awake();
  }

  awake() {
    this.willWheelUp = false;
    this.willWheelDown = false;
    this.tabReleased = false;
    this.escapeReleased = false;
    this.mouseReleased = true;
    this.enterReleased = false;
    keyCode = 0;
  }

  act() {
    TICK++;
    this.input();
    background(0);
      
    MAG.calc()
    FRAME_RATE.calc()
      
    drawTile()
      
    push();
    SIGHT.clear()
    SIGHT.background(0, 200);
    SIGHT.erase()
    let sight_r = HW * MAG.rate * (0.5 + 1.5 * (min(HERO.fire, 50) / 50) ** 2);
    SIGHT.circle(HW, HH, sight_r)
      
    image(SIGHT, 0, 0)
    fill(0, 0.01)
    circle(HW, HH, sight_r);
    drawingContext.clip()
      
    this.drawMonster();
    this.drawMissile();
    this.drawChip();
    this.hitCheck();
      
    pop();
      
    drawHide()
    this.drawEffect();
    this.drawBuild();
    drawMinimap()
      
    HERO.act()
    HERO.draw()
      
    this.postmortem();
      
    this.drawDamage();
      
    HID.draw();
      
    dispatchMessage();
      
    DI.act()
  }

  input() {
    DI.INPUTS.shift = false;
    DI.INPUTS.space = false;
    DI.INPUTS.w = false;
    DI.INPUTS.a = false;
    DI.INPUTS.s = false;
    DI.INPUTS.d = false;
    DI.INPUTS.q = false;
    DI.INPUTS.e = false;
    DI.INPUTS.lclick = false;
    DI.INPUTS.rclick = false;
    DI.INPUTS.wheelu = false;
    DI.INPUTS.wheeld = false;
    DI.INPUTS.tab = false;
    DI.INPUTS.escape = false;
    if (mouseWheelDown) {
      DI.INPUTS.wheeld = true;
      MAG.zoomOut()
    }
    if (mouseWheelUp) {
      DI.INPUTS.wheelu = true;
      MAG.zoomIn()
    }
    
    if (mouseIsPressed) {
      if (this.mouseReleased) {
        this.mouseReleased = false;
        if (mouseButton == LEFT) {
          DI.INPUTS.lclick = true;
    
          COMMAND = COMMAND_NONE;
          if (HERO.elements.length == 3 && IsInner(mouseX, mouseY, 300, 825, 100, 50)) {
            MSG.send({ msg: MSG_GLOW })
          }
    
          if (IsInner(mouseX, mouseY, 600, 850, 40, 40)) {
            COMMAND = COMMAND_TUNNEL;
          } else if (IsInner(mouseX, mouseY, 650, 850, 40, 40)) {
            COMMAND = COMMAND_EXTRACTOR;
          }
        } else if (mouseButton == RIGHT) {
          DI.INPUTS.rclick = true;
    
          switch (COMMAND) {
            case COMMAND_NONE:
              break;
            case COMMAND_TUNNEL:
              let ox = HERO.x + (mouseX - WW / 2) / MAG.rate
              let oy = HERO.y + (mouseY - WH / 2) / MAG.rate
              let hx = floor(ox / TILE_PX)
              let hy = floor(oy / TILE_PX)
              let g = TM.get(hx, hy);
              if (g != undefined) {
                let cx = int(((ox % TILE_PX) + TILE_PX) % TILE_PX / CELL_PX)
                let cy = int(((oy % TILE_PX) + TILE_PX) % TILE_PX / CELL_PX)
                if (g.cells[cy][cx] == WALL) {
                  g.cells[cy][cx] = FLOOR
                  HERO.addHealth(-0.1);
                  for (let i = 0; i < 20; i++) {
                    EFFECTS.push(new CELine({
                      x: g.mx * TILE_PX + cx * CELL_PX + CELL_PX / 2,
                      y: g.my * TILE_PX + cy * CELL_PX + CELL_PX / 2,
                      r: random(TAU), s: random(3)
                    }))
                  }
                }
                g.redraw()
              }
              break;
            case COMMAND_EXTRACTOR:
              if (HERO.material >= 50) {
                let ox = HERO.x + (mouseX - WW / 2) / MAG.rate
                let oy = HERO.y + (mouseY - WH / 2) / MAG.rate
                let hx = floor(ox / TILE_PX)
                let hy = floor(oy / TILE_PX)
                let g = TM.get(hx, hy)
                if (g != undefined) {
                  let cx = int(((ox % TILE_PX) + TILE_PX) % TILE_PX / CELL_PX)
                  let cy = int(((oy % TILE_PX) + TILE_PX) % TILE_PX / CELL_PX)
                  if (g.cells[cy][cx] == FLOOR) {
                    g.cells[cy][cx] = FIRE_EXTRACT;
                    HERO.material -= 50;
                    BUILDS.push(new CBExtractor({
                      x: hx * TILE_PX + cx * CELL_PX + CELL_PX / 2,
                      y: hy * TILE_PX + cy * CELL_PX + CELL_PX / 2
                    }))
                    g.redraw()
                  }
                }
                COMMAND = COMMAND_NONE;
              }
              break;
    
          }
    
    
        }
      }
    } else {
      this.mouseReleased = true;
    }

    if (!keyIsPressed) {
      this.awake();
    }
    
    let tx = 0;
    let ty = 0;
    if (keyIsDown(SHIFT)) {
      DI.INPUTS.shift = true;
    }
    if (keyCode == ENTER) {
      if (this.enterReleased) {
        MSG.send({ msg: MSG_DEBUG_COMMAND });
      }
    } else {
      this.enterReleased = true;
    }
    if (keyIsDown(87)) {
      ty -= 1;
      DI.INPUTS.w = true;
    }
    if (keyIsDown(65)) {
      tx -= 1;
      DI.INPUTS.a = true;
    }
    if (keyIsDown(83)) {
      ty += 1;
      DI.INPUTS.s = true;
    }
    if (keyIsDown(68)) {
      tx += 1;
      DI.INPUTS.d = true;
    }
    if (keyIsDown(81)) {
      DI.INPUTS.q = true;
    }
    if (keyIsDown(69)) {
      DI.INPUTS.e = true;
    }
    if (keyIsDown(27)) {
      DI.INPUTS.escape = true;
    
      if (this.escapeReleased) {
        this.escapeReleased = false;
        MSG.send({ msg: MSG_PAUSE });
      }
    } else {
      this.escapeReleased = true;
    }
    if (keyIsDown(9)) {
      DI.INPUTS.tab = true;
          
      if (this.tabReleased) {
        HERO.equipNum++;
        this.tabReleased = false;
        if (HERO.equipNum > 2) {
          HERO.equipNum = 0;
        } else if (HERO.equipNum == 2) {
          if (HERO.equips.length < 3) {
            HERO.equipNum = 0;
          }
        } else if (HERO.equipNum == 1) {
          if (HERO.equips.length < 2) {
            HERO.equipNum = 0;
          }
        }
      }
    } else {
      this.tabReleased = true;
    }
    
    if (tx != 0 || ty != 0) {
      HERO.move(tx, ty);
    }
    
    if (keyIsDown(32)) {
      DI.INPUTS.space = true;
    
      switch (HERO.equips[HERO.equipNum]) {
        case CHero.PHANTASMAL_SWORD:
          if (HERO.cooltime == 0 && HERO.mana >= 10) {
            MISSILES.push(new CSSword({ x: HERO.x, y: HERO.y, r: HERO.r }))
            HERO.cooltime = 30;
            HERO.mana -= 7;
          }
          break;
        case CHero.FLARE:
          if (HERO.cooltime == 0 && HERO.mana >= 30) {
            MISSILES.push(new CSFlare({ x: HERO.x, y: HERO.y, r: HERO.r - PI / 18 * 4 }))
            MISSILES.push(new CSFlare({ x: HERO.x, y: HERO.y, r: HERO.r - PI / 18 * 2 }))
            MISSILES.push(new CSFlare({ x: HERO.x, y: HERO.y, r: HERO.r + PI / 12 * 0 }))
            MISSILES.push(new CSFlare({ x: HERO.x, y: HERO.y, r: HERO.r + PI / 18 * 2 }))
            MISSILES.push(new CSFlare({ x: HERO.x, y: HERO.y, r: HERO.r + PI / 18 * 4 }))
            HERO.cooltime = 60;
            HERO.mana -= 30;
          }
        
          break;
        case CHero.WIND_CUTTER:
          if (HERO.cooltime == 0 && HERO.mana >= 15) {
            MISSILES.push(new CSWindCutter({ x: HERO.x, y: HERO.y, r: HERO.r }))
            HERO.cooltime = 15;
            HERO.mana -= 10;
          }
        
          break;
      }
    }
  }

//--------------------------------------------------
//  drawDamage
//--------------------------------------------------
  drawDamage() {
    if (DAMAGE_EFFECT > 0) {
      background(0, 100, 80, DAMAGE_EFFECT / 20)
      DAMAGE_EFFECT--;
    }
  }
  
  
  //--------------------------------------------------
  //  postmortem
  //--------------------------------------------------
  postmortem() {
    MONSTERS = MONSTERS.filter(e => e.live);
    MISSILES = MISSILES.filter(e => e.live);
    EFFECTS = EFFECTS.filter(e => e.live);
    BUILDS = BUILDS.filter(e => e.live);
    CHIPS = CHIPS.filter(e => e.live);
  }
  
  //--------------------------------------------------
  //  drawMonster
  //--------------------------------------------------
  drawMonster(){
    MONSTERS.forEach(e => {
      e.doAct();
    });
    
    MONSTERS.forEach(e => {
      e.doDraw();
    });
  }
  
  //--------------------------------------------------
  //  drawMissile
  //--------------------------------------------------
  drawMissile(){
    MISSILES.forEach(e => {
      e.doAct();
    });
    
    MISSILES.forEach(e => {
      e.doDraw();
    });
  }
  
  //--------------------------------------------------
  //  drawChip
  //--------------------------------------------------
  drawChip(){
    CHIPS.forEach(e => {
      e.doAct();
    });
    
    CHIPS.forEach(e => {
      e.doDraw();
    });
  }
  
  //--------------------------------------------------
  //  drawBuild
  //--------------------------------------------------
  drawBuild(){
    BUILDS.forEach(e => {
      e.doAct();
    });
    
    BUILDS.forEach(e => {
      e.doDraw();
    });
  }
  
  //--------------------------------------------------
  //  drawEffect
  //--------------------------------------------------
  drawEffect() {
    push()
    rectMode(CENTER);
    blendMode(ADD);
    EFFECTS.forEach(e => {
      e.doAct();
    });
    
    EFFECTS.forEach(e => {
      e.doDraw();
    });
    pop()
  }

//--------------------------------------------------
//  hitCheck
//--------------------------------------------------
hitCheck() {
    MONSTERS.forEach(m => {
      MISSILES.forEach(s => {
        if (s.evil == false) {
          if (abs(m.getMx() - s.getMx()) < 1 && abs(m.getMy() - s.getMy()) < 1) {
            if (!m.memory.includes(s.id)) {
              if (dist(m.x, m.y, s.x, s.y) < m.l + s.l) {
                m.hits.push(s);
                s.hits.push(m);
                m.memory.push(s.id);
              }
            }
          }
        }
      })
    })
  
    MISSILES.forEach(c => {
      if (c.evil == true) {
        if (abs(HERO.getMx() - c.getMx()) < 1 && abs(HERO.getMy() - c.getMy()) < 1) {
          if (dist(HERO.x, HERO.y, c.x, c.y) < 10 + c.l) {
            c.hits.push(HERO);
          }
        }
      }
    })
  
    CHIPS.forEach(c => {
      if (abs(HERO.getMx() - c.getMx()) < 1 && abs(HERO.getMy() - c.getMy()) < 1) {
        if (dist(HERO.x, HERO.y, c.x, c.y) < 10 + c.l) {
          c.hits.push(HERO);
        }
      }
    })
  }
}