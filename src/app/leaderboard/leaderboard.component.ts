import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css'],
  imports: [CommonModule]
})
export class LeaderboardComponent implements OnInit {
  leaderboard: { username: string; highest_score: number }[] = [];
  currentUser: { username: string; highest_score: number } | null = null;

  constructor(private http: HttpClient, private router: Router, @Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    const token = localStorage.getItem('token');
    if (!token) {
      this.http.get<any>(`${environment.apiUrl}/guest-leaderboard`)
        .subscribe({
          next: (data) => {
            this.leaderboard = data.topTen;
          },
          error: err => console.error('Failed to fetch leaderboard:', err)
        });
    }
    else {
      this.http.get<any>(`${environment.apiUrl}/leaderboard`, { headers: { Authorization: `Bearer ${token}` } })
        .subscribe({
          next: (data) => {
            this.leaderboard = data.topTen;
            this.currentUser = data.currentUser;
          },
          error: err => console.error('Failed to fetch leaderboard:', err)
        });
    }
  }

  restartGame() {
    this.router.navigate(['/game-board']);
  }
}