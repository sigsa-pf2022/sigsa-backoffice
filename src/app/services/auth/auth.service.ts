import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

export type UserRole = 'user' | 'professional' | 'admin';

export interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

/**
 * Claves con prefijo propio: la app móvil guarda su sesión en `jwt` y `user`,
 * y si algún día las dos se sirven desde el mismo host se pisarían entre sí.
 */
const TOKEN_KEY = 'sigsa.bo.jwt';
const USER_KEY = 'sigsa.bo.user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly userSubject = new BehaviorSubject<AuthUser | null>(this.readUser());

  /** El navbar vive fuera del router-outlet y no se recrea al navegar. */
  readonly user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * El backend emite token para cualquier rol, así que el filtro de
   * administrador se hace acá antes de persistir nada: una cuenta que no es
   * admin no deja sesión a medias. Es sólo la mitad de la historia — el
   * control real lo hacen los guards del backend.
   */
  async login(credentials: { email: string; password: string }): Promise<AuthUser> {
    const res = await firstValueFrom(
      this.http.post<{ access_token: string; user: any }>(
        `${environment.apiUrl}/auth/login`,
        credentials,
      ),
    );

    if (res?.user?.role !== 'admin') {
      throw new Error('Esta cuenta no tiene permisos de administrador.');
    }

    const user: AuthUser = {
      id: res.user.id,
      email: res.user.email,
      firstName: res.user.firstName,
      lastName: res.user.lastName,
      role: res.user.role,
    };
    localStorage.setItem(TOKEN_KEY, res.access_token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.userSubject.next(user);
    return user;
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.userSubject.next(null);
  }

  token(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  user(): AuthUser | null {
    return this.userSubject.value;
  }

  /**
   * Se mira la expiración del propio token para no pintar el dashboard y
   * recién después ser expulsado por el primer 401.
   */
  isAuthenticated(): boolean {
    const token = this.token();
    if (!token || this.isExpired(token)) {
      if (token) this.logout();
      return false;
    }
    return this.user()?.role === 'admin';
  }

  initials(user: AuthUser | null): string {
    if (!user) return 'SA';
    const first = user.firstName?.charAt(0) ?? '';
    const last = user.lastName?.charAt(0) ?? '';
    return (first + last).toUpperCase() || 'SA';
  }

  private readUser(): AuthUser | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  }

  private isExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return typeof payload.exp === 'number' && payload.exp * 1000 <= Date.now();
    } catch {
      // Token ilegible: se trata como sesión inexistente.
      return true;
    }
  }
}
