import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MODULES } from '../../data/constants/modules.constant';

@Component({
  selector: 'app-sidebar',
  template: `
    <aside>
      <div class="accordion accordion-flush sidebar" id="sidebar-acordion">
        <div class="accordion-item sidebar__module" *ngFor="let module of modules">
          <h2 class="accordion-header" id="flush-headingOne">
            <button
              *ngIf="this.module.submodules"
              class="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              [attr.data-bs-target]="'#' + module.value"
              aria-expanded="false"
              aria-controls="flush-collapseOne"
            >
              {{ module.name }}
            </button>
            <button
              *ngIf="!this.module.submodules"
              class="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              [attr.data-bs-target]="'#' + module.value"
              aria-expanded="false"
              aria-controls="flush-collapseOne"
              (click)="navigateByUrl('home')"
            >
              {{ module.name }}
            </button>
          </h2>
          <div
            [id]="module.value"
            class="accordion-collapse collapse"
            aria-labelledby="flush-headingOne"
            data-bs-parent="#sidebar-acordion"
          >
            <div
              class="accordion-body"
              *ngFor="let submodule of module.submodules"
              (click)="navigateByUrl(submodule.route)"
            >
              {{ submodule.name }}
            </div>
          </div>
        </div>
      </div>
    </aside>
  `,
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  modules = MODULES;
  constructor(private router: Router) {}

  ngOnInit(): void {}

  navigateByUrl(value: string) {
    this.router.navigateByUrl(value);
  }
}
