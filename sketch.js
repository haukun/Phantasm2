let WW,WH,HW,HH;   // WindowXXX, HalfXXX
let TILE_PX;       // 1タイルのピクセル幅
let CELL_COUNT;    // 1タイル内にあるセルの数
let CELL_PX;       // 1セルのピクセル幅

let TILES = [];
let HERO;
let MONSTERS = [];

let MAG;
let FRAME_RATE;

let MSG;;

let NOW_FLOOR;

let SIGHT;

//--------------------------------------------------
//  setup
//--------------------------------------------------
function setup() {
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

  NOW_FLOOR = 0;

  newGame();
  init();

  let MASK = createGraphics(WW * 8, WH * 8);
  MASK.background(0);
  MASK.fill(255)
  MASK.erase()
  MASK.circle(WW * 4, WH * 4, WW/2)
  
  SIGHT = createGraphics(WW * 8, WH * 8);
  SIGHT.colorMode(HSB)
  SIGHT.noStroke();
  SIGHT.background(0, 0.8)
  SIGHT = SIGHT.get();
  SIGHT.mask(MASK.get())
}

function newGame() {
  HERO.born();
}

function init() {
  NOW_FLOOR++;
  noiseSeed(NOW_FLOOR);
  TILES = [];

  HERO.init();

  for(let y = -4 - NOW_FLOOR * 2; y <= 4 + NOW_FLOOR * 2; y++){
    for(let x = -4 - NOW_FLOOR * 2; x <= 4 + NOW_FLOOR * 2; x++){
      TILES.push(new CTile(x,y));
    }
  }

  let g = GetTile(0,0);
  g.cells[0][0] = STAIR;
  g.redraw()

  for (let r = 0; r < TAU; r += PI / 12) {
    MONSTERS.push(new CMMouse(144 + cos(r)*150, 144 + sin(r)*150));
  }


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
}

//--------------------------------------------------
//  draw
//--------------------------------------------------
function draw() {
  input();
  background(0);
  
  MAG.calc()
  FRAME_RATE.calc()
  
  drawTile()

  push();
  //imageMode(CENTER)
  image(SIGHT, 0, 0, WW, WH,
    WW * 4 - HW / MAG.rate, WH * 4 - HH / MAG.rate, WW / MAG.rate, WH / MAG.rate)
  fill(0,0.01)
  circle(HW,HH,HW * MAG.rate);
  drawingContext.clip()
  
  drawMonster();
  pop();

  drawHide()
  drawMinimap()

  HERO.act()
  HERO.draw()
  
  dispatchMessage();

  drawDebugInfo()
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
    }
  }
}

//--------------------------------------------------
//  drawDebugInfo
//--------------------------------------------------
function drawDebugInfo(){
  push()
  stroke(0)
  fill(255)
  textSize(20)
  text(`Frame: ${FRAME_RATE.rate} MAX: ${FRAME_RATE.max} MIN:${FRAME_RATE.min}
`, 30, 30)
  text(`TILES  : ${TILES.length}`,30, 60)
  text(`MONS   : ${MONSTERS.length}`,30, 90)

  let hx = HERO.getMx();
  let hy = HERO.getMy();
  let cx = HERO.getCx();
  let cy = HERO.getCy();
  
  text(`POS:${NOW_FLOOR}F M(${hx},${hy}) C(${cx},${cy}) P(${HERO._x},${HERO._y}) D(${HERO.getDx()},${HERO.getDy()})`,
      30, 120);
  text(`MS:(${mouseX},${mouseY})`, 30, 150)
  text(`MAG:(${MAG.rate})`, 30, 180)
  pop()
}

//--------------------------------------------------
//  drawMap
//--------------------------------------------------
function drawMonster(){
  MONSTERS.forEach(e => {
    e.doAct();
  });
  
  MONSTERS.forEach(e => {
    e.doDraw();
  });
}

//--------------------------------------------------
//  drawMap
//--------------------------------------------------
function drawTile() {
  let vw = ceil(WW/MAG.rate / TILE_PX / 2) * 2
  let vh = ceil(WH/MAG.rate / TILE_PX / 2) * 2
  
  let hx = HERO.getMx();
  let hy = HERO.getMy();

  TILES.forEach(e => {
    e.look = false;
  });
  
  for(let y=-vh/2-1;y<vh/2 + 1;y++){
    for(let x=-vw/2-1;x<vw/2 + 1;x++){
      let g = TILES.find(e=>e.mx == hx + x && e.my == hy+y)
      if(g != undefined){        
        image(g.img,
              g.mx * TILE_PX * MAG.rate - HERO._x * MAG.rate + HW,
              g.my * TILE_PX * MAG.rate - HERO._y * MAG.rate + HH,
          int(TILE_PX * MAG.rate), int(TILE_PX * MAG.rate))
          g.look = true;
      }else{
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
  
  for(let y=-vh/2-1;y<vh/2 + 1;y++){
    for(let x=-vw/2-1;x<vw/2 + 1;x++){
      let g = TILES.find(e=>e.mx == hx + x && e.my == hy+y)
      if(g != undefined){        
        if(g.show<255){
          if(dist(hx,hy,g.mx,g.my)<2 || g.show>0){
            g.show+=3;
          }
          noStroke()
          fill(0,1 - g.show/255)
          rect( g.mx * TILE_PX * MAG.rate - HERO._x * MAG.rate + HW,
                g.my * TILE_PX * MAG.rate - HERO._y * MAG.rate + HH,
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
  rect(wx - 1,wy - 1,18*12 + 2,18*8 + 2)
  drawingContext.clip()
  
  for(let y=-vh/2-1;y<vh/2+1 ;y++){
    for(let x=-vw/2-1;x<vw/2+1 ;x++){
      let g = TILES.find(e=>e.mx == hx + x && e.my == hy+y)
      if(g != undefined){
        image(g.img,
              x*18 + wx + vw/2*18 - int(HERO.getDx()/16),
              y*18 + vh/2*18 + wy - int(HERO.getDy()/16),
             18, 18)
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
//  CanMove
//--------------------------------------------------
function CanMove(_x, _y, _tx, _ty) {
  let result = false;
  let rx = _x;
  let ry = _y;

  let mx = floor(rx / TILE_PX);
  let my = floor(_y / TILE_PX);
  let tmx = floor(_tx / TILE_PX);

  let cx = int(((_x % TILE_PX) + TILE_PX) % TILE_PX / CELL_PX)
  let cy = int(((_y % TILE_PX) + TILE_PX) % TILE_PX / CELL_PX)
  let tcx = int(((_tx % TILE_PX) + TILE_PX) % TILE_PX / CELL_PX)

  let g = GetTile(tmx, my);
  if (g != undefined && _x != _tx){
    if(g.cells[cy][tcx] < _CAN_WALK){
      rx = _tx;
      result = true;
    }else{
      rx = (mx * TILE_PX) + (_x < _tx ? ((cx + 1) * CELL_PX - 1) : ((cx) * CELL_PX + 1))
    }
  }

  mx = floor(rx / TILE_PX);
  cx = int(((rx % TILE_PX) + TILE_PX) % TILE_PX / CELL_PX)
  let tcy = int(((_ty % TILE_PX) + TILE_PX) % TILE_PX / CELL_PX)
  let tmy = floor(_ty / TILE_PX);
  g = GetTile(mx, tmy);
  if (g != undefined && _y != _ty){
    if(g.cells[tcy][cx] < _CAN_WALK){
      ry = _ty;
      result = true;
    }else{
      ry = (my * TILE_PX) + (_y < _ty ? ((cy + 1) * CELL_PX - 1) : ((cy) * CELL_PX + 1))
      result = false;
    }
  }

  return [rx, ry, result];
}
