import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { BlockComponent } from '../block/block.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserService } from '../services/user.service';
import { BoardService } from '../services/board.service';
import { ScoreService } from '../services/score.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [BlockComponent, CommonModule, FormsModule, MatTooltipModule],
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.css'
})

export class GameBoardComponent {

  constructor(private router: Router, public userService: UserService, public boardService: BoardService, public scoreService: ScoreService, @Inject(PLATFORM_ID) private platformId: Object) { }

  cells: number[] = [];
  sidebarOpen = false;
  debugInputIndex: number = 0;
  debugInputValue: number = 2;
  userName: string | null = null;
  shoudLoad: boolean = false;

  ngOnInit(): void {
    this.setupEvent();
    this.boardService.setBoardState(false);
    this.boardService.initGame();

    this.cells = new Array(this.boardService.getBoardSize()).fill(0);
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