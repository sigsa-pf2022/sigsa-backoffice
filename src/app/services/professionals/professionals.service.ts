import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProfessionalsService {
  constructor(private http: HttpClient) {}

  getProfessionals(): Promise<any[]> {
    return firstValueFrom(
      this.http.get<any[]>(`${environment.apiUrl}/professionals`)
    );
  }

  getProfessionalsSpecializations(
    page: number,
    deleted: boolean,
    name: string,
    description: string
  ): Promise<any> {
    return firstValueFrom(
      this.http.get<any>(
        `${
          environment.apiUrl
        }/professionals/specializations?page=${page}&take=10&deleted=${
          deleted ? 1 : 0
        }&name=${name}&description=${description}`
      )
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
