import { Component, OnInit } from '@angular/core';
import { Chart } from 'node_modules/chart.js';
import { registerables } from 'node_modules/chart.js';
@Component({
  selector: 'app-barchart',
  template: ` <div class="chart-container">
    <canvas id="myChart">{{ this.chart }}</canvas>
  </div>`,
  styleUrls: ['./barchart.component.scss'],
})
export class BarchartComponent implements OnInit {
  public chart: any;

  constructor() {}

  ngOnInit(): void {
    Chart.register(...registerables);
    this.createChart();
    console.log(this.chart);
  }

  createChart() {
    this.chart = new Chart('myChart', {
      type: 'doughnut',
      data: {
        labels: ['red', 'blue', 'yellow'],
        datasets: [
          {
            label: 'My First Dataset',
            data: [300, 50, 100],
            backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 205, 86)'],
            hoverOffset: 4,
          },
        ],
      },
    });
  }
}
