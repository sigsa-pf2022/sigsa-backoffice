import { Component, OnInit } from '@angular/core';
import { eachMonthOfInterval, getMonth, subMonths } from 'date-fns';
import { ProfessionalsService } from '../services/professionals/professionals.service';
import { UsersService } from '../services/users/users.service';
import { MONTHS } from '../shared/data/constants/months.constant';

@Component({
  selector: 'app-home',
  template: `
    <div class="skeleton-container">
      <div class="charts">
        <div class="charts__users">
          <app-barchart
            [labels]="this.labels"
            [usersData]="this.usersData"
            [professionalsData]="this.professionalsData"
            title="Usuarios registrados en ultimos 6 meses"
          ></app-barchart>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  labels: any[] = [];
  usersData: any[] = [];
  professionalsData: any[] = [];
  constructor(
    private usersService: UsersService,
    private professionalsService: ProfessionalsService
  ) {}

  async ngOnInit() {
    this.monthLabels();
    await this.usersRegistered();
    await this.professionalsRegistered();
  }

  monthLabels() {
    const today = new Date();
    this.labels = eachMonthOfInterval({
      start: subMonths(today, 5),
      end: today,
    }).map((l: Date) => MONTHS[getMonth(l)]);
  }

  async usersRegistered() {
    this.usersData = await this.usersService.getMonthlyUserQuantity();
  }
  async professionalsRegistered() {
    this.professionalsData =
      await this.professionalsService.getMonthlyProfessionalsQuantity();
  }
}
