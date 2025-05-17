import { ChangeDetectorRef, Component, ElementRef, HostListener, Inject, PLATFORM_ID, QueryList, viewChild, ViewChild, ViewChildren } from '@angular/core';
import { BlockComponent } from '../block/block.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserService } from '../services/user.service';
import { BoardService } from '../services/board.service';
import { ScoreService } from '../services/score.service';
import { isPlatformBrowser } from '@angular/common';
import { boardLayoutInfo } from '../block-layout.Module';
import { Int2 } from '../block-pos.Module';
import { SingleBlockData } from '../block-type.Module';

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [BlockComponent, CommonModule, FormsModule, MatTooltipModule],
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.css'
})

export class GameBoardComponent {

  constructor(private router: Router, public userService: UserService, public boardService: BoardService,
    public scoreService: ScoreService, @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef) { }

  cells: number[] = [];
  sidebarOpen = false;
  debugInputIndex: number = 0;
  debugInputValue: number = 2;
  userName: string | null = null;
  shoudLoad: boolean = false;
  touchStartX = 0;
  touchStartY = 0;
  dataIsLoaded: boolean = false;

  @ViewChildren('cellRefs') cellRefs!: QueryList<ElementRef<HTMLDivElement>>;
  @ViewChild('gridContentRef') gridContentRef!: ElementRef<HTMLDivElement>;

  cellSize = 0;
  layoutInfo?: boardLayoutInfo;

  ngOnInit(): void {
    this.setupEvent();
    this.boardService.setBoardState(false);
    this.cdr.detectChanges();

    this.cells = new Array(this.boardService.getBoardSize()).fill(0);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.updateBlockPositions();
      this.boardService.initGame();
    });
  }

  @HostListener('window:resize')
  onResize() {
    this.updateBlockPositions();
  }

  updateBlockPositions() {
    this.boardService.blockData.forEach((block, i) => {
      const cellEl = this.cellRefs.toArray()[i]?.nativeElement;
      if (cellEl) {
        block.xPos = cellEl.offsetTop;
        block.yPos = cellEl.offsetLeft;
        block.size = cellEl.offsetWidth;
        block.shouldShow = false;
        block.hasValue = false;
        block.isMerge = false;
        block.value = 0;
        block.index = i;
      }
    });
  }

  onBlockMoveEnd(blockData: SingleBlockData) {
    this.boardService.handleBlockAnimationFinish(blockData);
  }


  setupEvent() {
    this.userService.username$.subscribe(name => {
      this.userName = name;
    });

    this.boardService.gameOver$.subscribe(() => {
      this.gameOver();
    })
  }


  @HostListener('window:keydown', ['$event'])
  handlePlayerInput(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowUp':
        this.boardService.moveBlocks('up');
        break;
      case 'ArrowDown':
        this.boardService.moveBlocks('down');
        break;
      case 'ArrowLeft':
        this.boardService.moveBlocks('left');
        break;
      case 'ArrowRight':
        this.boardService.moveBlocks('right');
        break;
    }
  }

  onSwipe(direction: 'up' | 'down' | 'left' | 'right') {
    this.boardService.moveBlocks(direction);
  }

  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.touches[0].clientX;
    this.touchStartY = event.touches[0].clientY;
  }

  onTouchEnd(event: TouchEvent) {
    const endX = event.changedTouches[0].clientX;
    const endY = event.changedTouches[0].clientY;

    const dx = endX - this.touchStartX;
    const dy = endY - this.touchStartY;

    if (Math.abs(dx) > Math.abs(dy)) {
      this.onSwipe(dx > 0 ? 'right' : 'left');
    } else {
      this.onSwipe(dy > 0 ? 'down' : 'up');
    }
  }

  showDebug() {
    console.log(this.boardService.blockData);
  }

  gameOver() {
    this.router.navigate(['/game-over'], {});
  }

  playerSignOut() {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.userService.cleanUsername();
  }

  reloadGame() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.updateBlockPositions();
    this.boardService.loadPlayerState(Number(localStorage.getItem('playerId')));
    this.shoudLoad = true;
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  handleLogin() {
    this.router.navigate(['/login']);
  }

  restart() {
    this.boardService.setBoardState(false);
    this.router.navigate(['/game-board']);
    console.log("restart");
  }
}