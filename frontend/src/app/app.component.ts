import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <header class="topbar">
      <div><strong>Pay Source Project</strong><span class="muted"> Source-to-Pay</span></div>
      @if (auth.isLoggedIn()) {
        <nav>
          <a routerLink="/">Dashboard</a>
          <a routerLink="/purchase-requests">Requests</a>
          <a routerLink="/suppliers">Suppliers</a>
          <a routerLink="/sourcing">Sourcing</a>
          <a routerLink="/purchase-orders">POs</a>
          <a routerLink="/receiving">Receiving</a>
          <a routerLink="/invoices">Invoices</a>
          <button (click)="logout()">Logout</button>
        </nav>
      }
    </header>
    <main class="container"><router-outlet /></main>
  `
})
export class AppComponent {
  constructor(public auth: AuthService, private router: Router) {}
  logout() { this.auth.logout(); this.router.navigateByUrl('/login'); }
}
