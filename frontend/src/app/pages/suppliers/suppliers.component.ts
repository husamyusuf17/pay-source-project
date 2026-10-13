import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProcurementApiService } from '../../core/services/procurement-api.service';
import { AuthService } from '../../core/services/auth.service';

@Component({ selector: 'app-suppliers', standalone: true, imports: [ReactiveFormsModule], template: `
  <h1>Suppliers</h1>
  @if (auth.hasRole('PROCUREMENT','ADMIN')) {
    <section class="card"><form [formGroup]="form" (ngSubmit)="create()" class="form-grid two">
      <label>Name<input formControlName="name"></label><label>Email<input formControlName="email"></label>
      <label>Category<input formControlName="category"></label><label>Rating<input type="number" step="0.1" formControlName="rating"></label>
      <button [disabled]="form.invalid">Add supplier</button>
    </form></section>
  }
  <section class="card"><table><thead><tr><th>ID</th><th>Name</th><th>Category</th><th>Rating</th></tr></thead><tbody>
  @for (s of suppliers(); track s._id) { <tr><td><code>{{s._id}}</code></td><td>{{s.name}}</td><td>{{s.category}}</td><td>{{s.rating}}</td></tr> }
  </tbody></table></section>` })
export class SuppliersComponent implements OnInit {
  suppliers = signal<any[]>([]);
  form;
  constructor(private fb: FormBuilder, private api: ProcurementApiService, public auth: AuthService) {
    this.form = this.fb.nonNullable.group({ name: ['', Validators.required], email: ['', [Validators.required, Validators.email]], category: ['IT', Validators.required], rating: [4, [Validators.required, Validators.min(1), Validators.max(5)]] });
  }
  ngOnInit(){ this.load(); } load(){ this.api.listSuppliers().subscribe(r => this.suppliers.set(r.data)); }
  create(){ this.api.createSupplier(this.form.getRawValue()).subscribe(() => { this.form.reset({name:'',email:'',category:'IT',rating:4}); this.load(); }); }
}
