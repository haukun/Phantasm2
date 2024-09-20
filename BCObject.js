class BCObject {
    constructor(_x, _y) {
        this._x = _x;
        this._y = _y;
        this.init(_x, _y);
    }
    getMx() {
        return floor(this._x / TILE_PX);
    };

    getMy() {
        return floor(this._y / TILE_PX);
    }

    getCx() {
        return int((((this._x % TILE_PX) + TILE_PX) % TILE_PX) / CELL_PX);
    }

    getCy() {
        return int((((this._y % TILE_PX) + TILE_PX) % TILE_PX) / CELL_PX);
    }

    getDx() {
        return int(((this._x % TILE_PX) + TILE_PX) % TILE_PX);
    }

    getDy() {
        return int(((this._y % TILE_PX) + TILE_PX) % TILE_PX);
    }
}