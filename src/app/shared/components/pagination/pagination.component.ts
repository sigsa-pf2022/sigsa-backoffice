import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-pagination',
  template: `
    <nav *ngIf="this.pages.length > 0">
      <ul class="pagination justify-content-center">
        <li class="page-item" [class.disabled]="pageSelected === 0">
          <a class="page-link clickable" (click)="previousPage()">Anterior</a>
        </li>
        <li
          class="page-item"
          [class.active]="page === pageSelected"
          *ngFor="let page of this.pages"
        >
          <a class="page-link clickable" (click)="changePage(page)">{{
            page + 1
          }}</a>
        </li>
        <li
          class="page-item"
          [class.disabled]="pageSelected === this.pages.length - 1 "
        >
          <a class="page-link clickable" (click)="nextPage()">Siguiente</a>
        </li>
      </ul>
    </nav>
  `,
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnInit, OnChanges {
  @Input() totalItems: number = 0;
  /**
   * Página que muestra el listado. La necesitamos porque al filtrar el listado
   * vuelve a la primera página y el paginado tiene que acompañar: si no, seguía
   * marcando la 3 mientras se mostraba la 1.
   */
  @Input() page: number = 0;
  @Output() pageChanged = new EventEmitter<number>();
  pages: number[] = [];
  pageSelected = 0;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['totalItems']) {
      this.pages = Array(Math.ceil(this.totalItems / 10))
        .fill(0)
        .map((x, i) => i);
    }
    if (changes['page']) {
      this.pageSelected = this.page;
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
