const FAR = 10000; // noiseを座標+1と-1で同じ値が出ないようにするための値

const UNKNOWN = 0;
const FLOOR = 1;
const STAIR = 80;
const _CAN_WALK = 99;
const WALL = 100;
const FIRE = 200;
const WATER = 210;
const AIR = 220;
const EARTH = 230;
const FIRE_EXTRACT = 300;
const WATER_EXTRACT = 320;
const AIR_EXTRACT = 330;
const _EXTRACT = 340;
const LIMIT = 999;

const ROOM_NORMAL = 1;
const ROOM_WALL = 2;
const ROOM_FIRE = 10;
const ROOM_WATER = 11;
const ROOM_AIR = 12;
const ROOM_EARTH = 13;
const ROOM_STAIR = 80;
const ROOM_LIMIT = 99;

class CTileManager {
  constructor() {}

  init() {
    this.TILES = [];
    this.worldWidth = 0;
    this.worldHeight = 0;
  }

  create(_w, _h) {
    this.worldWidth = (_w + 4) * 2;
    this.worldHeight = (_h + 4) * 2;

    for (let y = 0; y <= this.worldHeight; y++) {
      this.TILES[y] = [];
      for (let x = 0; x <= this.worldWidth; x++) {
        this.TILES[y][x] = new CTile(
          x - this.worldWidth / 2,
          y - this.worldHeight / 2
        );
      }
    }
  }

  createRoomMap() {
    let maps = [];

    //  マップに-1を設定
    for (let y = 0; y <= this.worldHeight; y++) {
      maps[y] = [];
      for (let x = 0; x <= this.worldWidth; x++) {
        maps[y][x] = {};
        maps[y][x].type = -1;
      }
    }

    //  限界壁に0を設定
    for (let cy = 0; cy <= this.worldHeight; cy++) {
      maps[cy][0].type = 0;
      maps[cy][this.worldWidth].type = 0;
    }
    for (let cx = 0; cx <= this.worldWidth; cx++) {
      maps[0][cx].type = 0;
      maps[this.worldHeight][cx].type = 0;
    }

    //  中心を1に設定
    maps[this.worldHeight / 2][this.worldWidth / 2].type = 1;

    //中心から道を2本引き99を設定
    for (let j = 0; j < 2; j++) {
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
        maps[ty][tx].type = 99;
      }

      if (j == 1) {
        //  階段タイルに2を設定
        maps[ty][tx].type = 2;
      }
    }

    let roomNumber = 100;
    let isLoop = true;
    let offset = min(this.worldWidth, this.worldHeight);
    let loopGuard = 0;
    while (isLoop) {
      let tx = int(random(this.worldWidth - 1 - offset) + 1 + int(offset / 2));
      let ty = int(random(this.worldHeight - 1 - offset) + 1 + int(offset / 2));
      let gen = false;

      if (maps[ty][tx].type > 2) {
        for (let j = 0; j < 2; j++) {
          let jgen = false;
          let nx = tx;
          let ny = ty;

          for (let i = 0; i < (this.worldWidth + this.worldHeight) / 2; i++) {
            let direction = int(random(4));
            let sx = nx;
            let sy = ny;

            switch (direction) {
              case 0:
                sx++;
                break;
              case 1:
                sx--;
                break;
              case 2:
                sy++;
                break;
              case 3:
                sy--;
                break;
            }

            if (
              1 <= sx &&
              sx < this.worldWidth &&
              1 <= sy &&
              sy < this.worldHeight
            ) {
              if (maps[sy][sx].type == -1) {
                nx = sx;
                ny = sy;
                maps[ny][nx].type = roomNumber;
                if (jgen == false) {
                  maps[ny][nx].road = true;
                  maps[ny][nx].roadd = direction;
                }
                jgen = true;
              } else {
              }
            }
          }

          gen |= jgen;
        }
      }

      let remain = false;
      for (let y = 0; y <= this.worldHeight; y++) {
        for (let x = 0; x <= this.worldWidth; x++) {
          if (maps[y][x].type == -1) {
            remain = true;
          }
        }
      }

      if (remain && (offset > 0 || random(1) < 0.9)) {
        isLoop = true;
      } else {
        isLoop = false;
      }
      if (gen) {
        roomNumber++;
        offset = max(0, offset - 1);
      }
      if (loopGuard > 10) {
        loopGuard = 0;
        offset = max(0, offset - 1);
      }
      loopGuard++;
    }

    let remainElement = 8;
    while (remainElement > 0) {
      let tx = int(random(this.worldWidth - 1 - offset) + 1 + int(offset / 2));
      let ty = int(random(this.worldHeight - 1 - offset) + 1 + int(offset / 2));

      if (maps[ty][tx].type > 2) {
        maps[ty][tx].type = 10 + (remainElement % 4);
        remainElement--;
      }
    }

    //  マップの内容に基づきタイル情報を構築
    for (let y = 0; y <= this.worldHeight; y++) {
      for (let x = 0; x <= this.worldWidth; x++) {
        if (maps[y][x].type == 0) {
          this.TILES[y][x].room = ROOM_LIMIT;
        } else if (maps[y][x].type == 2) {
          let sx = int(random(6)) + 1;
          let sy = int(random(6)) + 1;
          this.TILES[y][x].room = ROOM_STAIR;
          this.TILES[y][x].stair = { x: sx, y: sy };
          this.TILES[y][x].cells[sy][sx] = STAIR;
        } else if (maps[y][x].type == 10) {
          let sx = int(random(6)) + 1;
          let sy = int(random(6)) + 1;
          this.TILES[y][x].room = ROOM_FIRE;
          this.TILES[y][x].fire = { x: sx, y: sy };
          this.TILES[y][x].cells[sy][sx] = FIRE;
        } else if (maps[y][x].type == 11) {
          let sx = int(random(6)) + 1;
          let sy = int(random(6)) + 1;
          this.TILES[y][x].room = ROOM_WATER;
          this.TILES[y][x].water = { x: sx, y: sy };
          this.TILES[y][x].cells[sy][sx] = WATER;
        } else if (maps[y][x].type == 12) {
          let sx = int(random(6)) + 1;
          let sy = int(random(6)) + 1;
          this.TILES[y][x].room = ROOM_AIR;
          this.TILES[y][x].air = { x: sx, y: sy };
          this.TILES[y][x].cells[sy][sx] = AIR;
        } else if (maps[y][x].type == 13) {
          let sx = int(random(6)) + 1;
          let sy = int(random(6)) + 1;
          this.TILES[y][x].room = ROOM_EARTH;
          this.TILES[y][x].earth = { x: sx, y: sy };
          this.TILES[y][x].cells[sy][sx] = EARTH;
        } else if (maps[y][x].type == -1) {
          this.TILES[y][x].room = ROOM_WALL;
          for (let cy = 0; cy < CELL_COUNT; cy++) {
            for (let cx = 0; cx < CELL_COUNT; cx++) {
              this.TILES[y][x].cells[cy][cx] = WALL;
            }
          }
        }

        //  タイルデバッグ情報
        //this.TILES[y][x]._dmap = maps[y][x];

        if (maps[y][x].type > 98) {
          this.TILES[y][x].room = ROOM_NORMAL;

          //  部屋が異なる場合は壁を生成
          if (
            maps[y - 1][x].type != maps[y][x].type &&
            maps[y - 1][x].type > 98
          ) {
            for (let cx = 0; cx < CELL_COUNT; cx++) {
              this.TILES[y][x].cells[0][cx] = WALL;
            }
          }
          if (
            maps[y + 1][x].type != maps[y][x].type &&
            maps[y + 1][x].type > 98
          ) {
            for (let cx = 0; cx < CELL_COUNT; cx++) {
              this.TILES[y][x].cells[7][cx] = WALL;
            }
          }
          if (
            maps[y][x - 1].type != maps[y][x].type &&
            maps[y][x - 1].type > 98
          ) {
            for (let cy = 0; cy < CELL_COUNT; cy++) {
              this.TILES[y][x].cells[cy][0] = WALL;
            }
          }
          if (
            maps[y][x + 1].type != maps[y][x].type &&
            maps[y][x + 1].type > 98
          ) {
            for (let cy = 0; cy < CELL_COUNT; cy++) {
              this.TILES[y][x].cells[cy][7] = WALL;
            }
          }

          if (maps[y][x].type > 98) {
            if (random(1) < 0.1) {
              let pc = int(random(3)) + 1;
              for (let pi = 0; pi < pc; pi++) {
                let pw = int(random(4)) + 1;
                let ph = int(random(4)) + 1;
                let px = int(random(4 - pw)) + 2;
                let py = int(random(4 - ph)) + 2;
                for (let wy = 0; wy < ph; wy++) {
                  for (let wx = 0; wx < pw; wx++) {
                    this.TILES[y][x].cells[wy + py][wx + px] = WALL;
                  }
                }
              }
            }
          }
        }
      }
    }

    for (let y = 0; y <= this.worldHeight; y++) {
      for (let x = 0; x <= this.worldWidth; x++) {
        let rWidth = int(random(2)) + 1;
        if (maps[y][x].road == true) {
          let ci = int(random(7 - rWidth)) + 1;
          switch (maps[y][x].roadd) {
            case 0:
              for (let j = 0; j < rWidth; j++) {
                this.TILES[y][x].cells[ci + j][0] = FLOOR;
                this.TILES[y][x - 1].cells[ci + j][7] = FLOOR;
              }
              break;
            case 1:
              for (let j = 0; j < rWidth; j++) {
                this.TILES[y][x].cells[ci + j][7] = FLOOR;
                this.TILES[y][x + 1].cells[ci + j][0] = FLOOR;
              }
              break;
            case 2:
              for (let j = 0; j < rWidth; j++) {
                this.TILES[y][x].cells[0][ci + j] = FLOOR;
                this.TILES[y - 1][x].cells[7][ci + j] = FLOOR;
              }
              break;
            case 3:
              for (let j = 0; j < rWidth; j++) {
                this.TILES[y][x].cells[7][ci + j] = FLOOR;
                this.TILES[y + 1][x].cells[0][ci + j] = FLOOR;
              }
              break;
          }
        } else {
          if (x > 0 && x < this.worldWidth && y > 0 && y < this.worldHeight) {
            if (maps[y][x].type > 98 && maps[y][x].road == false) {
              let tx = x;
              let ty = y;
              let direction = int(random(4));
              let ci = int(random(7 - rWidth)) + 1;
              switch (direction) {
                case 0:
                  if (
                    maps[y][x].type != maps[y][x + 1] &&
                    this.TILES[y][x].cells[ci][7] == WALL
                  ) {
                    for (let j = 0; j < rWidth; j++) {
                      this.TILES[y][x].cells[ci + j][7] = FLOOR;
                      this.TILES[y][x + 1].cells[ci + j][0] = FLOOR;
                    }
                  }
                  break;
                case 1:
                  if (
                    maps[y][x].type != maps[y][x - 1] &&
                    this.TILES[y][x].cells[ci][0] == WALL
                  ) {
                    for (let j = 0; j < rWidth; j++) {
                      this.TILES[y][x].cells[ci + j][0] = FLOOR;
                      this.TILES[y][x - 1].cells[ci + j][7] = FLOOR;
                    }
                  }
                  break;
                case 2:
                  if (
                    maps[y][x].type != maps[y + 1][x] &&
                    this.TILES[y][x].cells[7][ci] == WALL
                  ) {
                    for (let j = 0; j < rWidth; j++) {
                      this.TILES[y][x].cells[7][ci + j] = FLOOR;
                      this.TILES[y + 1][x].cells[0][ci + j] = FLOOR;
                    }
                  }
                  break;
                  break;
                case 3:
                  if (
                    maps[y][x].type != maps[y - 1][x] &&
                    this.TILES[y][x].cells[0][ci] == WALL
                  ) {
                    for (let j = 0; j < rWidth; j++) {
                      this.TILES[y][x].cells[0][ci + j] = FLOOR;
                      this.TILES[y - 1][x].cells[7][ci + j] = FLOOR;
                    }
                  }
                  break;
              }
            }
          }
        }
      }
    }

    for (let y = 0; y <= this.worldHeight; y++) {
      for (let x = 0; x <= this.worldWidth; x++) {
        //this.TILES[y][x].show = 255;
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
    for (let y = 0; y <= this.worldHeight; y++) {
      for (let x = 0; x <= this.worldWidth; x++) {
        this.TILES[y][x].look = false;
      }
    }
  }

  get(_mx, _my) {
    let tx = _mx + this.worldWidth / 2;
    let ty = _my + this.worldHeight / 2;

    if (tx < 0 || this.worldWidth < tx || ty < 0 || this.worldHeight < ty) {
      return undefined;
    }

    return this.TILES[ty][tx];
  }
}

function GetTile(_mx, _my) {
  return this.get(_mx, _my);
}

class CTile {
  constructor(_mx, _my) {
    this.img = createGraphics(TILE_PX, TILE_PX);
    this.img.colorMode(HSB);
    this.img.push();
    this.img.noStroke();

    let cells = [];
    let show = 0;
    let room = ROOM_NORMAL;

    for (let cy = 0; cy < CELL_COUNT; cy++) {
      cells[cy] = [];
      for (let cx = 0; cx < CELL_COUNT; cx++) {
        let type = UNKNOWN;

        if (
          _mx < -3 - NOW_FLOOR * 2 ||
          _mx > 3 + NOW_FLOOR * 2 ||
          _my < -3 - NOW_FLOOR * 2 ||
          _my > 3 + NOW_FLOOR * 2
        ) {
          type = LIMIT;
          show = 255;
          //room = ROOM_LIMIT;
        } else if (abs(abs(_mx) + abs(_my)) < 2) {
          type = FLOOR;
        }

        if (type == UNKNOWN) {
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

          if (abs(_mx) < 1 && abs(_my) < 1) {
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
  redraw() {
    //randomSeed(this.seed);
    this.img.push();
    this.img.noStroke();

    for (let cy = 0; cy < CELL_COUNT; cy++) {
      for (let cx = 0; cx < CELL_COUNT; cx++) {
        let offsetX = cx * CELL_PX;
        let offsetY = cy * CELL_PX;

        switch (this.cells[cy][cx]) {
          case UNKNOWN:
            break;
          case FLOOR:
            for (let oy = 0; oy < CELL_PX; oy += CELL_PX / 2) {
              for (let ox = 0; ox < CELL_PX; ox += CELL_PX / 2) {
                this.img.noStroke();
                let n1 =
                  (noise(this.mx, this.my, cx + cy * 9 + ox + oy * 99) * 20) %
                  10;
                let n2 =
                  (noise(this.mx, this.my, cx * 9 + cy + ox * 99 + oy) * 20) %
                  10;
                let border =
                  (cx < 1 && ox < 8) ||
                  (cx > 6 && ox > 8) ||
                  (cy < 1 && oy < 8) ||
                  (cy > 6 && oy > 8)
                    ? random(15)
                    : 0;

                let col = n1 + 230;
                let sat = 10;
                switch (this.room) {
                  case ROOM_FIRE:
                    col = 0;
                    sat = 30;
                    break;
                  case ROOM_WATER:
                    col = 240;
                    sat = 30;
                    break;
                  case ROOM_AIR:
                    col = 150;
                    sat = 30;
                    break;
                  case ROOM_EARTH:
                    col = 30;
                    sat = 30;
                    break;
                }
                this.img.fill(col, sat, n2 + 50 - border);
                this.img.square(offsetX + ox, offsetY + oy, CELL_PX / 2);
              }
            }
            break;
          case STAIR:
            for (let i = CELL_PX; i--; i > 0) {
              this.img.fill(240 - i * 7, 20 + i * 3, 90 - i * 2);
              this.img.circle(
                cx * CELL_PX + CELL_PX / 2,
                cy * CELL_PX + CELL_PX / 2,
                i
              );
            }
            break;
          case WALL:
            this.img.fill(60, 100, 5);
            this.img.square(cx * CELL_PX, cy * CELL_PX, CELL_PX);
            for (let i = 0; i < 20; i++) {
              this.img.fill(60, 100, 20, 0.1);
              this.img.square(
                cx * CELL_PX + random(CELL_PX - CELL_PX / 5),
                cy * CELL_PX + random(CELL_PX - CELL_PX / 5),
                CELL_PX / 5
              );
            }

            break;
          case LIMIT:
            this.img.fill(210, 50, 10);
            this.img.noStroke();
            this.img.square(cx * CELL_PX, cy * CELL_PX, CELL_PX);
            this.img.stroke(0);
            this.img.strokeWeight(2);
            for (let x = 0; x < CELL_PX; x += 12) {
              this.img.line(
                offsetX + x,
                offsetY + 0,
                offsetX + x + 12,
                offsetY + CELL_PX
              );
              this.img.line(
                offsetX + CELL_PX - x,
                offsetY + 0,
                offsetX + CELL_PX - x - 12,
                offsetY + CELL_PX
              );
            }
            break;
          case FIRE:
            this.img.fill(0, 0, 10);
            this.img.square(cx * CELL_PX, cy * CELL_PX, CELL_PX);

            for (let i = 1; i > 0; i -= 0.1) {
              this.img.fill(0, 100 * i, i == 1 ? 0 : 100 - 50 * i);
              this.img.beginShape();
              let f = true;
              for (let r = 0; r < TAU; r += PI / 6) {
                this.img.vertex(
                  cos(r - PI / 2) * i * (f ? CELL_PX / 2 : CELL_PX / 4) +
                    cx * CELL_PX +
                    CELL_PX / 2,
                  sin(r - PI / 2) * i * (f ? CELL_PX / 2 : CELL_PX / 4) +
                    cy * CELL_PX +
                    CELL_PX / 2
                );
                f = !f;
              }
              this.img.endShape();
            }
            break;
          case WATER:
            this.img.fill(0, 0, 10);
            this.img.square(cx * CELL_PX, cy * CELL_PX, CELL_PX);

            for (let i = 1; i > 0; i -= 0.1) {
              this.img.fill(240, 100 * i, i == 1 ? 0 : 100 - 50 * i);
              this.img.beginShape();
              let f = true;
              for (let r = 0; r < TAU; r += PI / 6) {
                this.img.vertex(
                  cos(r - PI / 2) * i * (f ? CELL_PX / 2 : CELL_PX / 4) +
                    cx * CELL_PX +
                    CELL_PX / 2,
                  sin(r - PI / 2) * i * (f ? CELL_PX / 2 : CELL_PX / 4) +
                    cy * CELL_PX +
                    CELL_PX / 2
                );
                f = !f;
              }
              this.img.endShape();
            }
            break;
          case AIR:
            this.img.fill(0, 0, 20);
            this.img.square(cx * CELL_PX, cy * CELL_PX, CELL_PX);

            for (let i = 1; i > 0; i -= 0.1) {
              this.img.fill(150, 100 * i, i == 1 ? 0 : 100 - 50 * i);
              this.img.beginShape();
              let f = true;
              for (let r = 0; r < TAU; r += PI / 6) {
                this.img.vertex(
                  cos(r - PI / 2) * i * (f ? CELL_PX / 2 : CELL_PX / 4) +
                    cx * CELL_PX +
                    CELL_PX / 2,
                  sin(r - PI / 2) * i * (f ? CELL_PX / 2 : CELL_PX / 4) +
                    cy * CELL_PX +
                    CELL_PX / 2
                );
                f = !f;
              }
              this.img.endShape();
            }
            break;
          case EARTH:
            this.img.fill(0, 0, 20);
            this.img.square(cx * CELL_PX, cy * CELL_PX, CELL_PX);

            for (let i = 1; i > 0; i -= 0.1) {
              this.img.fill(60, 100 * i, i == 1 ? 0 : 100 - 50 * i);
              this.img.beginShape();
              let f = true;
              for (let r = 0; r < TAU; r += PI / 6) {
                this.img.vertex(
                  cos(r - PI / 2) * i * (f ? CELL_PX / 2 : CELL_PX / 4) +
                    cx * CELL_PX +
                    CELL_PX / 2,
                  sin(r - PI / 2) * i * (f ? CELL_PX / 2 : CELL_PX / 4) +
                    cy * CELL_PX +
                    CELL_PX / 2
                );
                f = !f;
              }
              this.img.endShape();
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
    if (this._dmap) {
      this.img.textSize(32);
      this.img.fill(0);
      this.img.stroke(255);
      this.img.text(this._dmap.type, 50, 50);
      this.img.text(this._dmap.road, 50, 70);
      this.img.text(this._dmap.roadd, 50, 90);
    }

    this.img.pop();
  }
}
