import { Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <section class="card narrow">
      <h1>Login</h1>
      <p class="muted">Try requester@demo.com or manager@demo.com. Password: Password123!</p>
      <form [formGroup]="form" (ngSubmit)="submit()" class="form-grid">
        <label>Email<input formControlName="email"></label>
        <label>Password<input type="password" formControlName="password"></label>
        <button [disabled]="form.invalid || loading()">Login</button>
      </form>
      @if (error()) { <p class="error">{{ error() }}</p> }
    </section>
  `
})
export class LoginComponent {
  loading = signal(false);
  error = signal('');
  form;
  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.nonNullable.group({
      email: ['requester@demo.com', [Validators.required, Validators.email]],
      password: ['Password123!', Validators.required]
    });
  }
  submit() {
    this.loading.set(true); this.error.set('');
    this.auth.login(this.form.getRawValue().email, this.form.getRawValue().password).subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: (e) => { this.error.set(e.error?.message || 'Login failed'); this.loading.set(false); }
    });
  }
}
