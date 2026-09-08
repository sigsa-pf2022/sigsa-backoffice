import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { listParams } from 'src/app/shared/data/filters/list-filters';

/** Filtros del catálogo: nombre + el check de "deshabilitado". */
export interface CatalogFilters {
  name?: string | null;
  description?: string | null;
  deleted?: boolean | null;
}

export interface MedsFilters extends CatalogFilters {
  drug?: number | string | null;
  type?: number | string | null;
  shape?: number | string | null;
  measurementUnit?: number | string | null;
}

@Injectable({
  providedIn: 'root',
})
export class MedsService {
  constructor(private http: HttpClient) {}

  // FORMAS
  getAllMedsForms(): Promise<any> {
    return firstValueFrom(
      this.http.get<any>(`${environment.apiUrl}/meds-shape/all`)
    );
  }
  getMedsForms(page: number, filters: CatalogFilters = {}): Promise<any> {
    return firstValueFrom(
      this.http.get<any>(`${environment.apiUrl}/meds-shape`, {
        params: listParams(page, filters),
      })
    );
  }

  getMedsFormById(id: number): Promise<any[]> {
    return firstValueFrom(
      this.http.get<any[]>(`${environment.apiUrl}/meds-shape/${id}`)
    );
  }

  createMedsForm(body: any): Promise<any[]> {
    return firstValueFrom(
      this.http.post<any[]>(`${environment.apiUrl}/meds-shape`, body)
    );
  }
  updateMedsForm(id: number, body: any): Promise<any> {
    return firstValueFrom(
      this.http.put<any>(`${environment.apiUrl}/meds-shape/${id}`, body)
    );
  }

  deleteMedsForm(id: number): Promise<any> {
    return firstValueFrom(
      this.http.delete<any>(`${environment.apiUrl}/meds-shape/${id}`)
    );
  }

  // TIPOS

  getAllMedsTypes(): Promise<any> {
    return firstValueFrom(
      this.http.get<any>(`${environment.apiUrl}/meds-type/all`)
    );
  }
  getMedsTypes(page: number, filters: CatalogFilters = {}): Promise<any> {
    return firstValueFrom(
      this.http.get<any>(`${environment.apiUrl}/meds-type`, {
        params: listParams(page, filters),
      })
    );
  }

  getMedsTypeById(id: number): Promise<any[]> {
    return firstValueFrom(
      this.http.get<any[]>(`${environment.apiUrl}/meds-type/${id}`)
    );
  }

  createMedsType(body: any): Promise<any[]> {
    return firstValueFrom(
      this.http.post<any[]>(`${environment.apiUrl}/meds-type`, body)
    );
  }
  updateMedsType(id: number, body: any): Promise<any> {
    return firstValueFrom(
      this.http.put<any>(`${environment.apiUrl}/meds-type/${id}`, body)
    );
  }

  deleteMedsType(id: number): Promise<any> {
    return firstValueFrom(
      this.http.delete<any>(`${environment.apiUrl}/meds-type/${id}`)
    );
  }

  // DROGAS
  getAllMedsDrugs(): Promise<any> {
    return firstValueFrom(
      this.http.get<any>(`${environment.apiUrl}/meds-drug/all`)
    );
  }

  getMedsDrugs(page: number, filters: CatalogFilters = {}): Promise<any> {
    return firstValueFrom(
      this.http.get<any>(`${environment.apiUrl}/meds-drug`, {
        params: listParams(page, filters),
      })
    );
  }

  getMedsDrugById(id: number): Promise<any[]> {
    return firstValueFrom(
      this.http.get<any[]>(`${environment.apiUrl}/meds-drug/${id}`)
    );
  }

  createMedsDrug(body: any): Promise<any[]> {
    return firstValueFrom(
      this.http.post<any[]>(`${environment.apiUrl}/meds-drug`, body)
    );
  }
  updateMedsDrug(id: number, body: any): Promise<any> {
    return firstValueFrom(
      this.http.put<any>(`${environment.apiUrl}/meds-drug/${id}`, body)
    );
  }

  deleteMedsDrug(id: number): Promise<any> {
    return firstValueFrom(
      this.http.delete<any>(`${environment.apiUrl}/meds-drug/${id}`)
    );
  }

  // UNIDADES DE MEDIDA
  getAllMedsMeasurements(): Promise<any> {
    return firstValueFrom(
      this.http.get<any>(`${environment.apiUrl}/meds-measurement-unit/all`)
    );
  }
  getMedsMeasurements(page: number, filters: CatalogFilters = {}): Promise<any> {
    return firstValueFrom(
      this.http.get<any>(`${environment.apiUrl}/meds-measurement-unit`, {
        params: listParams(page, filters),
      })
    );
  }

  getMedsMeasurementById(id: number): Promise<any[]> {
    return firstValueFrom(
      this.http.get<any[]>(`${environment.apiUrl}/meds-measurement-unit/${id}`)
    );
  }

  createMedsMeasurement(body: any): Promise<any[]> {
    return firstValueFrom(
      this.http.post<any[]>(`${environment.apiUrl}/meds-measurement-unit`, body)
    );
  }
  updateMedsMeasurement(id: number, body: any): Promise<any> {
    return firstValueFrom(
      this.http.put<any>(
        `${environment.apiUrl}/meds-measurement-unit/${id}`,
        body
      )
    );
  }

  deleteMedsMeasurement(id: number): Promise<any> {
    return firstValueFrom(
      this.http.delete<any>(`${environment.apiUrl}/meds-measurement-unit/${id}`)
    );
  }

  // MEDICAMENTOS

  getMeds(page: number, filters: MedsFilters = {}): Promise<any> {
    return firstValueFrom(
      this.http.get<any>(`${environment.apiUrl}/meds`, {
        params: listParams(page, filters),
      })
    );
  }

  getMedsById(id: number): Promise<any[]> {
    return firstValueFrom(
      this.http.get<any[]>(`${environment.apiUrl}/meds/${id}`)
    );
  }

  createMeds(body: any): Promise<any[]> {
    return firstValueFrom(
      this.http.post<any[]>(`${environment.apiUrl}/meds`, body)
    );
  }
  updateMeds(id: number, body: any): Promise<any> {
    return firstValueFrom(
      this.http.put<any>(`${environment.apiUrl}/meds/${id}`, body)
    );
  }
}
