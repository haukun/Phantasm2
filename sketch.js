let WW,WH,HW,HH;   // WindowXXX, HalfXXX
let TILE_PX;       // 1タイルのピクセル幅
let CELL_COUNT;    // 1タイル内にあるセルの数
let CELL_PX;       // 1セルのピクセル幅

let TILES = [];
let HERO;
let MONSTERS = [];
let MISSILES = [];
let EFFECTS = [];

let MAG;
let FRAME_RATE;

let MSG;;

let NOW_FLOOR;

let SIGHT;
let INPUTS;
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
  INPUTS = {};

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


  TILES.forEach(e => {
    if (random(1) < 0.1) {
      for (let cy = 0; cy < CELL_COUNT; cy++) {
        for (let cx = 0; cx < CELL_COUNT; cx++) {
          if (e.cells[cy][cx] == FLOOR) {
            if (random(1) < 0.1) {
              MONSTERS.push(new CMMouse({
                x: e.mx * TILE_PX + cx * CELL_PX,
                y: e.my * TILE_PX + cy * CELL_PX
              }));
            }
          }
        }
      }
    }
  });

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
  image(SIGHT, 0, 0, WW, WH,
    WW * 4 - HW / MAG.rate, WH * 4 - HH / MAG.rate, WW / MAG.rate, WH / MAG.rate)
  fill(0,0.01)
  circle(HW,HH,HW * MAG.rate);
  drawingContext.clip()
  
  drawMonster();
  drawMissile();
  hitCheck();

  pop();

  drawHide()
  drawEffect();
  drawMinimap()

  HERO.act()
  HERO.draw()

  postmortem();
  
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
//  postmortem
//--------------------------------------------------
function postmortem() {
  MONSTERS = MONSTERS.filter(e => e.live);
  MISSILES = MISSILES.filter(e => e.live);
  EFFECTS = EFFECTS.filter(e => e.live);
}

//--------------------------------------------------
//  drawDebugInfo
//--------------------------------------------------
function drawDebugInfo(){
  push()

  noFill();
  stroke(255);
  textSize(12)
  INPUTS.shift ? fill(255) : noFill();
  rect(10, 150, 20, 10);
  INPUTS.w ? fill(255) : noFill();
  rect(40, 120, 10, 10);
  INPUTS.a ? fill(255) : noFill();
  rect(30, 130, 10, 10);
  INPUTS.s ? fill(255) : noFill();
  rect(40, 130, 10, 10);
  INPUTS.d ? fill(255) : noFill();
  rect(50, 130, 10, 10);
  INPUTS.space ? fill(255) : noFill();
  rect(40, 160, 30, 10);

  INPUTS.wheelu ? fill(255) : noFill();
  rect(81, 120, 4, 4)
  INPUTS.wheeld ? fill(255) : noFill();
  rect(81, 124, 4, 4)

  INPUTS.lclick ? fill(255) : noFill();
  arc(80, 130, 10, 20, PI , PI / 2 * 3, PIE)
  INPUTS.rclick ? fill(255) : noFill();
  arc(85, 130, 10, 20, PI / 2 * 3, TAU, PIE)
  noFill()
  arc(83, 130, 16, 20, 0, PI, PIE)

  stroke(0)
  fill(255)
  textSize(12)

  let texts = [];

  texts.push(`Frame: ${FRAME_RATE.rate} MAX: ${FRAME_RATE.max} MIN:${FRAME_RATE.min}`)
  texts.push(`TILES  : ${ TILES.length }`);
  texts.push(`MONSTER: ${MONSTERS.length}`);
  texts.push(`MISSILE: ${MISSILES.length}`);
  texts.push(`EFFECT : ${EFFECTS.length}`);

  let hx = HERO.getMx();
  let hy = HERO.getMy();
  let cx = HERO.getCx();
  let cy = HERO.getCy();
  
  texts.push(`POS:${NOW_FLOOR}F M(${hx},${hy}) C(${cx},${cy}) P(${HERO.x},${HERO.y}) D(${HERO.getDx()},${HERO.getDy()})`);
  texts.push(`MS:(${mouseX},${mouseY})`)
  texts.push(`MAG:(${MAG.rate})`)

  for (let i = 0; i < texts.length; i++) {
    text(texts[i], 10, i * 20 + 200)
  }
  pop()
}

//--------------------------------------------------
//  drawMonster
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
//  drawMissile
//--------------------------------------------------
function drawMissile(){
  MISSILES.forEach(e => {
    e.doAct();
  });
  
  MISSILES.forEach(e => {
    e.doDraw();
  });
}

//--------------------------------------------------
//  drawEffect
//--------------------------------------------------
function drawEffect() {
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
function hitCheck() {
  MONSTERS.forEach(m => {
    MISSILES.forEach(s => {
      if (abs(m.getMx() - s.getMx()) < 1 && abs(m.getMy() - s.getMy()) < 1) {
        if (dist(m.x, m.y, s.x, s.y) < m.l + s.l) {
          m.hits.push(s);
          s.hits.push(m);
        }
      }
    })
  })
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
              g.mx * TILE_PX * MAG.rate - HERO.x * MAG.rate + HW,
              g.my * TILE_PX * MAG.rate - HERO.y * MAG.rate + HH,
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

  let g = GetTile(tmx, my);
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
  g = GetTile(mx, tmy);
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
