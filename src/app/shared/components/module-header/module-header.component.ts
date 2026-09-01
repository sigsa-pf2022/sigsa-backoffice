import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-module-header',
  template: ` <div class="mh">
    <div class="mh__title">
      <h1 class="page-title">{{ title }}</h1>
      <div class="mh__actions">
        <button
          type="button"
          class="btn btn-icon btn-icon--lg"
          [class.btn-icon--active]="this.showF"
          (click)="this.toggleFilters()"
          [attr.aria-pressed]="this.showF"
          aria-label="Mostrar u ocultar filtros"
          title="Filtros"
        >
          <i class="bi bi-funnel"></i>
        </button>
        <button
          *ngIf="this.showCreation"
          type="button"
          class="btn btn-primary"
          (click)="this.goToCreate()"
        >
          <i class="bi bi-plus-lg"></i>
          Nuevo
        </button>
      </div>
    </div>
    <ng-content></ng-content>
  </div>`,
  styleUrls: ['./module-header.component.scss'],
})
export class ModuleHeaderComponent {
  @Input() title: string = '';
  @Input() route: string = '';
  @Input() showCreation: boolean = true;
  @Output() showFilters = new EventEmitter<boolean>();
  showF = true;

  constructor(private router: Router) {}

  goToCreate() {
    this.router.navigateByUrl(this.route);
  }

  toggleFilters() {
    this.showF = !this.showF;
    this.showFilters.emit(this.showF);
  }
}
