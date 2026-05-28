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

Chart.register(...registerables);

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
      legacy.push({ label: 'Usuarios', data: this.usersData, color: 'rgb(54, 162, 235)' });
    }
    if (this.professionalsData) {
      legacy.push({ label: 'Profesionales', data: this.professionalsData, color: 'rgb(255, 99, 132)' });
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
      backgroundColor: this.toRgba(d.color, 0.2),
      borderColor: d.color,
      borderWidth: 1,
      maxBarThickness: 30,
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
        scales: {
          x: { stacked: this.stacked, beginAtZero: true },
          y: { stacked: this.stacked, beginAtZero: true },
        },
      },
    });
  }

  private toRgba(color: string, alpha: number): string {
    const rgbMatch = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/i);
    if (rgbMatch) return `rgba(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}, ${alpha})`;
    return color;
  }
}
