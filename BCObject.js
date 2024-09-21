class BCObject {
    constructor(obj) {
        if (obj != undefined) {
            this.x = obj.x;
            this.y = obj.y;
            this.l = 0;
            this.init(obj);
        }
    }
    init(obj) { }
    getMx() {
        return floor(this.x / TILE_PX);
    };

    getMy() {
        return floor(this.y / TILE_PX);
    }

    getCx() {
        return int((((this.x % TILE_PX) + TILE_PX) % TILE_PX) / CELL_PX);
    }

    getCy() {
        return int((((this.y % TILE_PX) + TILE_PX) % TILE_PX) / CELL_PX);
    }

    getDx() {
        return int(((this.x % TILE_PX) + TILE_PX) % TILE_PX);
    }

    getDy() {
        return int(((this.y % TILE_PX) + TILE_PX) % TILE_PX);
    }
}