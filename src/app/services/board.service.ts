import { HttpClient } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Int2 } from '../block-pos.Module';
import { SingleBlockData } from '../block-type.Module';
import { Subject } from 'rxjs';
import { UserService } from './user.service';
import { ScoreService } from './score.service';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BoardService {
    constructor(private http: HttpClient, private userService: UserService, private scoreService: ScoreService, @Inject(PLATFORM_ID) private platformId: Object) { }

    private gameOverEvent = new Subject<void>();
    gameOver$ = this.gameOverEvent.asObservable();

    private isGameOver: boolean = false;

    public row: number = 4;
    public column: number = 4;

    getBoardSize() {
        return this.row * this.column;
    }

    blockPosData: SingleBlockData[] = new Array(16).fill(null).map((_, index) => ({
        value: 0,
        index: -1,
        pos2d: new Int2(-1, -1),
        xPos: 0,
        yPos: 0,
        shouldShow: false,
        isMerge: false
    }));

    blockData: SingleBlockData[] = [];

    // init board data
    initGame() {
        for (let i = 0; i < this.blockPosData.length; i++) {
            this.blockPosData[i] = ({
                value: 0,
                index: i,
                pos2d: Int2.convertToInt2Pos(i),
                xPos: this.getTop(i),
                yPos: this.getLeft(i),
                shouldShow: false,
                isMerge: false
            });
        }

        this.blockData = this.getInitialBlockData();

        this.addRandomBlock();
        this.addRandomBlock();
    }

    getInitialBlockData(): SingleBlockData[] {
        return new Array(16).fill(null).map(() => ({
            value: 0,
            index: -1,
            pos2d: new Int2(-1, -1),
            xPos: 0,
            yPos: 0,
            shouldShow: false,
            isMerge: false
        }));
    }

    // Add block to random avaiable on the board
    addRandomBlock() {
        const emptyIndices: number[] = [];

        this.blockData.forEach((block, i) => {
            if (block.index === -1) {
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

        // calculate position
        this.blockData[randomIndex] = ({
            value: Math.random() < 0.75 ? 2 : 4,
            index: randomIndex,
            pos2d: Int2.convertToInt2Pos(randomIndex),
            xPos: this.getTop(randomIndex),
            yPos: this.getLeft(randomIndex),
            shouldShow: true,
            isMerge: false
        });
    }

    // take player input and move to direction
    moveBlocks(direction: 'up' | 'down' | 'left' | 'right') {
        this.blockData.forEach(block => {
            block.isMerge = false;
        });

        this.moveInDirection(direction);
        this.addRandomBlock();
        this.savePlayerState();
    }

    // change board data and move blocks depends on direction
    moveInDirection(direction: 'left' | 'right' | 'up' | 'down') {
        const isHorizontal = direction === 'left' || direction === 'right';
        const outerRange = [0, 1, 2, 3];
        const innerRange = direction === 'left' || direction === 'up' ? [0, 1, 2, 3] : [3, 2, 1, 0];

        for (let outer of outerRange) {
            for (let inner of innerRange) {
                const x = isHorizontal ? inner : outer;
                const y = isHorizontal ? outer : inner;
                const currIndex = Int2.convertToIndexPosFromNum(x, y);
                let currBlock = this.blockData[currIndex];

                if (currBlock.value === 0) continue;

                let currX = x;
                let currY = y;

                while (true) {
                    const nextX = currX + (direction === 'left' ? -1 : direction === 'right' ? 1 : 0);
                    const nextY = currY + (direction === 'up' ? -1 : direction === 'down' ? 1 : 0);

                    if (nextX < 0 || nextX >= this.row || nextY < 0 || nextY >= this.column) break;

                    const nextPos = new Int2(nextX, nextY);
                    const nextIndex = Int2.convertToIndexPosFromInt2(nextPos);
                    const nextBlock = this.blockData[nextIndex];

                    if (nextBlock.value === 0) {
                        this.moveBlockToBlankPos(currBlock, nextIndex);
                        currX = nextX;
                        currY = nextY;
                        currBlock = this.blockData[nextIndex];
                    } else if (
                        nextBlock.value === currBlock.value && !nextBlock.isMerge && !currBlock.isMerge
                    ) {
                        this.swapBlockToBlockPos(currBlock, nextBlock);
                        this.cleanBlockPos(nextBlock, false);
                        currX = nextX;
                        currY = nextY;
                        currBlock = this.blockData[nextIndex];
                    } else {
                        break;
                    }
                }
            }
        }
    }

    // move block to empty position
    moveBlockToBlankPos(currBlock: SingleBlockData, newIndex: number) {
        const removeIndex = currBlock.index;

        let newBlock = ({
            value: currBlock.value,
            index: newIndex,
            pos2d: this.blockPosData[newIndex].pos2d,
            xPos: this.blockPosData[newIndex].xPos,
            yPos: this.blockPosData[newIndex].yPos,
            isMerge: false,
            shouldShow: true,
        });

        this.cleanBlockPos(this.blockData[removeIndex], false);
        this.blockData[newIndex] = newBlock;
    }

    // merge 2 same value blocks
    swapBlockToBlockPos(currBlock: SingleBlockData, targetBlock: SingleBlockData) {
        currBlock.isMerge = true;
        currBlock.value *= 2;
        currBlock.pos2d = targetBlock.pos2d;
        currBlock.xPos = targetBlock.xPos;
        currBlock.yPos = targetBlock.yPos;

        const tempBlock = targetBlock;
        const tempCurrIndex = currBlock.index;
        const tempTargetIndex = targetBlock.index;

        this.blockData[targetBlock.index] = currBlock;
        this.blockData[tempCurrIndex] = tempBlock;
        currBlock.index = tempTargetIndex;
    }

    // clean up block after moving
    cleanBlockPos(targetBlock: SingleBlockData, isMerge: boolean) {
        targetBlock.value = 0,
            targetBlock.index = -1,
            targetBlock.pos2d = new Int2(-1, -1),
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
            pos2d: Int2.convertToInt2Pos(debugIndex),
            xPos: this.getTop(debugIndex),
            yPos: this.getLeft(debugIndex),
            shouldShow: true,
            isMerge: false
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
        return this.http.get<any>(`http://two048-back-0453.onrender.com/player-state/${playerId}`).subscribe({
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
            pos2d: Int2.convertToInt2Pos(blockIndex),
            xPos: this.getTop(blockIndex),
            yPos: this.getLeft(blockIndex),
            shouldShow: true,
            isMerge: false
        });
    }

    restartGame() {
        this.isGameOver = false;
        this.initGame();
        this.savePlayerState();
    }

    setBlockData(data: SingleBlockData[]) {
        this.blockData = data;
    }

    isPowerOfTwo(n: number): boolean {
        return n > 0 && (n & (n - 1)) === 0;
    }

    getTop(index: number): number {
        return Math.floor(index / 4) * 110 + 10;
    }

    getLeft(index: number): number {
        return (index % 4) * 110 + 10;
    }

    setBoardState(value: boolean) {
        this.isGameOver = value;
    }

    getBoardState() {
        return this.isGameOver;
    }

}