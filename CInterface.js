//  右クリック無効化
document.addEventListener('contextmenu',function(event){
  event.preventDefault();
});

document.addEventListener('keydown', function (event) {
  if (event.key == 'Tab') {
    event.preventDefault();
  }
});

let willWheelUp = false;
let willWheelDown = false;
let tabReleased = true;

function input() {
  INPUTS.shift = false;
  INPUTS.space = false;
  INPUTS.w = false;
  INPUTS.a = false;
  INPUTS.s = false;
  INPUTS.d = false;
  INPUTS.lclick = false;
  INPUTS.rclick = false;
  INPUTS.wheelu = false;
  INPUTS.wheeld = false;
  INPUTS.tab = false;

  if (willWheelDown) {
    willWheelDown = false;
    INPUTS.wheeld = true;
    MAG.zoomOut()
  }
  if (willWheelUp) {
    willWheelUp = false;
    INPUTS.wheelu = true;
    MAG.zoomIn()
  }

  if (mouseIsPressed) {
    if (mouseButton == LEFT) {
      INPUTS.lclick = true;

      COMMAND = COMMAND_NONE;
      if (mouseX > 600 && mouseX < 640 && mouseY > 850 && mouseY < 890) {
        COMMAND = COMMAND_TUNNEL;
      }else if (mouseX > 650 && mouseX < 690 && mouseY > 850 && mouseY < 890) {
        COMMAND = COMMAND_EXTRACTOR;
      }
    }else if (mouseButton == RIGHT) {
      INPUTS.rclick = true;

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

  //if (keyIsPressed) {

    let tx = 0;
    let ty = 0;
    if (keyIsDown(SHIFT)) {
      speed = 32
      INPUTS.shift = true;
    }
    if (keyIsDown(87)) {
      ty -= 1;
      INPUTS.w = true;
    }
    if (keyIsDown(65)) {
      tx -= 1;
      INPUTS.a = true;
    }
    if (keyIsDown(83)) {
      ty += 1;
      INPUTS.s = true;
    }
    if (keyIsDown(68)) {
      tx += 1;
      INPUTS.d = true;
    }
    if (keyIsDown(9)) {
      INPUTS.tab = true;
      
      if (tabReleased) {
        HERO.equipNum++;
        tabReleased = false;
        if (HERO.equipNum > 2) {
          HERO.equipNum = 0;
        } else if (HERO.equipNum == 2) {
          if (HERO.equips.length < 2) {
            HERO.equipNum = 0;
          }
        } else if (HERO.equipNum == 1) {
          if (HERO.equips.length < 1) {
            HERO.equipNum = 0;
          }
        }
      }
    } else {
      tabReleased = true;
    }

    if (tx != 0 || ty != 0) {
      HERO.move(tx, ty);
    }

    if (keyIsDown(32)) {
      INPUTS.space = true;

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
            MISSILES.push(new CSFlare({ x: HERO.x, y: HERO.y, r: HERO.r - PI/18 * 4 }))
            MISSILES.push(new CSFlare({ x: HERO.x, y: HERO.y, r: HERO.r - PI/18 * 2 }))
            MISSILES.push(new CSFlare({ x: HERO.x, y: HERO.y, r: HERO.r + PI/12 * 0}))
            MISSILES.push(new CSFlare({ x: HERO.x, y: HERO.y, r: HERO.r + PI/18 * 2 }))
            MISSILES.push(new CSFlare({ x: HERO.x, y: HERO.y, r: HERO.r + PI/18 * 4 }))
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
  //}
}


function mouseWheel(event){
  if (event.delta > 0) {
    willWheelDown = true;
  } else if (event.delta < 0) {
    willWheelUp = true;
  }
}
