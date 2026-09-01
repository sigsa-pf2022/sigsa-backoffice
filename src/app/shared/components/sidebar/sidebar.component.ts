import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { MODULES, Module, Submodule } from '../../data/constants/modules.constant';

@Component({
  selector: 'app-sidebar',
  template: `
    <aside class="sidebar">
      <nav class="sidebar__nav">
        <ng-container *ngFor="let module of modules">
          <!-- Módulo sin submódulos: navega directo -->
          <a
            *ngIf="!module.submodules"
            class="sidebar__item"
            [class.sidebar__item--active]="isModuleActive(module)"
            [routerLink]="'/' + module.route"
          >
            <i class="bi bi-{{ module.icon }} sidebar__icon"></i>
            <span>{{ module.name }}</span>
          </a>

          <!-- Módulo con submódulos: grupo desplegable -->
          <div *ngIf="module.submodules" class="sidebar__group">
            <button
              type="button"
              class="sidebar__item sidebar__item--group"
              [class.sidebar__item--active]="isModuleActive(module) && !isOpen(module)"
              [attr.aria-expanded]="isOpen(module)"
              (click)="toggle(module)"
            >
              <i class="bi bi-{{ module.icon }} sidebar__icon"></i>
              <span>{{ module.name }}</span>
              <i
                class="bi bi-chevron-down sidebar__chevron"
                [class.sidebar__chevron--open]="isOpen(module)"
              ></i>
            </button>

            <div class="sidebar__sublist" *ngIf="isOpen(module)">
              <a
                *ngFor="let submodule of module.submodules"
                class="sidebar__subitem"
                [class.sidebar__subitem--active]="activeSubmodule === submodule.value"
                [routerLink]="'/' + submodule.route"
              >
                {{ submodule.name }}
              </a>
            </div>
          </div>
        </ng-container>
      </nav>
    </aside>
  `,
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  modules = MODULES;
  /** `value` del submódulo que corresponde a la URL actual. */
  activeSubmodule: string | null = null;
  private openModules = new Set<string>();
  private sub?: Subscription;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.sync(this.router.url);
    this.sub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => this.sync(e.urlAfterRedirects));
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  isOpen(module: Module): boolean {
    return this.openModules.has(module.value);
  }

  isModuleActive(module: Module): boolean {
    if (module.submodules) {
      return module.submodules.some((s) => s.value === this.activeSubmodule);
    }
    return !!module.route && this.router.url.startsWith('/' + module.route);
  }

  toggle(module: Module): void {
    if (this.openModules.has(module.value)) {
      this.openModules.delete(module.value);
    } else {
      this.openModules.add(module.value);
    }
  }

  /**
   * Resuelve qué submódulo está activo y abre su grupo.
   *
   * Las rutas de alta y edición (`modules/meds/create`) no coinciden con
   * ninguna ruta de submódulo, así que se compara contra el prefijo del listado
   * y gana el más largo: `/modules/meds/type/create` matchea tanto
   * `modules/meds` como `modules/meds/type`, y el correcto es el segundo.
   */
  private sync(url: string): void {
    let best: { submodule: Submodule; module: Module; length: number } | null = null;

    for (const module of this.modules) {
      for (const submodule of module.submodules ?? []) {
        const base = '/' + submodule.route.replace(/\/list$/, '');
        if (url.startsWith(base) && (!best || base.length > best.length)) {
          best = { submodule, module, length: base.length };
        }
      }
    }

    this.activeSubmodule = best?.submodule.value ?? null;
    if (best) {
      this.openModules.add(best.module.value);
    }
  }
}
