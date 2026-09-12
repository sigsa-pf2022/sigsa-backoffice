import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

/** Con sesión abierta, /login no tiene sentido: manda al panel. */
@Injectable({ providedIn: 'root' })
export class LoginGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): true | UrlTree {
    return this.auth.isAuthenticated() ? this.router.createUrlTree(['/home']) : true;
  }
}
