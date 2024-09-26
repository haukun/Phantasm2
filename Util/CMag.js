class CMag {
  constructor() {
    this.rate = 1;
    this.will_rate = 1;
    this.time = 0;
  }
    
  //--------------------------------------------------
  //  calc
  //--------------------------------------------------
  calc() {
    if (this.rate != this.will_rate) {
      this.rate += (this.will_rate - this.rate) / 10
      this.time++;
      
      if (this.time > 60) {
        this.rate = this.will_rate;
        this.time = 0;
      }
    }
  }
    
  zoomIn() {
    if (this.will_rate < 2) {
      this.will_rate *= 2;
      this.time = 0;
    }
  }
  
  zoomOut() {
    if (this.will_rate > 0.2) {
      this.will_rate /= 2;
      this.time = 0;
    }
  }
}