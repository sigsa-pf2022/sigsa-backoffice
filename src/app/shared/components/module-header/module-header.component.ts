import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-module-header',
  template: ` <div class="mh">
    <div class="mh__content">
      <div class="mh__content__title">
        <h2>{{ title }}</h2>
        <button class="btn btn-success" (click)="this.goToCreate()">
          <i class="bi bi-plus fs-4"></i>
        </button>
      </div>
    </div>
    <ng-content></ng-content>
  </div>`,
  styleUrls: ['./module-header.component.scss'],
})
export class ModuleHeaderComponent implements OnInit {
  @Input() title: string = '';
  @Input() route: string = '';
  constructor(private router: Router) {}

  ngOnInit(): void {}

  goToCreate(){
    this.router.navigateByUrl(this.route)
  }
}
