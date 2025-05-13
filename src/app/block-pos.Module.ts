export class Int2 {
    static boardSize: number = 4;

    constructor(public x = 0, public y = 0) { }

    static convertToInt2Pos(pos: number) {
        return new Int2(pos % this.boardSize, Math.floor(pos / this.boardSize));
    }

    static convertToIndexPosFromInt2(pos: Int2) {
        return (pos.x + pos.y * this.boardSize);
    }

    static convertToIndexPosFromNum(x: number, y: number) {
        return (x + y * this.boardSize);
    }
}