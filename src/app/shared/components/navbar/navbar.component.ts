import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  template: `<header class="topbar">
    <a class="topbar__brand" routerLink="/home">
      <img class="topbar__logo" src="assets/logos/logo.svg" alt="" aria-hidden="true" />
      <span class="topbar__title">SIGSA <span class="topbar__title-soft">Backoffice</span></span>
    </a>
    <div class="topbar__actions">
      <span class="topbar__avatar" [title]="fullName$ | async">{{ initials$ | async }}</span>
      <button type="button" class="btn btn-ghost topbar__logout" (click)="logout()">
        <i class="bi bi-box-arrow-right"></i>
        Salir
      </button>
    </div>
  </header>`,
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  readonly initials$ = this.auth.user$.pipe(map((user) => this.auth.initials(user)));
  readonly fullName$ = this.auth.user$.pipe(
    map((user) => (user ? `${user.firstName} ${user.lastName}` : '')),
  );

  constructor(private auth: AuthService, private router: Router) {}

  logout(): void {
    this.auth.logout();
    // replaceUrl para que el botón Atrás no vuelva a la pantalla anterior.
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}
