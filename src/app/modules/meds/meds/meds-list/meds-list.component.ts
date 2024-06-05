import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { MedsService } from 'src/app/services/meds/meds.service';

@Component({
  selector: 'app-meds-list',
  template: `
    <div class="skeleton-container">
      <app-module-header
        title="Medicamentos"
        [route]="this.route"
        (showFilters)="this.toggle($event)"
      ></app-module-header>
      <div class="layout">
        <div class="filter" [class.d-none]="!this.showFilters">
          <div class="mt-3">
            <h3>Filtros</h3>
          </div>
          <form class="me-3 mt-3" [formGroup]="this.form" (ngSubmit)="filter()">
            <div class="mb-3">
              <label for="name" class="form-label">Nombre</label>
              <input
                type="text"
                class="form-control"
                formControlName="name"
                id="name"
              />
            </div>
            <div class="mb-3">
              <label for="drug" class="form-label">Droga</label>
              <select
                id="drug"
                class="form-select"
                aria-label="drugs"
                formControlName="drug"
              >
                <option *ngFor="let drug of this.drugs" [value]="drug.id">
                  {{ drug.name }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label for="type" class="form-label">Tipo</label>
              <select
                id="type"
                class="form-select"
                aria-label="types"
                formControlName="type"
              >
                <option *ngFor="let type of this.types" [value]="type.id">
                  {{ type.name }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label for="shape" class="form-label">Forma</label>
              <select
                id="shape"
                class="form-select"
                aria-label="forms"
                formControlName="shape"
              >
                <option *ngFor="let shape of this.shapes" [value]="shape.id">
                  {{ shape.name }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label for="measurementUnit" class="form-label"
                >Unidad de medida</label
              >
              <select
                id="measurementUnit"
                class="form-select"
                aria-label="measurementUnits"
                formControlName="measurementUnit"
              >
                <option
                  *ngFor="let measurementUnit of this.measurementUnits"
                  [value]="measurementUnit.id"
                >
                  {{ measurementUnit.name }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  formControlName="deleted"
                  value=""
                  id="deleted"
                />
                <label class="form-check-label" for="deleted">
                  Deshabilitado
                </label>
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
                <th scope="col">Dosis</th>
                <th scope="col">Droga</th>
                <th scope="col">Tipo</th>
                <th scope="col">Forma</th>
                <th scope="col">Unidad de medida</th>
                <th scope="col">Estado</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let med of this.meds">
                <th scope="row">{{ med.id }}</th>
                <td>{{ med.name }}</td>
                <td>{{ med.dosage }}</td>
                <td>{{ med.drug.name }}</td>
                <td>{{ med.type.name }}</td>
                <td>{{ med.shape.name }}</td>
                <td>{{ med.measurementUnit.name }}</td>
                <td
                  [class.text-danger]="med.deleted"
                  [class.text-success]="!med.deleted"
                >
                  {{ med.deleted ? 'Deshabilitado' : 'Habilitado' }}
                </td>
                <td>
                  <button
                    class="btn btn-warning me-1"
                    (click)="edit(med.id)"
                    [disabled]="med.deleted"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button
                    [disabled]="med.deleted"
                    class="btn btn-danger"
                    [swal]="deleteSwal"
                    (confirm)="remove(med.id)"
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
                    text="Deshabilitar {{ med.name }}?"
                  ></swal>
                  <swal
                    #successSwal
                    text="Medicamento deshabilitado correctamente"
                    icon="success"
                    (confirm)="this.getMedsDrugs()"
                  >
                  </swal>
                </td>
              </tr>
            </tbody>
          </table>
          <h5 *ngIf="this.meds.length === 0">
            No se encontraron medicamentos con los parametros ingresados
          </h5>
        </div>
      </div>
    </div>
    <app-pagination
      [totalItems]="this.totalItems"
      (pageChanged)="changed($event)"
    ></app-pagination>
  `,
  styleUrls: ['./meds-list.component.scss'],
})
export class MedsListComponent implements OnInit {
  @ViewChild('successSwal') public readonly sucessSwal!: SwalComponent;
  form = this.fb.group({
    name: '',
    type: null,
    shape: null,
    measurementUnit: null,
    drug: null,
    deleted: false,
  });
  meds: any[] = [];
  drugs: any[];
  types: any[];
  shapes: any[];
  measurementUnits: any[];
  opened = false;
  showFilters = true;
  totalItems = 0;
  route = `/modules/meds/create`;

  constructor(
    private medsService: MedsService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.setFiltersData();
    this.getMedsDrugs();
    this.form.valueChanges.subscribe(() => this.filter());
  }
  changed(page: any) {
    this.getMedsDrugs(page);
  }
  async getMedsDrugs(page: number = 0) {
    const res = await this.medsService.getMeds(page);
    this.meds = res.data;
    this.totalItems = res.count;
  }
  async setFiltersData() {
    this.drugs = await this.medsService.getAllMedsDrugs();
    this.types = await this.medsService.getAllMedsTypes();
    this.shapes = await this.medsService.getAllMedsForms();
    this.measurementUnits = await this.medsService.getAllMedsMeasurements();
  }
  edit(id: number) {
    this.router.navigateByUrl(`modules/meds/edit/${id}`);
  }

  remove(id: number) {
    this.medsService.deleteMedsDrug(id).then(() => this.sucessSwal.fire());
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

  toggle(value: boolean) {
    this.showFilters = value;
  }
}
