import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { ScoreService } from '../services/score.service';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  imports: [FormsModule, CommonModule],
})

export class SignupComponent {
  username: string = '';
  password: string = '';
  message: string = '';
  isSuccess: boolean = false;
  title: string = 'SIGNUP';

  constructor(private router: Router, private userService: UserService, private http: HttpClient, private scoreService: ScoreService, @Inject(PLATFORM_ID) private platformId: Object) { }

  handleSignup() {
    const payload = { username: this.username, password: this.password };

    this.http.post(`${environment.apiUrl}/signup`, payload)
      .subscribe({
        next: (response: any) => {
          this.isSuccess = true;
          this.message = response.message;

          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('username', response.username);
            localStorage.setItem('playerId', response.playerId);
          }

          this.userService.setUsername(this.username);

          if (this.scoreService.getCurrHighScore() != 0) {
            this.scoreService.updateHighestScore();
            this.router.navigate(['/leaderboard']);
          }
          else {
            this.router.navigate(['/game-board']);
          }
        },
        error: (error) => {
          this.isSuccess = false;
          this.message = error.error.message;
        }
      });
  }


  //todo find a way to clean this
  handleLogin() {
    this.router.navigate(['/login']);
  }
}