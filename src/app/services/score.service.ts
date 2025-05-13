import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class ScoreService {

    message: string = '';
    private currHighestScore: number = 0;

    constructor(private userService: UserService, private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) { }

    updateHighestScore() {
        const score = this.getCurrHighScore();
        const payload = { username: this.userService.getUsername(), score: score };
        this.http.post(`${environment.apiUrl}/update-score`, payload).subscribe({
            next: (response: any) => {
                console.log(response.message);
            },
            error: (error) => {
                console.log(error);
            }
        });
    }

    setCurrHighScore(score: number) {
        this.currHighestScore = score;
    }

    getCurrHighScore() {
        return this.currHighestScore;
    }

    restartGame() {
        this.currHighestScore = 0;
        if (!isPlatformBrowser(this.platformId)) return;
        localStorage.setItem('highestScore', this.currHighestScore.toString());
    }

}