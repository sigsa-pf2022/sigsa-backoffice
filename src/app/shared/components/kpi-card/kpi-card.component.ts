import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-kpi-card',
  template: `
    <div class="kpi-card">
      <div class="kpi-card__title">{{ title }}</div>
      <div class="kpi-card__value" *ngIf="!loading; else skeleton">
        {{ displayValue }}
      </div>
      <div class="kpi-card__subtitle" *ngIf="!loading">
        {{ subtitle || ' ' }}
      </div>
      <ng-template #skeleton>
        <div class="kpi-card__skeleton sk-bar"></div>
      </ng-template>
    </div>
  `,
  styleUrls: ['./kpi-card.component.scss'],
})
export class KpiCardComponent {
  @Input() title = '';
  @Input() value: number | string | null = null;
  @Input() subtitle = '';
  @Input() loading = false;

  get displayValue(): string {
    if (this.value === null || this.value === undefined) return '—';
    if (typeof this.value === 'number') {
      if (Number.isNaN(this.value)) return '—';
      return this.value.toLocaleString('es-AR');
    }
    return String(this.value);
  }
}
