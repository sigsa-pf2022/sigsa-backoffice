import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-pagination',
  template: `
    <nav *ngIf="this.pages">
      <ul class="pagination justify-content-center">
        <li class="page-item" [class.disabled]="pageSelected === 0">
          <a class="page-link clickable" (click)="previousPage()">Previous</a>
        </li>
        <li class="page-item" [class.active]="page === pageSelected" *ngFor="let page of this.pages">
          <a class="page-link clickable" (click)="changePage(page)">{{ page + 1 }}</a>
        </li>
        <li class="page-item" [class.disabled]="pageSelected === this.pages.length - 1">
          <a class="page-link clickable" (click)="nextPage()">Next</a>
        </li>
      </ul>
    </nav>
  `,
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnInit, OnChanges {
  @Input() totalItems: number = 0;
  @Output() pageChanged = new EventEmitter<number>();
  pages: any;
  pageSelected = 0;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (!this.pages && Number(changes['totalItems'].currentValue) > 0) {
      this.pages = Array(Math.ceil(Number(changes['totalItems'].currentValue / 3)))
        .fill(0)
        .map((x, i) => i);
    }
  }

  changePage(page: number) {
    this.pageSelected = page;
    this.sendPage();
  }

  previousPage() {
    this.pageSelected--;
    this.sendPage();
  }
  nextPage() {
    this.pageSelected++;
    this.sendPage();
  }

  sendPage() {
    this.pageChanged.emit(this.pageSelected);
  }
}
