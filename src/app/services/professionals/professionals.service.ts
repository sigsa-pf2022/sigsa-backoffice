import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { listParams } from 'src/app/shared/data/filters/list-filters';

export interface SpecializationsFilters {
  name?: string | null;
  description?: string | null;
  deleted?: boolean | null;
}

export interface ProfessionalsFilters {
  firstName?: string | null;
  lastName?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class ProfessionalsService {
  constructor(private http: HttpClient) {}

  getMonthlyProfessionalsQuantity(): Promise<any[]>{
    return firstValueFrom(this.http.get<any[]>(`${environment.apiUrl}/professionals/monthly-quantity`));
  }

  getProfessionalsSpecializations(
    page: number,
    filters: SpecializationsFilters = {}
  ): Promise<any> {
    return firstValueFrom(
      this.http.get<any>(`${environment.apiUrl}/professionals/specializations`, {
        params: listParams(page, { deleted: false, ...filters }),
      })
    );
  }

  getProfessionals(
    page: number,
    filters: ProfessionalsFilters = {}
  ): Promise<any> {
    return firstValueFrom(
      this.http.get<any>(`${environment.apiUrl}/professionals/dashboard`, {
        params: listParams(page, filters),
      })
    );
  }

  getProfessionalsSpecializationById(id: number): Promise<any[]> {
    return firstValueFrom(
      this.http.get<any[]>(
        `${environment.apiUrl}/professionals/specializations/${id}`
      )
    );
  }

  createProfessionalsSpecialization(body: any): Promise<any[]> {
    return firstValueFrom(
      this.http.post<any[]>(
        `${environment.apiUrl}/professionals/specializations`,
        body
      )
    );
  }
  updateProfessionalsSpecialization(id: number, body: any): Promise<any> {
    return firstValueFrom(
      this.http.put<any>(
        `${environment.apiUrl}/professionals/specializations/${id}`,
        body
      )
    );
  }

  deleteProfessionalsSpecialization(id: number): Promise<any> {
    return firstValueFrom(
      this.http.delete<any>(
        `${environment.apiUrl}/professionals/specializations/${id}`
      )
    );
  }

  recoverProfessionalsSpecialization(id: number): Promise<any> {
    return firstValueFrom(
      this.http.put<any>(
        `${environment.apiUrl}/professionals/specializations/recover/${id}`,
        {}
      )
    );
  }
}
