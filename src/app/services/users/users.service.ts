import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  getUsers(page:number): Promise<any> {
    return firstValueFrom(this.http.get<any>(`${environment.apiUrl}/users/all?page=${page}&take=10`));
  }
  
  getMonthlyUserQuantity(): Promise<any[]>{
    return firstValueFrom(this.http.get<any[]>(`${environment.apiUrl}/users/monthly-quantity`));
  }
}
