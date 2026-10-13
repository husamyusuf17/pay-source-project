import { Component, OnInit, signal } from '@angular/core';
import { BffService } from '../../core/services/bff.service';
import { DashboardSummary } from '../../core/models/types';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard', standalone: true,
  template: `
    <h1>Dashboard</h1>
    <p>Logged in as <strong>{{ auth.user()?.name }}</strong> — {{ auth.user()?.role }}</p>
    @if (summary()) {
      <div class="grid cards">
        <article class="card"><h3>Requests</h3><strong>{{ summary()!.requests }}</strong></article>
        <article class="card"><h3>Pending approvals</h3><strong>{{ summary()!.pendingApprovals }}</strong></article>
        <article class="card"><h3>Active suppliers</h3><strong>{{ summary()!.suppliers }}</strong></article>
        <article class="card"><h3>Open RFQs</h3><strong>{{ summary()!.openRfqs }}</strong></article>
        <article class="card"><h3>Open POs</h3><strong>{{ summary()!.openPos }}</strong></article>
        <article class="card"><h3>Invoices to review</h3><strong>{{ summary()!.unmatchedInvoices }}</strong></article>
      </div>
      <section class="card"><h2>Why this is BFF</h2><p>Angular made one request to <code>/api/bff/dashboard</code>. The BFF aggregated counts from requests, suppliers, RFQs, POs and invoices and returned one frontend-shaped response.</p></section>
    }
  `
})
export class DashboardComponent implements OnInit {
  summary = signal<DashboardSummary | null>(null);
  constructor(private bff: BffService, public auth: AuthService) {}
  ngOnInit() { this.bff.dashboard().subscribe(r => this.summary.set(r.data)); }
}
