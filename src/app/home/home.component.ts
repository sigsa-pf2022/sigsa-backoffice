import { Component } from '@angular/core';
import {
  AnalyticsOverview,
  AnalyticsService,
  CareCoordination,
  DateRange,
  EventsByPeriod,
  FamilyGroupsDistribution,
  PatientsLinkStatus,
  TopSpecializations,
} from '../services/analytics/analytics.service';
import { BarchartDataset } from '../shared/components/barchart/barchart.component';
import { RangeValue } from '../shared/components/date-range-selector/date-range-selector.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  range: RangeValue = {
    from: '',
    to: '',
    preset: 'month',
  };

  // KPIs
  overview: AnalyticsOverview | null = null;
  linkStatus: PatientsLinkStatus | null = null;
  fgDistribution: FamilyGroupsDistribution | null = null;

  loadingOverview = false;
  loadingLinkStatus = false;
  loadingFgDistribution = false;

  // Chart: events by period
  eventsByPeriod: EventsByPeriod | null = null;
  eventsDatasets: BarchartDataset[] = [];
  loadingEvents = false;

  // Chart: top specializations
  topSpecializations: TopSpecializations | null = null;
  specializationsDatasets: BarchartDataset[] = [];
  loadingSpecializations = false;

  // Chart: family group distribution
  fgDistributionLabels: string[] = [];
  fgDistributionDatasets: BarchartDataset[] = [];

  // "Me hago cargo": corresponsabilidad del grupo familiar
  careCoordination: CareCoordination | null = null;
  careDatasets: BarchartDataset[] = [];
  loadingCare = false;

  constructor(private analyticsService: AnalyticsService) {}

  onRangeChange(range: RangeValue): void {
    this.range = range;
    this.reloadAll();
  }

  private get apiRange(): DateRange {
    return { from: this.range.from, to: this.range.to };
  }

  private reloadAll(): void {
    if (!this.range.from || !this.range.to) return;
    this.loadOverview();
    this.loadLinkStatus();
    this.loadEvents();
    this.loadTopSpecializations();
    this.loadFamilyGroupsDistribution();
    this.loadCareCoordination();
  }

  private loadOverview(): void {
    this.loadingOverview = true;
    this.analyticsService.getOverview(this.apiRange).subscribe({
      next: (data) => {
        this.overview = data;
        this.loadingOverview = false;
      },
      error: (err) => {
        console.error('Error loading overview', err);
        this.loadingOverview = false;
      },
    });
  }

  private loadLinkStatus(): void {
    this.loadingLinkStatus = true;
    this.analyticsService.getPatientsLinkStatus(this.apiRange).subscribe({
      next: (data) => {
        this.linkStatus = data;
        this.loadingLinkStatus = false;
      },
      error: (err) => {
        console.error('Error loading link status', err);
        this.loadingLinkStatus = false;
      },
    });
  }

  private loadEvents(): void {
    this.loadingEvents = true;
    this.analyticsService.getEventsByPeriod(this.apiRange).subscribe({
      next: (data) => {
        this.eventsByPeriod = data;
        this.eventsDatasets = [
          { label: 'Turnos', data: data.appointments ?? [], color: 'rgb(54, 162, 235)' },
          { label: 'Recordatorios', data: data.medEvents ?? [], color: 'rgb(255, 159, 64)' },
          { label: 'Documentos', data: data.documents ?? [], color: 'rgb(75, 192, 192)' },
        ];
        this.loadingEvents = false;
      },
      error: (err) => {
        console.error('Error loading events', err);
        this.eventsDatasets = [];
        this.loadingEvents = false;
      },
    });
  }

  private loadTopSpecializations(): void {
    this.loadingSpecializations = true;
    this.analyticsService.getTopSpecializations(this.apiRange).subscribe({
      next: (data) => {
        this.topSpecializations = data;
        this.specializationsDatasets = [
          {
            label: 'Turnos',
            data: data.counts ?? [],
            color: 'rgb(153, 102, 255)',
          },
        ];
        this.loadingSpecializations = false;
      },
      error: (err) => {
        console.error('Error loading top specializations', err);
        this.specializationsDatasets = [];
        this.loadingSpecializations = false;
      },
    });
  }

  private loadFamilyGroupsDistribution(): void {
    this.loadingFgDistribution = true;
    this.analyticsService.getFamilyGroupsDistribution(this.apiRange).subscribe({
      next: (data) => {
        this.fgDistribution = data;
        const dist = data.distribution ?? [];
        this.fgDistributionLabels = dist.map(
          (d) => `${d.members} ${d.members === 1 ? 'miembro' : 'miembros'}`,
        );
        this.fgDistributionDatasets = [
          {
            label: 'Cantidad de grupos',
            data: dist.map((d) => d.count),
            color: 'rgb(255, 206, 86)',
          },
        ];
        this.loadingFgDistribution = false;
      },
      error: (err) => {
        console.error('Error loading family groups distribution', err);
        this.fgDistributionDatasets = [];
        this.loadingFgDistribution = false;
      },
    });
  }

  private loadCareCoordination(): void {
    this.loadingCare = true;
    this.analyticsService.getCareCoordination(this.apiRange).subscribe({
      next: (data) => {
        this.careCoordination = data;
        this.careDatasets = [
          { label: 'Turnos', data: data.series?.appointments ?? [], color: 'rgb(153, 102, 255)' },
          { label: 'Medicación', data: data.series?.medEvents ?? [], color: 'rgb(255, 159, 64)' },
        ];
        this.loadingCare = false;
      },
      error: (err) => {
        console.error('Error loading care coordination', err);
        this.careDatasets = [];
        this.loadingCare = false;
      },
    });
  }

  /** Porcentaje de eventos de dependientes que alguien del grupo tomó. */
  get coverageRate(): string | null {
    const c = this.careCoordination?.coverage;
    if (!c || !c.totalDependentEvents) return null;
    return `${c.rate.toLocaleString('es-AR')} %`;
  }

  get coverageSubtitle(): string {
    const c = this.careCoordination?.coverage;
    if (!c) return '';
    if (!c.totalDependentEvents) return 'sin eventos de dependientes en el período';
    return `${c.takenCharge} de ${c.totalDependentEvents} eventos de dependientes`;
  }

  get responseTime(): string | null {
    const r = this.careCoordination?.responseMinutes;
    if (!r || r.median === null) return null;
    return `${r.median.toLocaleString('es-AR')} min`;
  }

  get responseTimeSubtitle(): string {
    const r = this.careCoordination?.responseMinutes;
    if (!r) return '';
    if (!r.sampleSize) return 'sin respuestas en el período';
    const p90 = r.p90 !== null ? `, p90 ${r.p90.toLocaleString('es-AR')} min` : '';
    return `sobre ${r.sampleSize} ${r.sampleSize === 1 ? 'respuesta' : 'respuestas'}${p90}`;
  }

  get takeChargeTotal(): number | null {
    const t = this.careCoordination?.byType;
    if (!t) return null;
    return t.appointment + t.medEvent;
  }

  get takeChargeSubtitle(): string {
    const t = this.careCoordination?.byType;
    if (!t) return '';
    return `${t.appointment} en turnos · ${t.medEvent} en medicación`;
  }

  get careLabels(): string[] {
    return this.careCoordination?.series?.labels ?? [];
  }

  get careTitle(): string {
    const g = this.careCoordination?.series?.granularity;
    if (g === 'day') return '"Me hago cargo" por día';
    if (g === 'week') return '"Me hago cargo" por semana';
    return '"Me hago cargo" por mes';
  }

  get topSpecializationLabels(): string[] {
    return this.topSpecializations?.labels ?? [];
  }

  get eventsLabels(): string[] {
    return this.eventsByPeriod?.labels ?? [];
  }

  get eventsTitle(): string {
    const g = this.eventsByPeriod?.granularity;
    if (g === 'day') return 'Eventos creados por día';
    if (g === 'week') return 'Eventos creados por semana';
    return 'Eventos creados por mes';
  }

  get topSpecializationsTitle(): string {
    return 'Top 5 especializaciones (por turnos en el período)';
  }
}
