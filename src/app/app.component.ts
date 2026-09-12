import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'sigsa-backoffice';

  /**
   * La barra superior y el menú lateral están fuera del router-outlet, así que
   * sin esto también se verían en el login. El `startWith` arranca con el
   * estado real de la sesión para que el primer cuadro ya sea el correcto y no
   * haya un parpadeo del menú antes de la primera navegación.
   */
  readonly showChrome$: Observable<boolean> = this.router.events.pipe(
    filter((event): event is NavigationEnd => event instanceof NavigationEnd),
    map((event) => !event.urlAfterRedirects.startsWith('/login')),
    startWith(this.auth.isAuthenticated()),
  );

  constructor(private router: Router, private auth: AuthService) {}
}
