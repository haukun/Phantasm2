const FAR = 10000;  // noiseを座標+1と-1で同じ値が出ないようにするための値

const UNKNOWN = 0
const FLOOR = 1
const STAIR = 80
const _CAN_WALK = 99
const WALL = 100
const FIRE = 200
const WATER = 210
const AIR = 220
const EARTH = 230
const FIRE_EXTRACT = 300
const WATER_EXTRACT = 320
const AIR_EXTRACT = 330
const _EXTRACT = 340
const LIMIT = 999

const ROOM_NORMAL = 1;
const ROOM_FIRE = 10;
const ROOM_WATER = 11;
const ROOM_AIR = 12;
const ROOM_EARTH = 13;
const ROOM_STAIR = 80
const ROOM_LIMIT = 99;

class CTileManager {
  constructor() {
  }

  init() {
    this.TILES = [];
    this.worldWidth = 0;
    this.worldHeight = 0;
  }

  create(_w, _h) {
    this.worldWidth = (_w + 4) * 2;
    this.worldHeight = (_h + 4) * 2;

    for (let y = 0; y <= this.worldHeight; y++){
      this.TILES[y] = [];
      for(let x = 0; x <= this.worldWidth; x++){
        this.TILES[y][x] = new CTile(x - this.worldWidth  / 2, y - this.worldHeight / 2);
      }
    }
  }

  createRoomMap() {
    let maps = [];

    for (let y = 0; y <= this.worldHeight; y++) {
      maps[y] = [];
      for (let x = 0; x <= this.worldWidth; x++) {
        maps[y][x] = -1;
      }
    }

    for (let cy = 0; cy <= this.worldHeight; cy++) {
      maps[cy][0] = 0;
      maps[cy][this.worldWidth] = 0;
    }
    for (let cx = 0; cx <= this.worldWidth; cx++) {
      maps[0][cx] = 0;
      maps[this.worldHeight][cx] = 0;
    }

    maps[this.worldHeight / 2][this.worldWidth / 2] = 1;

    let tx = this.worldWidth / 2;
    let ty = this.worldHeight / 2;
    for (let i = 0; i < (this.worldWidth + this.worldHeight) / 2; i++) {
      let d = int(random(4));
      switch (d) {
        case 0:
          if (tx > 1) {
            tx -= 1;
          }
          break;
        case 1:
          if (tx < this.worldWidth - 1) {
            tx += 1;
          }
          break;
        case 2:
          if (ty > 1) {
            ty -= 1;
          }
          break;
        case 3:
          if (ty < this.worldHeight - 1) {
            ty += 1;
          }
          break;
      }
      maps[ty][tx] = 2;
    }
    
    maps[ty][tx] = 3;

    let roomNumber = 4;
    let isLoop = true;
    while (isLoop) {
      let tx = int(random(this.worldWidth - 1) + 1);
      let ty = int(random(this.worldHeight - 1) + 1);

      if (maps[ty][tx] == -1) {
        maps[ty][tx] = roomNumber++;
      }
      if (maps[ty][tx] > 3) {
        for (let j = 0; j < 2; j++) {
          let nx = tx;
          let ny = ty;

          for (let i = 0; i < 6; i++) {
            let direction = int(random(4));

            switch (direction) {
              case 0:
                nx++;
                break;
              case 1:
                nx--;
                break;
              case 2:
                ny++;
                break;
              case 3:
                ny--;
                break;
            }

            if (0 <= nx && nx <= this.worldWidth && 0 <= ny && ny <= this.worldHeight) {
              if (maps[ny][nx] == -1) {
                maps[ny][nx] = maps[ty][tx];
              }
            } else {
            }
          }
        }
      }
      
      let remain = false;
      for (let y = 0; y <= this.worldHeight; y++) {
        for (let x = 0; x <= this.worldWidth; x++) {
          if (maps[y][x] == -1) {
            remain = true;
          }
        }
      }

      if (remain) {
        isLoop = true;
      } else {
        isLoop = false;
      }
    }

    for (let y = 0; y <= this.worldHeight; y++) {
      for (let x = 0; x <= this.worldWidth; x++) {
        if (maps[y][x] == 0) {
          this.TILES[y][x].room = ROOM_LIMIT;
        } else if (maps[y][x] == 3) {
          let sx = int(random(6)) + 1;
          let sy = int(random(6)) + 1;
          this.TILES[y][x].room = ROOM_STAIR;
          this.TILES[y][x].stair = { x: sx, y: sy };
          this.TILES[y][x].cells[sy][sx] = STAIR;
        } else if (maps[y][x] > 4) {
          this.TILES[y][x].room = ROOM_NORMAL;
          if (maps[y - 1][x] != maps[y][x]) {
            for (let cx = 0; cx < CELL_COUNT; cx++) {
              this.TILES[y][x].cells[0][cx] = WALL;
            }
            if (1 < y && y < this.worldHeight && random(1) < 0.4) {
              let road = int(random(CELL_COUNT - 3) + 1);
              this.TILES[y][x].cells[0][road] = FLOOR;
              this.TILES[y][x].cells[0][road+1] = FLOOR;
              this.TILES[y - 1][x].cells[7][road] = FLOOR;
              this.TILES[y - 1][x].cells[7][road+1] = FLOOR;
            }
          }
          if (maps[y + 1][x] != maps[y][x]) {
            for (let cx = 0; cx < CELL_COUNT; cx++) {
              this.TILES[y][x].cells[7][cx] = WALL;
            }
          }
          if (maps[y][x - 1] != maps[y][x]) {
            for (let cy = 0; cy < CELL_COUNT; cy++) {
              this.TILES[y][x].cells[cy][0] = WALL;
            }
            if (1 < x && y < this.worldWidth && random(1) < 0.4) {
              let road = int(random(CELL_COUNT - 3) + 1);
              this.TILES[y][x].cells[road][0] = FLOOR;
              this.TILES[y][x].cells[road+1][0] = FLOOR;
              this.TILES[y][x - 1].cells[road][7] = FLOOR;
              this.TILES[y][x - 1].cells[road+1][7] = FLOOR;
            }
          }
          if (maps[y][x + 1] != maps[y][x]) {
            for (let cy = 0; cy < CELL_COUNT; cy++) {
              this.TILES[y][x].cells[cy][7] = WALL;
            }
          }
        }
      }
    }

    for (let y = 0; y <= this.worldHeight; y++) {
      for (let x = 0; x <= this.worldWidth; x++) {

        this.TILES[y][x].redraw();
      }
    }
}
  
  getRandomTile(_room) {
    let loop = true;
    while (loop) {
      let rx = int(random(this.worldWidth));
      let ry = int(random(this.worldHeight));
      if (this.TILES[ry][rx].room == _room) {
        loop = false;
        return this.TILES[ry][rx];
      }
    }
  }

  setUnLook() {
    for (let y = 0; y <= this.worldHeight; y++){
      for (let x = 0; x <= this.worldWidth; x++){
        this.TILES[y][x].look = false;
      }
    }
  }

  get(_mx, _my) {
    let tx = _mx + this.worldWidth / 2;
    let ty = _my + this.worldHeight / 2;

    if (tx < 0 || this.worldWidth < tx ||
      ty < 0 || this.worldHeight < ty) {
      return undefined;
    }
    
    return this.TILES[ty][tx];
  }
}


function GetTile(_mx, _my){
  return this.get(_mx, _my);
}

class CTile{
  constructor(_mx, _my){
    this.img = createGraphics(TILE_PX, TILE_PX);
    this.img.colorMode(HSB);
    this.img.push();
    this.img.noStroke()
    
    let cells = [];
    let show = 0;
    let room = ROOM_NORMAL;

    for(let cy = 0; cy < CELL_COUNT; cy++){
      cells[cy] = [];
      for(let cx = 0; cx < CELL_COUNT; cx++){
        let type = UNKNOWN;

        if (_mx < -3 - NOW_FLOOR * 2 ||
          _mx > 3 + NOW_FLOOR * 2 ||
          _my < -3 - NOW_FLOOR * 2 ||
          _my > 3 + NOW_FLOOR * 2) {
          type = LIMIT;    
          show = 255;
          //room = ROOM_LIMIT;
        }
        else if(abs(abs(_mx) + abs(_my)) < 2){
          type = FLOOR;                  
        }
      
        if(type == UNKNOWN){
          type = FLOOR;
          
          /*
          let wall1 = noise((_mx*TILE_PX + cx*CELL_PX)/1000 + FAR,
                            (_my*TILE_PX + cy*CELL_PX)/1000 + FAR)
          let wall2 = noise((_mx*TILE_PX + cx*CELL_PX)/1000 + FAR,
                            (_my*TILE_PX + cy*CELL_PX)/1000 + FAR, 9)
          let wall3 = noise((_mx*TILE_PX + cx*CELL_PX)/1000 + FAR,
                            (_my*TILE_PX + cy*CELL_PX)/1000 + FAR, 19)

          if(wall1%.2 > .18 || wall2%.1 > .085 || wall3 > 0.6){
            //type = WALL;
          }      
          */
          


          if(abs(_mx) < 1 && abs(_my)< 1 ){
            type = FLOOR;
          }
            
        }
        
        cells[cy][cx] = type;
      }
    }


    this.img.pop();
    
    this.show = show;
    this.seed = random(1000);
    this.cells = cells;
    this.mx = _mx;
    this.my = _my;
    this.room = room;
//    this.fire = false;
//    this.water = false;
//    this.air = false;
//    this.earth = false;

    this.redraw();
  }

  //--------------------------------------------------
  //  redraw
  //--------------------------------------------------
  redraw(){
    //randomSeed(this.seed);
    this.img.push();
    this.img.noStroke();

    for(let cy = 0; cy < CELL_COUNT; cy++){
      for(let cx = 0; cx < CELL_COUNT; cx++){
        let offsetX = cx * CELL_PX;
        let offsetY = cy * CELL_PX;

        switch (this.cells[cy][cx]) {
          case UNKNOWN:
            break;
          case FLOOR:
            for (let oy = 0; oy < CELL_PX; oy += CELL_PX / 2) {
              for (let ox = 0; ox < CELL_PX; ox += CELL_PX / 2) {
                this.img.noStroke()
                let n1 = noise(this.mx, this.my, cx + cy * 9 + ox + oy * 99) * 20 % 10
                let n2 = noise(this.mx, this.my, cx * 9 + cy + ox * 99 + oy) * 20 % 10
                let border = (cx < 1 && ox < 8 || cx > 6 && ox > 8) ||
                  (cy < 1 && oy < 8 || cy > 6 && oy > 8) ? random(15) : 0
                this.img.fill(n1 + 230, 10, n2 + 50 - border)
                this.img.square(offsetX + ox, offsetY + oy, CELL_PX / 2)
              }
            }
            break;
          case STAIR:
            for (let i = CELL_PX; i--; i > 0) {
              this.img.fill(240- i * 7, 20 + i * 3 , 90 - i * 2);
              this.img.circle(cx * CELL_PX + CELL_PX/2, cy * CELL_PX + CELL_PX/2, i)
            }
            break;
          case WALL:
            this.img.fill(60,100,10)
            this.img.square(cx * CELL_PX, cy * CELL_PX, CELL_PX)
            break;      
          case LIMIT:
            this.img.fill(210, 50, 10);
            this.img.noStroke()
            this.img.square(cx * CELL_PX, cy * CELL_PX, CELL_PX)
            this.img.stroke(0);
            this.img.strokeWeight(2)
            for (let x = 0; x < CELL_PX; x += 12) {
              this.img.line(offsetX + x, offsetY + 0,
                offsetX + x + 12, offsetY + CELL_PX)
              this.img.line(offsetX + CELL_PX - x, offsetY + 0,
                offsetX + CELL_PX - x - 12, offsetY + CELL_PX)
            }
            break;
          case FIRE:
            for (let i = 1; i > 0; i -= 0.1) {
              this.img.fill(0, 100 * i,  i == 1 ? 0 : 100 - 50 * i)
              this.img.beginShape();
              let f = true;
              for (let r = 0; r < TAU; r += PI / 6) {
                this.img.vertex(
                  cos(r - PI / 2) * i * (f ? CELL_PX / 2 : CELL_PX / 4) + cx * CELL_PX + CELL_PX / 2,
                  sin(r - PI / 2) * i * (f ? CELL_PX / 2 : CELL_PX / 4) + cy * CELL_PX + CELL_PX / 2
                )
                f = !f;
              }
              this.img.endShape()
            }
            break;
            case WATER:
              for (let i = 1; i > 0; i -= 0.1) {
                this.img.fill(240, 100 * i, i == 1 ? 0 : 100 - 50 * i)
                this.img.beginShape();
                let f = true;
                for (let r = 0; r < TAU; r += PI / 6) {
                  this.img.vertex(
                    cos(r - PI / 2) * i*(f ? CELL_PX / 2 : CELL_PX / 4) + cx * CELL_PX + CELL_PX / 2,
                    sin(r - PI / 2) * i*(f ? CELL_PX / 2 : CELL_PX / 4) + cy * CELL_PX + CELL_PX / 2
                  )
                  f = !f;
                }
                this.img.endShape()
              }
            break;
            case AIR:
              for (let i = 1; i > 0; i -= 0.1) {
                this.img.fill(150, 100 * i, i == 1 ? 0 : 100 - 50 * i)
                this.img.beginShape();
                let f = true;
                for (let r = 0; r < TAU; r += PI / 6) {
                  this.img.vertex(
                    cos(r - PI / 2) * i*(f ? CELL_PX / 2 : CELL_PX / 4) + cx * CELL_PX + CELL_PX / 2,
                    sin(r - PI / 2) * i*(f ? CELL_PX / 2 : CELL_PX / 4) + cy * CELL_PX + CELL_PX / 2
                  )
                  f = !f;
                }
                this.img.endShape()
              }
            break;
            case EARTH:
              for (let i = 1; i > 0; i -= 0.1) {
                this.img.fill(60, 100 * i, i == 1 ? 0 : 100 - 50 * i)
                this.img.beginShape();
                let f = true;
                for (let r = 0; r < TAU; r += PI / 6) {
                  this.img.vertex(
                    cos(r - PI / 2) * i*(f ? CELL_PX / 2 : CELL_PX / 4) + cx * CELL_PX + CELL_PX / 2,
                    sin(r - PI / 2) * i*(f ? CELL_PX / 2 : CELL_PX / 4) + cy * CELL_PX + CELL_PX / 2
                  )
                  f = !f;
                }
                this.img.endShape()
              }
            break;
        }
      }
    }

    //target.g.textSize(32)
    //target.g.fill(0)
    //target.g.stroke(255)
    //target.g.text(target.x + "," + target.y, 50,50)
    //target.g.noFill()
    //target.g.stroke(0)
    //target.g.rect(0,0,EDGE)
    this.img.pop()
  }
}