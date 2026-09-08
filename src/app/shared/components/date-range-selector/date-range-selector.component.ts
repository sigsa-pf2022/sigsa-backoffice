import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export type RangePreset = 'week' | 'month' | 'year' | 'custom';

export interface RangeValue {
  from: string; // YYYY-MM-DD
  to: string;   // YYYY-MM-DD
  preset: RangePreset;
}

const DAY_MS = 86400000;

function toYmd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

@Component({
  selector: 'app-date-range-selector',
  template: `
    <div class="range-selector">
      <div class="range-selector__presets" role="group" aria-label="Rango temporal">
        <button
          type="button"
          *ngFor="let p of presets"
          class="range-selector__btn"
          [class.range-selector__btn--active]="value.preset === p.value"
          (click)="selectPreset(p.value)"
        >
          {{ p.label }}
        </button>
      </div>

      <div class="range-selector__custom" *ngIf="value.preset === 'custom'">
        <label>
          <span>Desde</span>
          <input
            type="date"
            [value]="value.from"
            [max]="value.to"
            (change)="onFromChange($event)"
          />
        </label>
        <label>
          <span>Hasta</span>
          <input
            type="date"
            [value]="value.to"
            [min]="value.from"
            [max]="todayYmd"
            (change)="onToChange($event)"
          />
        </label>
      </div>
    </div>
  `,
  styleUrls: ['./date-range-selector.component.scss'],
})
export class DateRangeSelectorComponent implements OnInit {
  @Input() value: RangeValue = this.computePresetRange('month');
  @Output() valueChange = new EventEmitter<RangeValue>();

  presets: { value: RangePreset; label: string }[] = [
    { value: 'week', label: 'Última semana' },
    { value: 'month', label: 'Último mes' },
    { value: 'year', label: 'Último año' },
    { value: 'custom', label: 'Personalizado' },
  ];

  todayYmd = toYmd(new Date());

  ngOnInit(): void {
    // El padre puede pasarnos sólo el preset, sin fechas. Si emitimos eso tal
    // cual, la primera carga se cancela por falta de rango y el dashboard queda
    // con todos los KPIs en "—" hasta que tocás un botón.
    if (!this.value?.from || !this.value?.to) {
      this.value = this.computePresetRange(this.value?.preset ?? 'month');
    }
    // Emit initial value so parent kicks off its first load consistently.
    this.valueChange.emit(this.value);
  }

  selectPreset(preset: RangePreset): void {
    if (preset === 'custom') {
      // Seed the custom inputs with the currently displayed range.
      this.value = { ...this.value, preset };
    } else {
      this.value = this.computePresetRange(preset);
    }
    this.valueChange.emit(this.value);
  }

  onFromChange(ev: Event): void {
    const v = (ev.target as HTMLInputElement).value;
    if (!v) return;
    const next = { ...this.value, from: v, preset: 'custom' as RangePreset };
    if (next.from > next.to) next.to = next.from;
    this.value = next;
    this.valueChange.emit(this.value);
  }

  onToChange(ev: Event): void {
    const v = (ev.target as HTMLInputElement).value;
    if (!v) return;
    const next = { ...this.value, to: v, preset: 'custom' as RangePreset };
    if (next.to < next.from) next.from = next.to;
    this.value = next;
    this.valueChange.emit(this.value);
  }

  private computePresetRange(preset: RangePreset): RangeValue {
    const today = new Date();
    const to = toYmd(today);
    let daysBack = 30;
    if (preset === 'week') daysBack = 7;
    else if (preset === 'month') daysBack = 30;
    else if (preset === 'year') daysBack = 365;
    const fromDate = new Date(today.getTime() - daysBack * DAY_MS);
    return { from: toYmd(fromDate), to, preset };
  }
}
