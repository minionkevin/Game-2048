import { HttpClient } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Int2 } from '../block-pos.Module';
import { SingleBlockData } from '../block-type.Module';
import { merge, Subject } from 'rxjs';
import { UserService } from './user.service';
import { ScoreService } from './score.service';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';
import { SingleBlockPosData } from '../blockData-pos.Module';

@Injectable({ providedIn: 'root' })
export class BoardService {
    constructor(private http: HttpClient, private userService: UserService, private scoreService: ScoreService, @Inject(PLATFORM_ID) private platformId: Object) { }

    private gameOverEvent = new Subject<void>();
    gameOver$ = this.gameOverEvent.asObservable();

    private isGameOver: boolean = false;

    public row: number = 4;
    public column: number = 4;

    public blockMap: { [index: number]: SingleBlockPosData } = {};
    private blockMoveCount: number = 0;
    private blockDataProcessCount: number = 0;

    getBoardSize() {
        return this.row * this.column;
    }

    blockData: SingleBlockData[] = new Array(16).fill(null).map((_, i) => ({
        value: 0,
        index: i,
        xPos: 0,
        yPos: 0,
        size: 0,
        shouldShow: false,
        hasValue: false,
        isMerge: false
    }));

    processData: SingleBlockData[] = new Array(16).fill(null).map((_, i) => ({
        value: 0,
        index: i,
        xPos: 0,
        yPos: 0,
        size: 0,
        shouldShow: false,
        hasValue: false,
        isMerge: false,
        originalIndex: -1
    }));

    // init board data
    initGame() {
        this.blockData.forEach(block => {
            this.blockMap[block.index] = { posX: block.xPos, posY: block.yPos };
        });

        this.addRandomBlock();
        this.addRandomBlock();
    }

    // Add block to random avaiable on the board
    addRandomBlock() {
        const emptyIndices: number[] = [];

        this.blockData.forEach((block, i) => {
            if (!block.hasValue) {
                emptyIndices.push(i);
            }
            if (block.value > this.scoreService.getCurrHighScore()) {
                const num = block.value;
                this.scoreService.setCurrHighScore(num);
                if (isPlatformBrowser(this.platformId)) localStorage.setItem('highestScore', num.toString());
            }
        });

        if (emptyIndices.length === 0) {
            this.setBoardState(true);
            this.gameOverEvent.next();
            return;
        }

        const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        let tempBlock = this.blockData[randomIndex];
        //tempBlock.value = Math.random() < 0.75 ? 2 : 4;
        tempBlock.value = 2;
        tempBlock.shouldShow = true;
        tempBlock.hasValue = true;
    }

    // take player input and move to direction
    moveBlocks(direction: 'up' | 'down' | 'left' | 'right') {
        this.blockData.forEach(block => {
            block.isMerge = false;
            block.targetIndex = undefined;
        });

        this.blockMoveCount = 0;
        this.processData = this.blockData.map(block => ({ ...block }));
        this.moveInDirection(direction);

    }

    // change board data and move blocks depends on direction
    moveInDirection(direction: 'left' | 'right' | 'up' | 'down') {
        const isHorizontal = direction === 'left' || direction === 'right';
        const outerRange = [0, 1, 2, 3];
        const innerRange = direction === 'left' || direction === 'up' ? [0, 1, 2, 3] : [3, 2, 1, 0];

        for (let outer of outerRange) {
            for (let inner of innerRange) {
                let x = isHorizontal ? inner : outer;
                let y = isHorizontal ? outer : inner;
                let currIndex = Int2.convertToIndexPosFromNum(x, y);
                let currBlock = this.processData[currIndex];

                if (!currBlock.hasValue) continue;

                let nextX = x;
                let nextY = y;
                let nextIndex = Int2.convertToIndexPosFromNum(nextX, nextY);
                let lastValidIndex = currIndex;
                let blockValue = currBlock.value;


                while (true) {
                    nextX += (direction === 'left' ? -1 : direction === 'right' ? 1 : 0);
                    nextY += (direction === 'up' ? -1 : direction === 'down' ? 1 : 0);

                    if (nextX < 0 || nextX >= this.row || nextY < 0 || nextY >= this.column) break;

                    nextIndex = Int2.convertToIndexPosFromNum(nextX, nextY);
                    let nextBlock = this.processData[nextIndex];

                    if (!nextBlock.hasValue) {
                        lastValidIndex = nextIndex;
                        continue;
                    }
                    if (nextBlock.value === currBlock.value && !nextBlock.isMerge && !currBlock.isMerge) {
                        console.log("merge"); lastValidIndex = nextIndex;
                        blockValue *= 2;
                    }
                    else {
                        break;
                    }
                }

                if (currBlock.index === nextIndex || currBlock.index === lastValidIndex) continue;

                currBlock.targetIndex = lastValidIndex;
                this.blockData[currBlock.index].targetIndex = lastValidIndex;

                this.handleBlockDataChange(currBlock, lastValidIndex, blockValue !== currBlock.value);
            }
        }

        for (let i = 0; i < this.blockData.length; i++) {
            const targetIndex = this.blockData[i].targetIndex;
            if (targetIndex !== undefined) {
                const block = this.blockData[i];
                this.handleMoveBlock(block, targetIndex);
            }
        }
    }


    handleBlockDataChange(currBlock: SingleBlockData, targetIndex: number, isMerge: boolean) {
        this.blockDataProcessCount++;
        this.processData[targetIndex] = {
            ...currBlock,
            value: isMerge ? currBlock.value * 2 : currBlock.value,
            index: targetIndex,
            xPos: this.blockMap[targetIndex].posX,
            yPos: this.blockMap[targetIndex].posY,
            shouldShow: true,
            isMerge: isMerge,
            hasValue: true
        };

        this.processData[currBlock.index] = {
            value: 0,
            index: currBlock.index,
            xPos: this.blockMap[currBlock.index].posX,
            yPos: this.blockMap[currBlock.index].posY,
            shouldShow: false,
            hasValue: false,
            isMerge: false,
            size: currBlock.size
        };
    }

    handleMoveBlock(currBlock: SingleBlockData, targetIndex: number) {
        currBlock.xPos = this.blockMap[targetIndex].posX;
        currBlock.yPos = this.blockMap[targetIndex].posY;
    }

    handleBlockAnimationFinish(currBlock: SingleBlockData) {
        this.blockMoveCount++;
        this.updateMovementData(currBlock);
        this.savePlayerState();
    }

    updateMovementData(changeBlock: SingleBlockData) {
        if (changeBlock.targetIndex || changeBlock.targetIndex === 0) {
            this.blockData[changeBlock.index] = { ...this.processData[changeBlock.index] };

            this.blockData[changeBlock.targetIndex] = { ...this.processData[changeBlock.targetIndex] };
        }

        // only go to next step when all blocks animation finish
        if (this.blockDataProcessCount === this.blockMoveCount) {
            this.updateBoardData();
        }
    }

    updateBoardData() {
        this.blockData = this.processData.map(block => ({ ...block }));
        this.blockDataProcessCount = 0;
        this.blockMoveCount = 0;
        this.addRandomBlock();
    }

    // clean up block after moving
    cleanBlockPos(targetBlock: SingleBlockData, isMerge: boolean) {
        targetBlock.value = 0,
            targetBlock.index = -1,
            targetBlock.xPos = 0,
            targetBlock.yPos = 0,
            targetBlock.shouldShow = false,
            targetBlock.isMerge = isMerge
    }

    // DEBUG: add value block to index position
    addBlockToPos(debugIndex: number, debugValue: number) {
        if (debugIndex > 15 || debugIndex < 0) return;

        this.blockData[debugIndex] = ({
            value: this.isPowerOfTwo(debugValue) ? debugValue : 2,
            index: debugIndex,
            xPos: this.getTop(debugIndex),
            yPos: this.getLeft(debugIndex),
            shouldShow: true,
            isMerge: false,
            hasValue: true,
            size: 0
        });
    }

    // save player current board to database
    savePlayerState() {

        if (!this.userService.getUsername() || !isPlatformBrowser(this.platformId)) return;

        const playerId = Number(localStorage.getItem('playerId'));

        let data = [];
        for (let i = 0; i < this.blockData.length; i++) {
            data.push({ value: this.blockData[i].value, index: this.blockData[i].index });
        }

        const info = JSON.stringify({ data });
        const payload = { playerId, info };

        return this.http.post(`${environment.apiUrl}/player-state`, payload).subscribe({
            next: (response) => {
                // console.log('Move response:', response);
            },
            error: (error) => {
                console.error('Move failed:', error);
            }
        });
    }

    // load player board from database by playerId
    loadPlayerState(playerId: number) {
        return this.http.get<any>(`${environment.apiUrl}/player-state/${playerId}`).subscribe({
            next: (response) => {
                const info = response.info;
                for (let i = 0; i < info.data.length; i++) {
                    this.blockData[i] = this.handleSpawnBlockToIndex(info.data[i].index, info.data[i].value);
                }
            },
            error: (error) => {
                console.error('load failed:', error);
            }
        });
    }

    // spawn block to index position
    handleSpawnBlockToIndex(blockIndex: number, blockValue: number) {
        return ({
            value: blockValue,
            index: blockIndex,
            xPos: this.getTop(blockIndex),
            yPos: this.getLeft(blockIndex),
            shouldShow: true,
            isMerge: false,
            hasValue: blockValue != 0,
            targetIndex: undefined,
            size: this.blockData[0].size
        });
    }

    restartGame() {
        this.isGameOver = false;
        this.initGame();
        this.savePlayerState();
    }

    isPowerOfTwo(n: number): boolean {
        return n > 0 && (n & (n - 1)) === 0;
    }

    getTop(index: number): number {
        const { cellSize, gap } = this.getCellSizeAndGap();
        return Math.floor(index / 4) * (cellSize + gap);
    }
    getLeft(index: number): number {
        const { cellSize, gap } = this.getCellSizeAndGap();
        return (index % 4) * (cellSize + gap);
    }

    getCellSizeAndGap(): { cellSize: number, gap: number } {
        return { cellSize: 0, gap: 0 };
    }

    setBoardState(value: boolean) {
        this.isGameOver = value;
    }

    getBoardState() {
        return this.isGameOver;
    }

}