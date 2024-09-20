const FAR = 10000;  // noiseを座標+1と-1で同じ値が出ないようにするための値

const UNKNOWN = 0
const FLOOR = 1
const STAIR = 80
const _CAN_WALK = 99
const WALL = 100
const LIMIT = 999

function GetTile(_mx, _my){
  return TILES.find(e=>e.mx == _mx && e.my == _my);
}

class CTile{
  constructor(_mx, _my){
    this.img = createGraphics(TILE_PX, TILE_PX);
    this.img.colorMode(HSB);
    this.img.push();
    this.img.noStroke()
    
    let cells = [];
    let show = 0;

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
        }
        else if(abs(abs(_mx) + abs(_my)) < 2){
          type = FLOOR;                  
        }
      
        if(type == UNKNOWN){
          type = FLOOR;
          
          let wall1 = noise((_mx*TILE_PX + cx*CELL_PX)/1000 + FAR,
                            (_my*TILE_PX + cy*CELL_PX)/1000 + FAR)
          let wall2 = noise((_mx*TILE_PX + cx*CELL_PX)/1000 + FAR,
                            (_my*TILE_PX + cy*CELL_PX)/1000 + FAR, 9)
          let wall3 = noise((_mx*TILE_PX + cx*CELL_PX)/1000 + FAR,
                            (_my*TILE_PX + cy*CELL_PX)/1000 + FAR, 19)

          if(wall1%.2 > .15 || wall2%.1 > .08 || wall3 > .5){
            type = WALL;
          }      
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

    this.redraw();
  }

  //--------------------------------------------------
  //  redraw
  //--------------------------------------------------
  redraw(){
    randomSeed(this.seed);
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
            this.img.fill(210,50,10);
            this.img.noStroke()
            this.img.square(cx * CELL_PX, cy * CELL_PX, CELL_PX)
            this.img.stroke(0);
            this.img.strokeWeight(2)
            for(let x = 0 ; x < CELL_PX; x += 12){
              this.img.line(offsetX + x, offsetY + 0,
                            offsetX + x + 12, offsetY + CELL_PX)
              this.img.line(offsetX + CELL_PX - x, offsetY + 0,
                            offsetX + CELL_PX - x - 12, offsetY + CELL_PX)
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