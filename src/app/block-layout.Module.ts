export class boardLayoutInfo {
    cellCount: number;
    boardWidth: number;
    gap: number;
    cellSize: number;
    boardPadding: number;

    constructor(boardWidth: number, gap: number, cellCount: number, boardPadding: number) {
        this.cellCount = cellCount;
        this.boardWidth = boardWidth;
        this.gap = gap;
        this.cellSize = (boardWidth - gap * (cellCount - 1)) / cellCount;
        this.boardPadding = boardPadding;
    }

    getCellTop(index: number): number {
        return this.boardPadding + Math.floor(index / this.cellCount) * (this.cellSize + this.gap);
    }
    getCellLeft(index: number): number {
        return this.boardPadding + (index % this.cellCount) * (this.cellSize + this.gap);
    }
}