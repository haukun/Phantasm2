//  右クリック無効化
document.addEventListener('contextmenu',function(event){
    event.preventDefault();
  });
  
  function input(){
    if(!keyIsPressed){
      return;
    }
    
    let tx = 0;
    let ty = 0;
    if(keyIsDown(SHIFT)){
      speed = 32
    }
    if(keyIsDown(87)){
      ty -= 1;
    }
    if(keyIsDown(65)){
      tx -= 1;
    }
    if(keyIsDown(83)){
      ty += 1;
    }
    if(keyIsDown(68)){
      tx += 1;
    }

    if (tx != 0 || ty != 0){
      HERO.move(tx, ty);
    }
  }
  
  function mousePressed(){
    if(mouseButton == RIGHT){
      let ox = HERO.x+(mouseX-WW/2)/MAG.rate
      let oy = HERO.y+(mouseY-WH/2)/MAG.rate
      let hx = floor(ox/TILE_PX)
      let hy = floor(oy/TILE_PX)
      let g = TILES.find(e=>e.mx == hx && e.my == hy)
      if(g != undefined){
        let cx = int(((ox % TILE_PX) + TILE_PX) % TILE_PX / CELL_PX)
        let cy = int(((oy % TILE_PX) + TILE_PX) % TILE_PX / CELL_PX)
        if(g.cells[cy][cx] == WALL){
          g.cells[cy][cx]=FLOOR
        }
        g.redraw()
      }
    }
  }
  
  function mouseWheel(event){
    if(event.delta > 0){
      MAG.zoomOut()
    }else if(event.delta < 0){
      MAG.zoomIn()
    }
  }
  