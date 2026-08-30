import { Component, Input } from '@angular/core';

/**
 * Filas fantasma para las tablas de los listados mientras llega la respuesta
 * del backend. Selector de atributo para poder aplicarse sobre un <tbody> y
 * seguir siendo HTML válido dentro de <table>.
 *
 * Uso:
 *   <tbody appTableSkeleton *ngIf="loading" [rows]="10" [cols]="4"></tbody>
 */
@Component({
  selector: 'tbody[appTableSkeleton]',
  template: `
    <tr *ngFor="let row of rowsArray" class="sk-fade-in">
      <td *ngFor="let col of colsArray"><span class="sk-bar"></span></td>
    </tr>
  `,
  styleUrls: ['./table-skeleton.component.scss'],
})
export class TableSkeletonComponent {
  rowsArray: number[] = TableSkeletonComponent.range(10);
  colsArray: number[] = TableSkeletonComponent.range(4);

  @Input() set rows(value: number) {
    this.rowsArray = TableSkeletonComponent.range(value, 10);
  }

  @Input() set cols(value: number) {
    this.colsArray = TableSkeletonComponent.range(value, 4);
  }

  private static range(value: number, fallback = 1): number[] {
    const total = Number(value) > 0 ? Number(value) : fallback;
    return Array.from({ length: total }, (_, i) => i);
  }
}
