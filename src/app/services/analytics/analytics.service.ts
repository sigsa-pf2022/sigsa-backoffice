import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface DateRange {
  from: string; // YYYY-MM-DD
  to: string;   // YYYY-MM-DD
}

export interface AnalyticsOverview {
  totalUsers: number;
  activeUsers: number;
  totalProfessionals: number;
  totalFamilyGroups: number;
  totalDependents: number;
  activeDependents: number;
  dependentsWithProfessionalLink: number;
  totalAppointments: number;
  totalMedEvents: number;
  totalDocuments: number;
  totalPatientLinks: number;
  from: string;
  to: string;
}

export type Granularity = 'day' | 'week' | 'month';

export interface EventsByPeriod {
  granularity: Granularity;
  labels: string[];
  appointments: number[];
  medEvents: number[];
  documents: number[];
}

export interface TopSpecializations {
  labels: string[];
  counts: number[];
}

export interface FamilyGroupsDistribution {
  averageSize: number;
  distribution: { members: number; count: number }[];
}

export interface PatientsLinkStatus {
  accepted: number;
  pending: number;
  rejected: number;
  total: number;
}

/**
 * "Me hago cargo": cuánto se reparte el grupo familiar el cuidado del
 * dependiente. `responseMinutes` mide desde que salió la push hasta que
 * alguien respondió, y viene en null si no hubo respuestas en el período.
 */
export interface CareCoordination {
  coverage: {
    totalDependentEvents: number;
    takenCharge: number;
    rate: number; // porcentaje
  };
  responseMinutes: {
    median: number | null;
    p90: number | null;
    sampleSize: number;
  };
  byType: {
    appointment: number;
    medEvent: number;
  };
  series: {
    granularity: Granularity;
    labels: string[];
    appointments: number[];
    medEvents: number[];
  };
}

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private readonly base = `${environment.apiUrl}/analytics`;

  constructor(private http: HttpClient) {}

  private params(range: DateRange): HttpParams {
    return new HttpParams().set('from', range.from).set('to', range.to);
  }

  getOverview(range: DateRange): Observable<AnalyticsOverview> {
    return this.http.get<AnalyticsOverview>(`${this.base}/overview`, { params: this.params(range) });
  }

  getEventsByPeriod(range: DateRange): Observable<EventsByPeriod> {
    return this.http.get<EventsByPeriod>(`${this.base}/events-by-period`, { params: this.params(range) });
  }

  getTopSpecializations(range: DateRange): Observable<TopSpecializations> {
    return this.http.get<TopSpecializations>(`${this.base}/top-specializations`, { params: this.params(range) });
  }

  getFamilyGroupsDistribution(range: DateRange): Observable<FamilyGroupsDistribution> {
    return this.http.get<FamilyGroupsDistribution>(
      `${this.base}/family-groups-distribution`,
      { params: this.params(range) },
    );
  }

  getPatientsLinkStatus(range: DateRange): Observable<PatientsLinkStatus> {
    return this.http.get<PatientsLinkStatus>(
      `${this.base}/patients-link-status`,
      { params: this.params(range) },
    );
  }

  getCareCoordination(range: DateRange): Observable<CareCoordination> {
    return this.http.get<CareCoordination>(
      `${this.base}/care-coordination`,
      { params: this.params(range) },
    );
  }
}
