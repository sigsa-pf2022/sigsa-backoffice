import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  template: `<header class="topbar">
    <a class="topbar__brand" routerLink="/home">
      <img class="topbar__logo" src="assets/logos/logo.svg" alt="" aria-hidden="true" />
      <span class="topbar__title">SIGSA <span class="topbar__title-soft">Backoffice</span></span>
    </a>
    <div class="topbar__actions">
      <span class="topbar__avatar" aria-hidden="true">SA</span>
      <button type="button" class="btn btn-ghost topbar__logout">
        <i class="bi bi-box-arrow-right"></i>
        Salir
      </button>
    </div>
  </header>`,
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {}
