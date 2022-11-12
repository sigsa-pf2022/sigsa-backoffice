import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-users',
  template: `
    <div class="skeleton-container">
      <app-module-header title="Usuarios"></app-module-header>
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
        <tbody>
          <tr *ngFor="let user of this.users">
            <th scope="row">{{ user.id }}</th>
            <td>{{ user.firstName }}</td>
            <td>{{ user.lastName }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.createdAt | date: 'dd/MM/yyyy' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.getUsers();
  }

  async getUsers() {
    this.users = await this.usersService.getUsers();
    console.log(this.users);
  }
}
