let WW,WH,HW,HH;   // WindowXXX, HalfXXX
let TILE_PX;       // 1タイルのピクセル幅
let CELL_COUNT;    // 1タイル内にあるセルの数
let CELL_PX;       // 1セルのピクセル幅

let TILES = [];
let HERO;
let MONSTERS = [];
let MISSILES = [];
let EFFECTS = [];
let BUILDS = [];

let MAG;
let FRAME_RATE;
let COMMAND;
const COMMAND_NONE = 0;
const COMMAND_TUNNEL = 1;
const COMMAND_EXTRACTOR = 10;

let MSG;;

let NOW_FLOOR;

let SIGHT;
let INPUTS;
//--------------------------------------------------
//  setup
//--------------------------------------------------
function setup() {
  print("===== setup =====");
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
  print("----- new game -----");

  HERO.born();
}

function init() {
  print("----- init -----");
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

  let normalRooms = TILES.filter(e => e.room == ROOM_NORMAL);

  let fire = normalRooms[floor(random(normalRooms.length))];
  fire.fire = true;
  fire.cells[int(random(CELL_COUNT))][int(random(CELL_COUNT))] = FIRE;
  fire.redraw();

  let water = normalRooms[floor(random(normalRooms.length))];
  water.water = true;
  water.cells[int(random(CELL_COUNT))][int(random(CELL_COUNT))] = WATER;
  water.redraw();

  let air = normalRooms[floor(random(normalRooms.length))];
  air.air = true;
  air.cells[int(random(CELL_COUNT))][int(random(CELL_COUNT))] = AIR;
  air.redraw();

  let earth = normalRooms[floor(random(normalRooms.length))];
  earth.earth = true;
  earth.cells[int(random(CELL_COUNT))][int(random(CELL_COUNT))] = EARTH;
  earth.redraw();

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
  drawBuild();
  drawMinimap()

  HERO.act()
  HERO.draw()

  postmortem();

  drawHID();
  
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
//  drawHID
//--------------------------------------------------
function drawHID() {
  push()

  push()
  if (COMMAND == COMMAND_TUNNEL) {
    strokeWeight(2);
    stroke(60, 90, 90)
    fill(64)
  } else {
    strokeWeight(1);
    stroke(255)
    fill(0)
  }
  square(600, 850, 40)

  stroke(255)
  for (let r = 0; r < TAU; r += PI / 4) {
    line(620 + cos(r) * 5, 870 + sin(r) * 5, 620 + cos(r) * 15, 870 + sin(r) * 15)
  }

  if (COMMAND == COMMAND_EXTRACTOR) {
    strokeWeight(2);
    stroke(60, 90, 90)
    fill(64)
  } else {
    strokeWeight(1);
    stroke(255)
    fill(0)
  }
  square(650, 850, 40)

  fill(255);
  rect(660, 855, 20, 30)
  stroke(0)
  line(660, 870, 680, 870)
  pop()

  textAlign(RIGHT);

  //  life
  stroke(120, 100, 100);
  noFill()
  rect(19, 799, 202, 17);
  line(223, 816, 285, 816)
  noStroke();

  let lifeRate = HERO.life / HERO.max_life;
  fill(120, 100, 50, .8);
  rect(20, 800, 200 * lifeRate, 15);

  noStroke()
  fill(255, 0.8)
  textSize(16)
  text(ceil(HERO.life), 255, 814)
  fill(255, 0.5)
  text("/", 260, 814)
  textSize(12)
  text(ceil(HERO.max_life), 280, 814)

  //  mana
  stroke(210, 70, 100);
  noFill()
  rect(19, 824, 202, 17);
  line(223, 841, 285, 841)
  noStroke();

  let manaRate = HERO.mana / HERO.max_mana;
  fill(210, 100, 70, .8);
  rect(20, 825, 200 * manaRate, 15);

  noStroke()
  fill(255, 0.8)
  textSize(16)
  text(ceil(HERO.mana), 255, 839)
  fill(255, 0.5)
  text("/", 260, 839)
  textSize(12)
  text(ceil(HERO.max_mana), 280, 839)

  //  rune
  stroke(60, 70, 100);
  noFill()
  rect(19, 849, 202, 7);
  line(223, 856, 260, 856)
  noStroke();

  let runeRate = HERO.rune / HERO.max_rune;
  fill(60, 100, 50, .8);
  rect(20, 850, 200 * runeRate, 5);

  noStroke()
  fill(255, 0.6)
  textSize(12)
  text(ceil(HERO.rune), 255, 854)

  //  material
  stroke(30, 30, 100);
  noFill()
  rect(19, 864, 202, 7);
  line(223, 871, 260, 871)
  noStroke();

  let materialRate = HERO.material / HERO.max_material;
  fill(30, 30, 50, .8);
  rect(20, 865, 200 * materialRate, 5);

  noStroke()
  fill(255, 0.6)
  textSize(12)
  text(ceil(HERO.material), 255, 869)

  //  fire
  stroke(0, 100, 100);
  noFill()
  rect(1379, 814, 202, 12);
  line(1350, 826, 1379, 826)
  noStroke();

  let fireRate = HERO.fire / 100;
  fill(0, 70, 100, .8);
  rect(1380, 815, 200 * fireRate, 10);

  noStroke()
  fill(255, 0.5)
  textSize(12)
  text(ceil(HERO.fire), 1375, 824)

  //  water
  stroke(210, 100, 100);
  noFill()
  rect(1379, 829, 202, 12);
  line(1350, 840, 1379, 840)
  noStroke();

  let waterRate = HERO.water / 100;
  fill(210, 70, 100, .8);
  rect(1380, 830, 200 * waterRate, 10);

  noStroke()
  fill(255, 0.5)
  textSize(12)
  text(ceil(HERO.water), 1375, 839)

  //  air
  stroke(150, 100, 100);
  noFill()
  rect(1379, 844, 202, 12);
  line(1350, 855, 1379, 855)
  noStroke();

  let airRate = HERO.air / 100;
  fill(150, 70, 100, .8);
  rect(1380, 845, 200 * airRate, 10);

  noStroke()
  fill(255, 0.5)
  textSize(12)
  text(ceil(HERO.air), 1375, 854)

  //  earth
  stroke(60, 100, 100);
  noFill()
  rect(1379, 859, 202, 12);
  line(1350, 870, 1379, 870)
  noStroke();

  let earthRate = HERO.earth / 100;
  fill(60, 70, 100, .8);
  rect(1380, 860, 200 * earthRate, 10);

  noStroke()
  fill(255, 0.5)
  textSize(12)
  text(ceil(HERO.earth), 1375, 869)

  pop()
}

//--------------------------------------------------
//  postmortem
//--------------------------------------------------
function postmortem() {
  MONSTERS = MONSTERS.filter(e => e.live);
  MISSILES = MISSILES.filter(e => e.live);
  EFFECTS = EFFECTS.filter(e => e.live);
  BUILDS = BUILDS.filter(e => e.live);
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
  texts.push(`BUILDS : ${BUILDS.length}`);
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
//  drawBuild
//--------------------------------------------------
function drawBuild(){
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
  fill(0)
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
