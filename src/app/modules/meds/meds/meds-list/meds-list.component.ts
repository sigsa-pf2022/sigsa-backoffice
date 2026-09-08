import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { MedsService } from 'src/app/services/meds/meds.service';
import { onFiltersChange } from 'src/app/shared/data/filters/list-filters';

@Component({
  selector: 'app-meds-list',
  template: `
    <div class="app-page">
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
                <option value="">Todas las drogas</option>
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
                <option value="">Todos los tipos</option>
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
                <option value="">Todas las formas</option>
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
                <option value="">Todas las unidades</option>
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
            <tbody appTableSkeleton *ngIf="this.loading" [rows]="10" [cols]="9"></tbody>
            <tbody *ngIf="!this.loading">
              <tr *ngFor="let med of this.meds">
                <th scope="row">{{ med.id }}</th>
                <td>{{ med.name }}</td>
                <td>{{ med.dosage }}</td>
                <td>{{ med.drug.name }}</td>
                <td>{{ med.type.name }}</td>
                <td>{{ med.shape.name }}</td>
                <td>{{ med.measurementUnit.name }}</td>
                <td>
                  <span
                    class="status-badge"
                    [class.status-badge--danger]="med.deleted"
                    [class.status-badge--success]="!med.deleted"
                    >{{ med.deleted ? 'Deshabilitado' : 'Habilitado' }}</span
                  >
                </td>
                <td>
                  <button
                    class="btn-icon btn-icon--edit"
                    (click)="edit(med.id)"
                    [disabled]="med.deleted"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button
                    [disabled]="med.deleted"
                    class="btn-icon btn-icon--danger"
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
                    [customClass]="{ popup: 'swal-danger' }"
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
          <div class="empty-state" *ngIf="!this.loading && this.meds.length === 0">
            <div class="empty-state__icon"><i class="bi bi-capsule"></i></div>
            <h2 class="empty-state__title">Sin resultados</h2>
            <p class="empty-state__subtitle">No se encontraron medicamentos con los parámetros ingresados</p>
          </div>
        </div>
      </div>
      <app-pagination
        [totalItems]="this.totalItems"
        [page]="this.page"
        (pageChanged)="changed($event)"
      ></app-pagination>
    </div>
  `,
  styleUrls: ['./meds-list.component.scss'],
})
export class MedsListComponent implements OnInit {
  @ViewChild('successSwal') public readonly sucessSwal!: SwalComponent;
  form = this.fb.group({
    name: '',
    type: '',
    shape: '',
    measurementUnit: '',
    drug: '',
    deleted: false,
  });
  meds: any[] = [];
  loading = true;
  drugs: any[] = [];
  types: any[] = [];
  shapes: any[] = [];
  measurementUnits: any[] = [];
  showFilters = true;
  totalItems = 0;
  page = 0;
  route = `/modules/meds/create`;
  /** Descarta respuestas que llegan tarde si el usuario siguió tipeando. */
  private requestId = 0;

  constructor(
    private medsService: MedsService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.setFiltersData();
    this.getMedsDrugs();
    onFiltersChange(this.form.valueChanges).subscribe(() => this.filter());
  }

  changed(page: any) {
    this.page = page;
    this.getMedsDrugs();
  }

  /** Cambió un filtro: los resultados son otros, así que se vuelve a la página 1. */
  filter() {
    this.page = 0;
    this.getMedsDrugs();
  }

  async getMedsDrugs() {
    this.loading = true;
    const requestId = ++this.requestId;
    try {
      const res = await this.medsService.getMeds(this.page, this.form.value);
      if (requestId !== this.requestId) return;
      this.meds = res.data;
      this.totalItems = res.count;
    } catch (error) {
      console.error('MedsListComponent: error cargando medicamentos', error);
      if (requestId === this.requestId) {
        this.meds = [];
        this.totalItems = 0;
      }
    } finally {
      if (requestId === this.requestId) this.loading = false;
    }
  }

  async setFiltersData() {
    try {
      // Los cuatro catálogos de filtros son independientes: en paralelo los
      // selects se llenan de una y no uno detrás de otro.
      const [drugs, types, shapes, measurementUnits] = await Promise.all([
        this.medsService.getAllMedsDrugs(),
        this.medsService.getAllMedsTypes(),
        this.medsService.getAllMedsForms(),
        this.medsService.getAllMedsMeasurements(),
      ]);
      this.drugs = drugs;
      this.types = types;
      this.shapes = shapes;
      this.measurementUnits = measurementUnits;
    } catch (error) {
      console.error('MedsListComponent: error cargando los filtros', error);
    }
  }

  edit(id: number) {
    this.router.navigateByUrl(`modules/meds/edit/${id}`);
  }

  remove(id: number) {
    this.medsService.deleteMedsDrug(id).then(() => this.sucessSwal.fire());
  }

  toggle(value: boolean) {
    this.showFilters = value;
  }
}
