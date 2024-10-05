let WW,WH,HW,HH;   // WindowXXX, HalfXXX
let TILE_PX;       // 1タイルのピクセル幅
let CELL_COUNT;    // 1タイル内にあるセルの数
let CELL_PX;       // 1セルのピクセル幅

let TM; //  TileManager
let SM; //  SceneManager

let DI; //  DebugInfo

let HERO;
let MONSTERS = [];
let MISSILES = [];
let EFFECTS = [];
let BUILDS = [];
let CHIPS = [];

let MAG;
let FRAME_RATE;
let COMMAND;
const COMMAND_NONE = 0;
const COMMAND_TUNNEL = 1;
const COMMAND_EXTRACTOR = 10;

let HID = new CHID();

let DAMAGE_EFFECT = 0;

let MSG;

let NOW_FLOOR;

let SIGHT;
let TICK;

//--------------------------------------------------
//  setup
//--------------------------------------------------
function setup() {
  print("===== setup =====");
  noCursor();
  createCanvas(1600, 900);
  colorMode(HSB);
  WW = 1600;
  WH = 900;
  HW = WW / 2;
  HH = WH / 2;
  
  CELL_COUNT = 8;
  CELL_PX = 36;
  TILE_PX = CELL_PX * CELL_COUNT;

  MAG = new CMag();
  HERO = new CHero();
  FRAME_RATE = new CFramerate();  
  MSG = new CMessage();

  SM = new CSceneManager();
  TM = new CTileManager();

  DI = new CDebugInfo();

  NOW_FLOOR = 0;
  INPUTS = {};

  newGame();
  init();

  TICK = 0;

  SIGHT = createGraphics(WW, WH);  
  SIGHT.fill(255)
}

function newGame() {
  print("----- new game -----");

  HERO.born();
}

function init() {
  print("----- init -----");
  NOW_FLOOR++;
  noiseSeed(NOW_FLOOR);
  TM.init();
  MONSTERS = [];
  MISSILES = [];
  BUILDS = [];
  CHIPS = [];
  EFFECTS = [];

  HERO.init();

  TM.create(NOW_FLOOR * 2, NOW_FLOOR * 2);
  TM.createRoomMap();

  
  CHIPS.push(new CCElement({x: 50, y:10, element:CCElement.FIRE}));
  CHIPS.push(new CCElement({x: 90, y:10, element:CCElement.WATER}));
  CHIPS.push(new CCElement({x: 130, y:10, element:CCElement.AIR}));
  CHIPS.push(new CCElement({ x: 170, y: 10, element: CCElement.EARTH }));

  CHIPS.push(new CCElement({x: 50, y:50, element:CCElement.FIRE}));
  CHIPS.push(new CCElement({x: 90, y:50, element:CCElement.WATER}));
  CHIPS.push(new CCElement({x: 130, y:50, element:CCElement.AIR}));
  CHIPS.push(new CCElement({ x: 170, y: 50, element: CCElement.EARTH }));

  CHIPS.push(new CCElement({x: 50, y:90, element:CCElement.FIRE}));
  CHIPS.push(new CCElement({x: 90, y:90, element:CCElement.WATER}));
  CHIPS.push(new CCElement({x: 130, y:90, element:CCElement.AIR}));
  CHIPS.push(new CCElement({ x: 170, y: 90, element: CCElement.EARTH }));

  


  for (let y = 0; y < TM.worldHeight; y++) {
    for (let x = 0; x < TM.worldWidth; x++) {
      let e = TM.TILES[y][x];
      if (random(1) < 0.1) {
        for (let cy = 0; cy < CELL_COUNT; cy++) {
          for (let cx = 0; cx < CELL_COUNT; cx++) {
            if (e.cells[cy][cx] == FLOOR) {
              if (random(1) < 0.1) {
                let p = int(random(2));
                switch (p) {
                  case 0:
                    MONSTERS.push(new CMMouse({
                      x: e.mx * TILE_PX + cx * CELL_PX,
                      y: e.my * TILE_PX + cy * CELL_PX
                    }));
                    break;
                  case 1:
                    MONSTERS.push(new CMCannon({
                      x: e.mx * TILE_PX + cx * CELL_PX,
                      y: e.my * TILE_PX + cy * CELL_PX
                    }));
                    break;
                }
              }
            }
          }
        }
      }
    }
  }
  

  /*
  let g = TM.getRandomTile(ROOM_NORMAL);
  let tx = int(random(CELL_COUNT));
  let ty = int(random(CELL_COUNT));
  g.cells[ty][tx] = STAIR;
  g.room = ROOM_STAIR;
  g.stair = { x: tx, y: ty}
  g.redraw()

  let fire = TM.getRandomTile(ROOM_NORMAL);
  tx = int(random(CELL_COUNT));
  ty = int(random(CELL_COUNT));
  fire.fire = {x: tx, y: ty};
  fire.cells[ty][tx] = FIRE;
  fire.room = ROOM_FIRE;
  fire.redraw();

  let water = TM.getRandomTile(ROOM_NORMAL);
  tx = int(random(CELL_COUNT));
  ty = int(random(CELL_COUNT));
  water.water = {x: tx, y: ty};;
  water.cells[ty][tx] = WATER;
  fire.room = ROOM_WATER
  water.redraw();

  let air = TM.getRandomTile(ROOM_NORMAL);
  tx = int(random(CELL_COUNT));
  ty = int(random(CELL_COUNT));
  air.air = {x: tx, y: ty};;
  air.cells[ty][tx] = AIR;
  fire.room = ROOM_AIR;
  air.redraw();

  let earth = TM.getRandomTile(ROOM_NORMAL);
  tx = int(random(CELL_COUNT));
  ty = int(random(CELL_COUNT));
  earth.earth = {x: tx, y: ty};;
  earth.cells[ty][tx] = EARTH;
  fire.room = ROOM_EARTH;
  earth.redraw();
*/
  /*
  for (let r = 0; r < TAU; r += PI / 12) {
    MONSTERS.push(new CMMouse({ x: 144 + cos(r) * 150, y: 144 + sin(r) * 150 }));
  }*/


/*
  let sx = random(1)<.5?1:-1
  let sy = random(1)<.5?1:-1

  let ax = [0,-1,0,1,0];
  let ay = [-1,0,0,0,1];
  for(let i = 0;i < 5; i++){
    let g = GetTile(sx * 3 + ax[i], sy * 3 + ay[i]);
    if(g != undefined){
      g.show=255
    }
  }*/
  print("  --- init fin ---");
}

//--------------------------------------------------
//  draw
//--------------------------------------------------
function draw() {
  SM.act();
}


//--------------------------------------------------
//  dispatchMessage
//--------------------------------------------------
function dispatchMessage() {
  let isLoop = true;

  while (isLoop) {
    let msg = MSG.get();
    if (msg == undefined) {
      isLoop = false;
      continue;
    }

    switch (msg.msg) {
      case MSG_REACH_STAIR:
        init();
        break;
      case MSG_DAMAGED:
        DAMAGE_EFFECT = 10;
        break;
      case MSG_ELEMENTAL_BREAK:
        HID.elementalBreakTick = 60;
        break;
      case MSG_PAUSE:
        SM.pause();
        break;
      case MSG_GLOW:
        SM.glow();
        break;
      case MSG_DEBUG_COMMAND:
        SM.debugCommand();
        break;
    }
  }

  mouseWheelDown = false;
  mouseWheelUp = false;
}




//--------------------------------------------------
//  drawMap
//--------------------------------------------------
function drawTile() {
  let vw = ceil(WW/MAG.rate / TILE_PX / 2) * 2
  let vh = ceil(WH/MAG.rate / TILE_PX / 2) * 2
  
  let hx = HERO.getMx();
  let hy = HERO.getMy();

  TM.setUnLook();
  
  for(let y=-vh/2-1;y<vh/2 + 1;y++){
    for(let x=-vw/2-1;x<vw/2 + 1;x++){
      let g = TM.get(hx + x, hy + y);
      if(g != undefined){        
        image(g.img,
              g.mx * TILE_PX * MAG.rate - HERO.x * MAG.rate + HW,
              g.my * TILE_PX * MAG.rate - HERO.y * MAG.rate + HH,
          int(TILE_PX * MAG.rate), int(TILE_PX * MAG.rate))
          g.look = true;
      } else {
        //TILES.push(new CTile(hx + x, hy+y));
      }
    }
  }
}

//--------------------------------------------------
//  drawMap
//--------------------------------------------------
function drawHide() {
  let vw = ceil(WW/MAG.rate / TILE_PX / 2) * 2
  let vh = ceil(WH/MAG.rate / TILE_PX / 2) * 2
  
  let hx = HERO.getMx();
  let hy = HERO.getMy();
  
  let sight = HERO.fire >= 50 ? 3 : 2;

  for(let y=-vh/2-1;y<vh/2 + 1;y++){
    for(let x=-vw/2-1;x<vw/2 + 1;x++){
      let g = TM.get(hx + x, hy + y);
      if(g != undefined){        
        if(g.show<255){
          if(dist(hx,hy,g.mx,g.my)<sight || g.show>0){
            g.show+=3;
          }
          noStroke()
          fill(0,1 - g.show/255)
          rect( g.mx * TILE_PX * MAG.rate - HERO.x * MAG.rate + HW,
                g.my * TILE_PX * MAG.rate - HERO.y * MAG.rate + HH,
               int(TILE_PX * MAG.rate), int(TILE_PX * MAG.rate))
        }
      }else{
        //TILES.push(new CTile(hx + x, hy+y));
      }
    }
  }
}

//--------------------------------------------------
//  drawMinimap
//--------------------------------------------------
function drawMinimap(){
  let vw = 12
  let vh = 8
  
  let hx = HERO.getMx();
  let hy = HERO.getMy();
  
  let wx = WW - 18*12 - 18
  let wy = 18
  
  push()
  stroke(255)
  rect(wx - 2,wy - 2,18*12 + 4,18*8 + 4)
  stroke(0)
  fill(0)
  rect(wx - 1,wy - 1,18*12 + 2,18*8 + 2)
  drawingContext.clip()
  
  for(let y=-vh/2-1;y<vh/2+1 ;y++){
    for(let x=-vw/2-1;x<vw/2+1 ;x++){
      let g = TM.get(hx + x, hy + y);
      if(g != undefined){
        image(g.img,
              x*18 + wx + vw/2*18 - int(HERO.getDx()/16),
              y*18 + vh/2*18 + wy - int(HERO.getDy()/16),
          18, 18)
        
        if (g.show > 0) {
          if (g.stair) {
            strokeWeight(2);
            stroke(0, 0, 50 + int(frameCount / 30) % 2 * 30)
            fill(0, 0, 100 - int(frameCount / 30) % 2 * 30)
            square(x * 18 + wx + vw / 2 * 18 - int(HERO.getDx() / 16) + g.stair.x * 2,
              y * 18 + vh / 2 * 18 + wy - int(HERO.getDy() / 16) + g.stair.y * 2,
              6);
          }

          if (g.fire) {
            strokeWeight(2);
            stroke(0, 50 + int(frameCount / 30) % 2 * 30, 50)
            fill(0, 50 + int(frameCount / 30) % 2 * 30, 90)
            circle(x * 18 + wx + vw / 2 * 18 - int(HERO.getDx() / 16) + g.fire.x * 2,
              y * 18 + vh / 2 * 18 + wy - int(HERO.getDy() / 16) + g.fire.y * 2,
              6);
          }
          if (g.water) {
            strokeWeight(2);
            stroke(240, 50 + int(frameCount / 30) % 2 * 30, 50)
            fill(240, 50 + int(frameCount / 30) % 2 * 30, 90)
            circle(x * 18 + wx + vw / 2 * 18 - int(HERO.getDx() / 16) + g.water.x * 2,
              y * 18 + vh / 2 * 18 + wy - int(HERO.getDy() / 16) + g.water.y * 2,
              6);
          }
          if (g.air) {
            strokeWeight(2);
            stroke(150, 50 + int(frameCount / 30) % 2 * 30, 50)
            fill(150, 50 + int(frameCount / 30) % 2 * 30, 90)
            circle(x * 18 + wx + vw / 2 * 18 - int(HERO.getDx() / 16) + g.air.x * 2,
              y * 18 + vh / 2 * 18 + wy - int(HERO.getDy() / 16) + g.air.y * 2,
              6);
          }
          if (g.earth) {
            strokeWeight(2);
            stroke(30, 50 + int(frameCount / 30) % 2 * 30, 50)
            fill(30, 50 + int(frameCount / 30) % 2 * 30, 90)
            circle(x * 18 + wx + vw / 2 * 18 - int(HERO.getDx() / 16) + g.earth.x * 2,
              y * 18 + vh / 2 * 18 + wy - int(HERO.getDy() / 16) + g.earth.y * 2,
              6);
          }
        }
        if(g.show<255){
          noStroke()
          fill(0,1 - g.show/255)
          rect(x*18 + wx + vw/2*18 - int(HERO.getDx()/16),
               y*18 + vh/2*18 + wy - int(HERO.getDy()/16),
             18, 18)
        }
      }else{
        //TILES.push(new CTile(hx + x, hy+y));
      }
    }
  }
  
  noStroke()
  fill(int(frameCount/30)%2 * 255);
  circle(wx + vw/2*18 ,wy + vh/2*18,5)
  fill((int(frameCount/30)+1)%2 * 255);
  circle(wx + vw/2*18 ,wy + vh/2*18,3)
  pop();
  
}

//--------------------------------------------------
//  IsInner
//--------------------------------------------------
function IsInner(_x, _y, _tx, _ty, _tw, _th) {
  if (_tx < _x && _x < _tx + _tw &&
    _ty < _y && _y < _ty + _th) {
    return true;
  }
  return false;
}

//--------------------------------------------------
//  CanMove
//--------------------------------------------------
const MOVED = 2;
const HIT = 1;
const STOP = 0;
function CanMove(_x, _y, _ax, _ay) {
  let _tx = _x + _ax;
  let _ty = _y + _ay;

  let resultX = false;
  let resultY = false;
  let rx = _x;
  let ry = _y;

  let mx = floor(rx / TILE_PX);
  let my = floor(_y / TILE_PX);
  let tmx = floor(_tx / TILE_PX);

  let cx = int(((_x % TILE_PX) + TILE_PX) % TILE_PX / CELL_PX)
  let cy = int(((_y % TILE_PX) + TILE_PX) % TILE_PX / CELL_PX)
  let tcx = int(((_tx % TILE_PX) + TILE_PX) % TILE_PX / CELL_PX)

  let g = TM.get(tmx, my);
  if (g != undefined && _x != _tx){
    if(g.cells[cy][tcx] < _CAN_WALK){
      rx = _tx;
      resultX = true;
    }else{
      rx = (mx * TILE_PX) + (_x < _tx ? ((cx + 1) * CELL_PX - 1) : ((cx) * CELL_PX + 1))
    }
  }

  mx = floor(rx / TILE_PX);
  cx = int(((rx % TILE_PX) + TILE_PX) % TILE_PX / CELL_PX)
  let tcy = int(((_ty % TILE_PX) + TILE_PX) % TILE_PX / CELL_PX)
  let tmy = floor(_ty / TILE_PX);
  g = TM.get(mx, tmy);
  if (g != undefined && _y != _ty){
    if(g.cells[tcy][cx] < _CAN_WALK){
      ry = _ty;
      resultY = true;
    }else{
      ry = (my * TILE_PX) + (_y < _ty ? ((cy + 1) * CELL_PX - 1) : ((cy) * CELL_PX + 1))
    }
  }

  let result = STOP;
  if (resultX && resultY) {
    result = MOVED;
  } else if (resultX || resultY) {
    result = HIT;
  }

  return [rx, ry, result];
}


let mouseWheelDown = false;
let mouseWheelUp = false;
function mouseWheel(event) {
  if (event.delta > 0) {
    mouseWheelDown = true;
  } else if (event.delta < 0) {
    mouseWheelUp = true;
  }
}