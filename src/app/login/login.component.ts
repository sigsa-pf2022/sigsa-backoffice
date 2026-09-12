import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="login-page">
      <div class="login-card card-surface">
        <div class="login-hero" aria-hidden="true">
          <img class="login-logo" src="assets/logos/logo.svg" alt="" />
        </div>

        <p class="login-eyebrow">SIGSA</p>
        <h1 class="login-title">Backoffice</h1>
        <p class="login-subtitle">Ingresá con tu cuenta de administrador.</p>

        <div class="alert alert-danger login-alert" role="alert" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>
          <div class="mb-3">
            <label class="form-label" for="login-email">Email</label>
            <input
              id="login-email"
              class="form-control"
              type="email"
              formControlName="email"
              autocomplete="username"
              autofocus
            />
            <p class="login-field-error" *ngIf="showError('email')">
              Ingresá un email válido.
            </p>
          </div>

          <div class="mb-3">
            <label class="form-label" for="login-password">Contraseña</label>
            <input
              id="login-password"
              class="form-control"
              type="password"
              formControlName="password"
              autocomplete="current-password"
            />
            <p class="login-field-error" *ngIf="showError('password')">
              La contraseña es obligatoria.
            </p>
          </div>

          <button class="btn btn-primary w-100" type="submit" [disabled]="loading">
            <span
              class="spinner-border spinner-border-sm login-spinner"
              *ngIf="loading"
              aria-hidden="true"
            ></span>
            {{ loading ? 'Ingresando…' : 'Ingresar' }}
          </button>
        </form>
      </div>
    </div>
  `,
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    if (this.route.snapshot.queryParamMap.get('reason') === 'expired') {
      this.errorMessage = 'Tu sesión expiró. Ingresá de nuevo.';
    }
  }

  /** `noPropertyAccessFromIndexSignature` obliga a get(), no form.controls.x */
  showError(name: string): boolean {
    const control = this.form.get(name);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  async onSubmit(): Promise<void> {
    if (this.loading) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    try {
      await this.auth.login({
        email: this.form.get('email')?.value,
        password: this.form.get('password')?.value,
      });
      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/home';
      await this.router.navigateByUrl(returnUrl, { replaceUrl: true });
    } catch (err: any) {
      this.errorMessage = this.messageOf(err);
    } finally {
      this.loading = false;
    }
  }

  private messageOf(err: any): string {
    if (err?.error?.status === 'email-not-verified') {
      return 'Esta cuenta todavía no verificó su email.';
    }
    if (err?.status === 0) {
      return 'No pudimos conectarnos con el servidor.';
    }
    // El backend manda { message, status }; el rechazo por rol es un Error local.
    return err?.error?.message || err?.message || 'No pudimos iniciar sesión.';
  }
}
