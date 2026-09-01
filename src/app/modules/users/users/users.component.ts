import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-users',
  template: `
    <div class="app-page">
      <app-module-header
        title="Usuarios"
        [showCreation]="false"
        (showFilters)="toggle($event)"
      ></app-module-header>
      <div class="layout">
        <div class="filter" [class.d-none]="!this.showFilters">
          <div class="mt-3">
            <h3>Filtros</h3>
          </div>
          <form class="me-3 mt-3" [formGroup]="this.form" (ngSubmit)="filter()">
            <div class="mb-3">
              <label for="firstName" class="form-label">Nombre</label>
              <input
                type="text"
                class="form-control"
                formControlName="firstName"
                id="firstName"
              />
            </div>
            <div class="mb-3">
              <label for="lastName" class="form-label">Apellido</label>
              <input
                type="text"
                class="form-control"
                formControlName="lastName"
                id="lastName"
              />
            </div>
          </form>
        </div>
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Nombre</th>
                <th scope="col">Apellido</th>
                <th scope="col">Email</th>
                <th scope="col">Fecha Creación</th>
              </tr>
            </thead>
            <tbody appTableSkeleton *ngIf="this.loading" [rows]="10" [cols]="5"></tbody>
            <tbody *ngIf="!this.loading">
              <tr *ngFor="let user of this.users">
                <th scope="row">{{ user.id }}</th>
                <td>{{ user.firstName }}</td>
                <td>{{ user.lastName }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.createdAt | date: 'dd/MM/yyyy' }}</td>
              </tr>
            </tbody>
          </table>

          <div class="empty-state" *ngIf="!this.loading && this.users.length === 0">
            <div class="empty-state__icon"><i class="bi bi-people"></i></div>
            <h2 class="empty-state__title">Sin resultados</h2>
            <p class="empty-state__subtitle">No se encontraron usuarios con los parámetros ingresados</p>
          </div>
        </div>
      </div>
      <app-pagination
        [totalItems]="this.totalItems"
        (pageChanged)="changed($event)"
      ></app-pagination>
    </div>
  `,
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  loading = true;
  showFilters = true;
  totalItems = 0;
  form = this.fb.group({
    firstName: '',
    lastName: '',
  });
  constructor(private usersService: UsersService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.getUsers();
  }
  changed(page: any) {
    this.getUsers(page);
  }
  async getUsers(page: number = 0) {
    this.loading = true;
    try {
      const res = await this.usersService.getUsers(page);
      this.users = res.data;
      this.totalItems = res.count;
    } catch (error) {
      console.error('UsersComponent: error cargando usuarios', error);
    } finally {
      this.loading = false;
    }
  }
  filter() {
    console.log(this.form.value);
  }

  toggle(value: boolean) {
    this.showFilters = value;
  }
}
