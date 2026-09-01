import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Chart, ChartType, registerables } from 'chart.js';
import 'chart.js/auto';

export interface BarchartDataset {
  label: string;
  data: number[];
  color: string;
}

/**
 * Paleta de los gráficos. Son los mismos colores con los que el front tiñe
 * cada concepto (violeta = medicación, ámbar = turnos, celeste = documentos),
 * así un turno se ve igual en la app y en el dashboard.
 *
 * Se declaran como `rgb()` porque toRgba() los convierte al relleno traslúcido.
 */
export const CHART_COLORS = {
  appointment: 'rgb(217, 119, 6)',   // #d97706 — ámbar de turnos
  medication: 'rgb(115, 56, 173)',   // #7338ad — sigsa-700, medicación
  document: 'rgb(3, 105, 161)',      // #0369a1 — celeste de documentos
  primary: 'rgb(156, 89, 232)',      // #9c59e8 — sigsa-500
  success: 'rgb(16, 185, 129)',      // #10b981 — color-success
  neutral: 'rgb(107, 114, 128)',     // #6B7280 — color-text-secondary
};

Chart.register(...registerables);

// Defaults del tema, para no repetirlos en cada gráfico.
Chart.defaults.font.family =
  "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
Chart.defaults.font.size = 11;
Chart.defaults.color = '#9CA3AF';

@Component({
  selector: 'app-barchart',
  template: `
    <div class="chart-container">
      <h5 *ngIf="title">{{ title }}</h5>
      <div *ngIf="loading" class="chart-state">Cargando…</div>
      <div *ngIf="!loading && empty" class="chart-state">Sin datos para mostrar</div>
      <canvas #canvas [hidden]="loading || empty"></canvas>
    </div>
  `,
  styleUrls: ['./barchart.component.scss'],
})
export class BarchartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() title = '';
  @Input() labels: string[] = [];
  @Input() datasets: BarchartDataset[] = [];
  @Input() type: ChartType = 'bar';
  @Input() horizontal = false;
  @Input() stacked = false;
  @Input() loading = false;

  // Legacy inputs kept for backwards compatibility (original users/profs chart).
  @Input() usersData: number[] | null = null;
  @Input() professionalsData: number[] | null = null;

  @ViewChild('canvas', { static: false }) canvasRef?: ElementRef<HTMLCanvasElement>;

  chart: Chart | undefined;
  private viewReady = false;

  get empty(): boolean {
    const ds = this.resolveDatasets();
    return !ds.length || ds.every((d) => !d.data?.some((v) => v > 0));
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    if (!this.loading) this.renderChart();
  }

  ngOnChanges(_changes: SimpleChanges): void {
    if (this.viewReady && !this.loading) this.renderChart();
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  private resolveDatasets(): BarchartDataset[] {
    if (this.datasets?.length) return this.datasets;
    // Legacy path: build datasets from usersData/professionalsData if present.
    const legacy: BarchartDataset[] = [];
    if (this.usersData) {
      legacy.push({ label: 'Usuarios', data: this.usersData, color: CHART_COLORS.primary });
    }
    if (this.professionalsData) {
      legacy.push({
        label: 'Profesionales',
        data: this.professionalsData,
        color: CHART_COLORS.document,
      });
    }
    return legacy;
  }

  private renderChart(): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;
    const datasets = this.resolveDatasets();
    if (this.empty) {
      this.chart?.destroy();
      this.chart = undefined;
      return;
    }

    const chartDatasets = datasets.map((d) => ({
      label: d.label,
      data: d.data,
      backgroundColor: this.toRgba(d.color, 0.18),
      borderColor: d.color,
      borderWidth: 1,
      borderRadius: 6,
      maxBarThickness: 28,
      stack: this.stacked ? 'stack-0' : undefined,
    }));

    if (this.chart) {
      this.chart.data.labels = this.labels;
      this.chart.data.datasets = chartDatasets as any;
      this.chart.update();
      return;
    }

    this.chart = new Chart(canvas, {
      type: this.type,
      data: { labels: this.labels, datasets: chartDatasets as any },
      options: {
        indexAxis: this.horizontal ? 'y' : 'x',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: datasets.length > 1,
            position: 'bottom',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              boxWidth: 8,
              boxHeight: 8,
              padding: 16,
              color: '#6B7280',
              font: { size: 12, weight: '500' },
            },
          },
          tooltip: {
            backgroundColor: '#18181B',
            titleColor: '#ffffff',
            bodyColor: '#E5E5E8',
            padding: 10,
            cornerRadius: 10,
            displayColors: true,
            usePointStyle: true,
            boxPadding: 4,
          },
        },
        scales: {
          x: {
            stacked: this.stacked,
            beginAtZero: true,
            grid: { color: '#F0F0F3', drawBorder: false },
            ticks: { color: '#9CA3AF' },
          },
          y: {
            stacked: this.stacked,
            beginAtZero: true,
            grid: { color: '#F0F0F3', drawBorder: false },
            ticks: { color: '#9CA3AF', precision: 0 },
          },
        },
      },
    });
  }

  /**
   * Convierte el color de la serie en su relleno traslúcido.
   * Acepta `rgb()` y hex de 3 o 6 dígitos: si sólo parseara `rgb()`, un hex
   * pasaría de largo y el relleno quedaría opaco sin que nada avise.
   */
  private toRgba(color: string, alpha: number): string {
    const rgbMatch = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
    if (rgbMatch) return `rgba(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}, ${alpha})`;

    const hexMatch = color.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (hexMatch) {
      let hex = hexMatch[1];
      if (hex.length === 3) {
        hex = hex.split('').map((c) => c + c).join('');
      }
      const int = parseInt(hex, 16);
      // eslint-disable-next-line no-bitwise
      return `rgba(${(int >> 16) & 255}, ${(int >> 8) & 255}, ${int & 255}, ${alpha})`;
    }

    return color;
  }
}
