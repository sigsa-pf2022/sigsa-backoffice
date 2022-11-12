import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-meds',
  template: `<div class="skeleton-container">
    <app-module-header title="Medicamentos"></app-module-header>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">First</th>
          <th scope="col">Last</th>
          <th scope="col">Handle</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">1</th>
          <td>Mark</td>
          <td>Otto</td>
          <td>@mdo</td>
        </tr>
        <tr>
          <th scope="row">2</th>
          <td>Jacob</td>
          <td>Thornton</td>
          <td>@fat</td>
        </tr>
        <tr>
          <th scope="row">3</th>
          <td colspan="2">Larry the Bird</td>
          <td>@twitter</td>
        </tr>
      </tbody>
    </table>
  </div>`,
  styleUrls: ['./meds.component.scss'],
})
export class MedsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
