import { Routes } from '@angular/router';
import { GameOverComponent } from './game-over/game-over.component';
import { GameBoardComponent } from './game-board/game-board.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';

export const routes: Routes = [
    { path: '', redirectTo: 'game-board', pathMatch: 'full' },
    { path: 'game-board', component: GameBoardComponent },
    { path: 'game-over', component: GameOverComponent },
    { path: 'sign-up', component: SignupComponent },
    { path: 'login', component: LoginComponent },
    { path: 'leaderboard', component: LeaderboardComponent }
];
