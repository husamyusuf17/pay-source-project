import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { User } from '../models/types';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'pay_source_project_token';
  private readonly userKey = 'pay_source_project_user';
  private readonly userSignal = signal<User | null>(this.loadUser());

  readonly user = this.userSignal.asReadonly();
  readonly isLoggedIn = computed(() => !!this.userSignal());

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post<{ token: string; user: User }>('/api/auth/login', { email, password }).pipe(
      tap(({ token, user }) => {
        localStorage.setItem(this.tokenKey, token);
        localStorage.setItem(this.userKey, JSON.stringify(user));
        this.userSignal.set(user);
      })
    );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.userSignal.set(null);
  }

  token() { return localStorage.getItem(this.tokenKey); }

  hasRole(...roles: string[]) { return !!this.userSignal() && roles.includes(this.userSignal()!.role); }

  private loadUser(): User | null {
    const raw = localStorage.getItem(this.userKey);
    try { return raw ? JSON.parse(raw) : null; } catch { return null; }
  }
}
