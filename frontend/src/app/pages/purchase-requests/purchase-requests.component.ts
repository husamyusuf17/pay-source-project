import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProcurementApiService } from '../../core/services/procurement-api.service';
import { AuthService } from '../../core/services/auth.service';
import { PurchaseRequest } from '../../core/models/types';

@Component({
  selector: 'app-purchase-requests', standalone: true, imports: [ReactiveFormsModule],
  template: `
    <h1>Purchase Requests</h1>
    @if (auth.hasRole('REQUESTER','ADMIN')) {
      <section class="card">
        <h2>Create request</h2>
        <form [formGroup]="form" (ngSubmit)="create()" class="form-grid two">
          <label>Department<input formControlName="department"></label>
          <label>Item<input formControlName="description"></label>
          <label>Quantity<input type="number" formControlName="quantity"></label>
          <label>Estimated unit price<input type="number" formControlName="estimatedUnitPrice"></label>
          <label class="span-2">Reason<input formControlName="reason"></label>
          <button [disabled]="form.invalid">Submit purchase request</button>
        </form>
      </section>
    }
    <section class="card">
      <button (click)="load()">Refresh</button>
      <table><thead><tr><th>ID</th><th>Department</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>@for (r of requests(); track r._id) {
        <tr><td><code>{{ r._id }}</code></td><td>{{ r.department }}</td><td>{{ r.estimatedAmount }}</td><td>{{ r.status }}</td>
        <td>
          @if (auth.hasRole('MANAGER','FINANCE','ADMIN') && r.status === 'PENDING_APPROVAL') {
            <button (click)="approve(r._id)">Approve</button>
            <button class="danger" (click)="reject(r._id)">Reject</button>
          }
        </td></tr>
      }</tbody></table>
    </section>
  `
})
export class PurchaseRequestsComponent implements OnInit {
  requests = signal<PurchaseRequest[]>([]);
  form;
  constructor(private fb: FormBuilder, private api: ProcurementApiService, public auth: AuthService) {
    this.form = this.fb.nonNullable.group({
      department: [auth.user()?.department || 'IT', Validators.required], description: ['Laptop', Validators.required],
      quantity: [10, [Validators.required, Validators.min(1)]], estimatedUnitPrice: [500, [Validators.required, Validators.min(0)]],
      reason: ['New employees', Validators.required]
    });
  }
  ngOnInit() { this.load(); }
  load() { this.api.listPurchaseRequests().subscribe(r => this.requests.set(r.data)); }
  create() {
    const v = this.form.getRawValue();
    this.api.createPurchaseRequest({ department: v.department, reason: v.reason, items: [{ description: v.description, quantity: v.quantity, estimatedUnitPrice: v.estimatedUnitPrice }] }).subscribe(() => this.load());
  }
  approve(id: string) { this.api.approvePurchaseRequest(id).subscribe(() => this.load()); }
  reject(id: string) { this.api.rejectPurchaseRequest(id).subscribe(() => this.load()); }
}
