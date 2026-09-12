import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  /**
   * El dashboard dispara seis llamadas de analytics en paralelo: sin esta
   * bandera, un token vencido produciría seis cierres de sesión y seis
   * navegaciones encimadas.
   */
  private redirecting = false;

  constructor(private auth: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isApi = req.url.startsWith(environment.apiUrl);
    const isLogin = req.url.includes('/auth/login');
    const token = this.auth.token();

    const authorized =
      isApi && !isLogin && token
        ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
        : req;

    return next.handle(authorized).pipe(
      catchError((err: HttpErrorResponse) => {
        if (!isLogin && err.status === 401) {
          this.describe(err, 'Tu sesión expiró. Ingresá de nuevo.');
          this.forceLogout();
        } else if (!isLogin && err.status === 403) {
          // A diferencia del 401, acá la sesión es válida: sólo falta permiso
          // para ese endpoint. Si desloguearamos, un guard mal puesto en el
          // backend echaría al operador apenas entra, y el panel entero
          // quedaría inusable por una sola ruta mal configurada.
          this.describe(err, 'Tu cuenta no tiene permisos para esta operación.');
        }
        // Se re-emite el error original: las pantallas de alta y edición hacen
        // `.catch(({ error }) => ...)` y dependen de esa forma.
        return throwError(() => err);
      }),
    );
  }

  /** Reemplaza el mensaje en inglés de Nest por uno legible. */
  private describe(err: HttpErrorResponse, message: string): void {
    if (err.error && typeof err.error === 'object') {
      err.error.message = message;
    }
  }

  private forceLogout(): void {
    if (this.redirecting) return;
    this.redirecting = true;
    this.auth.logout();
    this.router
      .navigate(['/login'], { queryParams: { reason: 'expired' }, replaceUrl: true })
      .then(() => (this.redirecting = false));
  }
}
