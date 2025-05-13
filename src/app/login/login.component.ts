import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { ScoreService } from '../services/score.service';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [FormsModule, CommonModule],
    templateUrl: '../signup/signup.component.html',
    styleUrl: '../signup/signup.component.css'
})

export class LoginComponent {
    username: string = '';
    password: string = '';
    message: string = '';
    isSuccess: boolean = false;
    title: string = 'LOGIN';

    constructor(private router: Router, private userService: UserService, private http: HttpClient, private scoreService: ScoreService, @Inject(PLATFORM_ID) private platformId: Object) { }

    // handle user login
    handleSignup() {
        const payload = { username: this.username, password: this.password };

        this.http.post(`${environment.apiUrl}/login`, payload, {
            headers: { 'Content-Type': 'application/json' }
        }).subscribe({
            next: (response: any) => {
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
                this.message = error.error.message || 'Login failed. Please try again.';
            }
        });
    }

    handleLogin() {
        this.router.navigate(['/sign-up']);
    }
}
