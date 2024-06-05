import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

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
  getMedsForms(page: number): Promise<any> {
    return firstValueFrom(
      this.http.get<any>(
        `${environment.apiUrl}/meds-shape?page=${page}&take=10`
      )
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
  getMedsTypes(
    page: number,
    deleted: boolean,
    name: string,
    description: string
  ): Promise<any> {
    return firstValueFrom(
      this.http.get<any>(
        `${environment.apiUrl}/meds-type?page=${page}&take=10&deleted=${
          deleted ? 1 : 0
        }&name=${name}&description=${description}`
      )
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

  getMedsDrugs(page: number): Promise<any> {
    return firstValueFrom(
      this.http.get<any>(`${environment.apiUrl}/meds-drug?page=${page}&take=10`)
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
  getMedsMeasurements(page: number): Promise<any> {
    return firstValueFrom(
      this.http.get<any>(
        `${environment.apiUrl}/meds-measurement-unit?page=${page}&take=10`
      )
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

  getMeds(page: number): Promise<any> {
    return firstValueFrom(
      this.http.get<any>(`${environment.apiUrl}/meds?page=${page}&take=10`)
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
