import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
    private usernameSubject = new BehaviorSubject<string | null>(null);
    username$ = this.usernameSubject.asObservable();

    setUsername(name: string) {
        this.usernameSubject.next(name);
    }

    cleanUsername() {
        this.usernameSubject.next(null);
    }

    getUsername(): string | null {
        return this.usernameSubject.value;
    }
}