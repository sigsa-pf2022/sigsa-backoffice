import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { MedsService } from 'src/app/services/meds/meds.service';
import { onFiltersChange } from 'src/app/shared/data/filters/list-filters';

@Component({
  selector: 'app-meds-measurement-list',
  template: `
        <div class="app-page">
      <app-module-header
        title="Unidad de medida"
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
            <tbody appTableSkeleton *ngIf="this.loading" [rows]="10" [cols]="4"></tbody>
            <tbody *ngIf="!this.loading">
              <tr *ngFor="let measurement of this.medsMeasurements">
                <th scope="row">{{ measurement.id }}</th>
                <td>{{ measurement.name }}</td>
                <td>
                  <span
                    class="status-badge"
                    [class.status-badge--danger]="measurement.deleted"
                    [class.status-badge--success]="!measurement.deleted"
                    >{{ measurement.deleted ? 'Deshabilitado' : 'Habilitado' }}</span
                  >
                </td>
                <td>
                  <button
                    class="btn-icon btn-icon--edit"
                    (click)="edit(measurement.id)"
                    [disabled]="measurement.deleted"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button
                    [disabled]="measurement.deleted"
                    class="btn-icon btn-icon--danger"
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
                    [customClass]="{ popup: 'swal-danger' }"
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
          <div class="empty-state" *ngIf="!this.loading && this.medsMeasurements.length === 0">
            <div class="empty-state__icon"><i class="bi bi-rulers"></i></div>
            <h2 class="empty-state__title">Sin resultados</h2>
            <p class="empty-state__subtitle">No se encontraron unidades de medida con los parámetros ingresados</p>
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
  styleUrls: ['./meds-measurement-list.component.scss']
})
export class MedsMeasurementListComponent implements OnInit {
  @ViewChild('successSwal') public readonly sucessSwal!: SwalComponent;
  form = this.fb.group({
    name: '',
    deleted: false,
  });
  medsMeasurements: any[] = [];
  loading = true;
  showFilters = true;
  totalItems = 0;
  page = 0;
  route = `/modules/meds/measurement/create`;
  /** Descarta respuestas que llegan tarde si el usuario siguió tipeando. */
  private requestId = 0;

  constructor(
    private medsService: MedsService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getMedsMeasurements();
    onFiltersChange(this.form.valueChanges).subscribe(() => this.filter());
  }

  changed(page: any) {
    this.page = page;
    this.getMedsMeasurements();
  }

  /** Cambió un filtro: los resultados son otros, así que se vuelve a la página 1. */
  filter() {
    this.page = 0;
    this.getMedsMeasurements();
  }

  async getMedsMeasurements() {
    this.loading = true;
    const requestId = ++this.requestId;
    try {
      const res = await this.medsService.getMedsMeasurements(this.page, this.form.value);
      if (requestId !== this.requestId) return;
      this.medsMeasurements = res.data;
      this.totalItems = res.count;
    } catch (error) {
      console.error('MedsMeasurementListComponent: error cargando unidades', error);
      if (requestId === this.requestId) {
        this.medsMeasurements = [];
        this.totalItems = 0;
      }
    } finally {
      if (requestId === this.requestId) this.loading = false;
    }
  }

  edit(id: number) {
    this.router.navigateByUrl(`modules/meds/measurement/edit/${id}`);
  }

  remove(id: number) {
    this.medsService.deleteMedsMeasurement(id).then(() => this.sucessSwal.fire());
  }

  toggle(value: boolean) {
    this.showFilters = value;
  }
}
