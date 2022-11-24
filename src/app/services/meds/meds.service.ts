import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MedsService {
  constructor(private http: HttpClient) {}

  getMeds(): Promise<any[]> {
    return firstValueFrom(this.http.get<any[]>(`${environment.apiUrl}/meds`));
  }

  getMedsForms(page:number): Promise<any> {
    return firstValueFrom(this.http.get<any>(`${environment.apiUrl}/meds/forms?page=${page}`));
  }

  getMedsFormById(id: number): Promise<any[]> {
    return firstValueFrom(this.http.get<any[]>(`${environment.apiUrl}/meds/forms/${id}`));
  }

  createMedsForm(body: any): Promise<any[]> {
    return firstValueFrom(this.http.post<any[]>(`${environment.apiUrl}/meds/forms`, body));
  }
  updateMedsForm(id: number, body: any): Promise<any> {
    return firstValueFrom(this.http.put<any>(`${environment.apiUrl}/meds/forms/${id}`, body));
  }

  deleteMedsForm(id: number): Promise<any> {
    return firstValueFrom(this.http.delete<any>(`${environment.apiUrl}/meds/forms/${id}`));
  }
}
