import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  template: `<nav class="navbar fixed-top">
    <div class="container-fluid">
      <div class="d-flex align-items-center">
        <img src="assets/logos/logo-white.svg" alt="Logo" width="30" height="24" class="d-inline-block align-text-top" />
        <a class="navbar-brand" href="#">Sigsa Admin</a>
      </div>
      <div>
        <button class="btn btn-outline-primary">Salir</button>
      </div>
    </div>
  </nav>`,
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
