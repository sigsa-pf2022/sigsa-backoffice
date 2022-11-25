import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-module-header',
  template: ` <div class="mh">
    <div class="mh__content">
      <div class="mh__content__title">
        <h2>{{ title }}</h2>
        <div class="d-flex gap-3">
          <button class="btn" (click)="this.toggleFilters()">
            <i class="bi bi-funnel fs-4"></i>
          </button>
          <button class="btn btn-success" (click)="this.goToCreate()">
            <i class="bi bi-plus fs-4"></i>
          </button>
        </div>
      </div>
    </div>
    <ng-content></ng-content>
  </div>`,
  styleUrls: ['./module-header.component.scss'],
})
export class ModuleHeaderComponent implements OnInit {
  @Input() title: string = '';
  @Input() route: string = '';
  @Output() showFilters = new EventEmitter<boolean>();
  showF = true;
  constructor(private router: Router) {}

  ngOnInit(): void {}

  goToCreate() {
    this.router.navigateByUrl(this.route);
  }
  toggleFilters() {
    this.showF = !this.showF;
    this.showFilters.emit(this.showF);
  }
}
