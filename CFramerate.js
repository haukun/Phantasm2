class CFramerate{
    constructor(){
      this.values = []
      for(let i = 0; i < 10;i++){
        this.values.push(60)
      }
    }
    
    //--------------------------------------------------
    //  calc
    //--------------------------------------------------
    calc(){
      this.values.push(int(frameRate()*10)/10)
      this.values.shift();
      let frsum = this.values.reduce((acc,val) => acc + val, 0);
  
      this.rate = int(int(frsum * 10)/10)/10;
      this.max = max(...this.values);
      this.min = min(...this.values);
    }
  }