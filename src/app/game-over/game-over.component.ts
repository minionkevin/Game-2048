import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { ScoreService } from '../services/score.service';
import { BoardService } from '../services/board.service';

@Component({
  selector: 'app-game-over',
  imports: [],
  templateUrl: './game-over.component.html',
  styleUrl: './game-over.component.css'
})
export class GameOverComponent {

  gameOverActive = false;
  hasUserLogin = false;
  message: string = '';

  constructor(private router: Router, public userService: UserService, public scoreService: ScoreService, private boardService: BoardService) { }

  ngOnInit(): void {
    if (this.userService.getUsername()) {
      this.hasUserLogin = true;
      this.scoreService.updateHighestScore();
    }
  }

  userLogin() {
    this.router.navigate(['/login']);
  }

  checkLeaderboard() {
    this.router.navigate(['/leaderboard'], {})
  }

  restart() {
    this.router.navigate(['/game-board'], {});
    this.scoreService.restartGame();
    this.boardService.restartGame();

    const username = this.userService.getUsername();
    if (username) this.userService.setUsername(username);
  }
}
