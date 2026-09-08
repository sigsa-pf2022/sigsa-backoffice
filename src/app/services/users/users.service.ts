import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { listParams } from 'src/app/shared/data/filters/list-filters';

export interface UsersFilters {
  firstName?: string | null;
  lastName?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  getUsers(page: number, filters: UsersFilters = {}): Promise<any> {
    return firstValueFrom(
      this.http.get<any>(`${environment.apiUrl}/users/all`, {
        params: listParams(page, filters),
      })
    );
  }
  
  getMonthlyUserQuantity(): Promise<any[]>{
    return firstValueFrom(this.http.get<any[]>(`${environment.apiUrl}/users/monthly-quantity`));
  }
}
