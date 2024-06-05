import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Chart } from 'node_modules/chart.js';
import { registerables } from 'node_modules/chart.js';
import 'chart.js/auto';
@Component({
  selector: 'app-barchart',
  template: ` <div class="chart-container">
    <h5>{{ this.title }}</h5>
    <canvas id="myChart">{{ this.chart }}</canvas>
  </div>`,
  styleUrls: ['./barchart.component.scss'],
})
export class BarchartComponent implements OnInit, OnChanges {
  @Input() title: string = '';
  @Input() labels: string[] = [];
  @Input() usersData: number[] = [];
  @Input() professionalsData: number[] = [];
  chart: Chart | undefined;

  constructor() {}

  ngOnInit(): void {
    Chart.register(...registerables);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['usersData']) {
      console.log('cambio Users');
      this.usersData = changes['usersData'].currentValue;
      if (this.chart) {
        this.chart.data.datasets[0].data = this.usersData;
        this.chart.update();
      } else {
        this.createChart();
      }
    } else if (changes['professionalsData']) {
      console.log('cambio Professionals');
      this.professionalsData = changes['professionalsData'].currentValue;
      if (this.chart) {
        this.chart.data.datasets[1].data = this.professionalsData;
        this.chart.update();
      } else {
        this.createChart();
      }
    }
  }

  createChart() {
    this.chart = new Chart('myChart', {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [
          {
            maxBarThickness: 30,
            label: 'Usuarios',
            data: this.usersData,
            backgroundColor: ['rgba(54, 162, 235, 0.2)'],
            borderColor: ['rgb(54, 162, 235)'],
            borderWidth: 1,
          },
          {
            maxBarThickness: 30,
            label: 'Profesionales',
            data: this.professionalsData,
            backgroundColor: ['rgba(255, 99, 132,0.2)'],
            borderColor: ['rgb(255, 99, 132)'],
            borderWidth: 1,
          },
        ],
      },
    });
  }
}
