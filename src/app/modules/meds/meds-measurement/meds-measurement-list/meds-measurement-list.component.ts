import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { MedsService } from 'src/app/services/meds/meds.service';

@Component({
  selector: 'app-meds-measurement-list',
  template: `
        <div class="skeleton-container">
      <app-module-header title="Unidad de medida" [route]="this.route"></app-module-header>
      <div class="layout">
        <div class="filter">
          <div class="mt-3">
            <h3>Filtros</h3>
          </div>
          <form class="me-3 mt-3" [formGroup]="this.form" (ngSubmit)="filter()">
            <div class="mb-3">
              <label for="name" class="form-label">Nombre</label>
              <input type="text" class="form-control" formControlName="name" id="name" />
            </div>
            <div class="mb-3">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" formControlName="deleted" value="" id="deleted" />
                <label class="form-check-label" for="deleted"> Deshabilitado </label>
              </div>
            </div>
          </form>
        </div>
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Nombre</th>
                <th scope="col">Estado</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let measurement of this.medsMeasurements">
                <th scope="row">{{ measurement.id }}</th>
                <td>{{ measurement.name }}</td>
                <td [class.text-danger]="measurement.deleted" [class.text-success]="!measurement.deleted">
                  {{ measurement.deleted ? 'Deshabilitado' : 'Habilitado' }}
                </td>
                <td>
                  <button
                    class="btn btn-warning me-1"
                    (click)="edit(measurement.id)"
                    [disabled]="measurement.deleted"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button
                    [disabled]="measurement.deleted"
                    class="btn btn-danger"
                    [swal]="deleteSwal"
                    (confirm)="remove(measurement.id)"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                  <swal
                    #deleteSwal
                    [showCancelButton]="true"
                    cancelButtonText="Cancelar"
                    icon="question"
                    [focusCancel]="true"
                    confirmButtonColor="red"
                    text="Deshabilitar {{ measurement.name }}?"
                  ></swal>
                  <swal
                    #successSwal
                    text="Unidad de medida de medicamento deshabilitada correctamente"
                    icon="success"
                    (confirm)="this.getMedsMeasurements()"
                  >
                  </swal>
                </td>
              </tr>
            </tbody>
          </table>
          <h5 *ngIf="this.medsMeasurements.length === 0">
            No se encontraron unidades de medida con los parametros ingresados
          </h5>
        </div>
      </div>
    </div>
    <app-pagination [totalItems]="this.totalItems" (pageChanged)="changed($event)"></app-pagination>
  `,
  styleUrls: ['./meds-measurement-list.component.scss']
})
export class MedsMeasurementListComponent implements OnInit {
  @ViewChild('successSwal') public readonly sucessSwal!: SwalComponent;
  form = this.fb.group({
    name: '',
    deleted: false,
  });
  medsMeasurements: any[] = [];
  opened = false;
  totalItems = 0;
  route = `/modules/meds/measurement/create`;

  constructor(private medsService: MedsService, private router: Router, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.getMedsMeasurements();
    this.form.valueChanges.subscribe(() => this.filter());
  }
  changed(page: any) {
    this.getMedsMeasurements(page);
  }
  async getMedsMeasurements(page: number = 0) {
    const res = await this.medsService.getMedsMeasurements(page);
    this.medsMeasurements = res.data;
    this.totalItems = res.count;
  }

  edit(id: number) {
    this.router.navigateByUrl(`modules/meds/measurement/edit/${id}`);
  }

  remove(id: number) {
    this.medsService.deleteMedsMeasurement(id).then(() => this.sucessSwal.fire());
  }

  // recover(id: number) {
  //   this.successText = "Especializacion habilitada correctamente";
  //   this.professionalsService
  //     .recoverProfessionalsSpecialization(id)
  //     .then(() => this.sucessSwal.fire())
  //     .then(() => this.filter());
  // }

  openFilter() {
    this.opened = !this.opened;
  }

  filter() {
    console.log(this.form.value);
  }

  // toggle(value: boolean) {
  //   this.showFilters = value;
  // }

}
