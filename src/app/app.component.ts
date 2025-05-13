import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = '2048Game';

  constructor(private userService: UserService) { }

  ngOnInit() {
    const storedName = localStorage.getItem('username');
    if (storedName) {
      this.userService.setUsername(storedName);
    }
  }
}

