import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

/**
 * Deja pasar sólo con sesión de administrador.
 *
 * Implementa las tres variantes a propósito: `canActivate` no se vuelve a
 * ejecutar al navegar entre rutas hijas de `modules` (Angular reusa la ruta
 * padre), así que sin `canActivateChild` una sesión que vence a mitad de uso
 * no se detectaría hasta el próximo 401. `canLoad` evita además descargar el
 * bundle del módulo sin estar autenticado.
 */
@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(private auth: AuthService, private router: Router) {}

  private check(returnUrl: string): true | UrlTree {
    if (this.auth.isAuthenticated()) return true;
    return this.router.createUrlTree(['/login'], { queryParams: { returnUrl } });
  }

  canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.check(state.url);
  }

  canActivateChild(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.check(state.url);
  }

  canLoad(_route: Route, segments: UrlSegment[]) {
    return this.check('/' + segments.map((s) => s.path).join('/'));
  }
}
