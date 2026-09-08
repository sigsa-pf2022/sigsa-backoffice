import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { MedsService } from 'src/app/services/meds/meds.service';
import { onFiltersChange } from 'src/app/shared/data/filters/list-filters';

@Component({
  selector: 'app-meds-form-list',
  template: `
    <div class="app-page">
      <app-module-header
        title="Formas"
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
                <th scope="col">Estado</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody appTableSkeleton *ngIf="this.loading" [rows]="10" [cols]="4"></tbody>
            <tbody *ngIf="!this.loading">
              <tr *ngFor="let forms of this.medsForms">
                <th scope="row">{{ forms.id }}</th>
                <td>{{ forms.name }}</td>
                <td>
                  <span
                    class="status-badge"
                    [class.status-badge--danger]="forms.deleted"
                    [class.status-badge--success]="!forms.deleted"
                    >{{ forms.deleted ? 'Deshabilitado' : 'Habilitado' }}</span
                  >
                </td>
                <td>
                  <button
                    class="btn-icon btn-icon--edit"
                    (click)="edit(forms.id)"
                    [disabled]="forms.deleted"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button
                    [disabled]="forms.deleted"
                    class="btn-icon btn-icon--danger"
                    [swal]="deleteSwal"
                    (confirm)="remove(forms.id)"
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
                    text="Deshabilitar {{ forms.name }}?"
                  ></swal>
                  <swal
                    #successSwal
                    text="Forma de medicamento deshabilitada correctamente"
                    icon="success"
                    (confirm)="this.getMedsForms()"
                  >
                  </swal>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="empty-state" *ngIf="!this.loading && this.medsForms.length === 0">
            <div class="empty-state__icon"><i class="bi bi-droplet"></i></div>
            <h2 class="empty-state__title">Sin resultados</h2>
            <p class="empty-state__subtitle">No se encontraron formas de medicamentos con los parámetros ingresados</p>
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
  styleUrls: ['./meds-form-list.component.scss'],
})
export class MedsFormListComponent implements OnInit {
  @ViewChild('successSwal') public readonly sucessSwal!: SwalComponent;
  form = this.fb.group({
    name: '',
    deleted: false,
  });
  medsForms: any[] = [];
  loading = true;
  showFilters = true;
  totalItems = 0;
  page = 0;
  route = `/modules/meds/form/create`;
  /** Descarta respuestas que llegan tarde si el usuario siguió tipeando. */
  private requestId = 0;

  constructor(
    private medsService: MedsService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getMedsForms();
    onFiltersChange(this.form.valueChanges).subscribe(() => this.filter());
  }

  changed(page: any) {
    this.page = page;
    this.getMedsForms();
  }

  /** Cambió un filtro: los resultados son otros, así que se vuelve a la página 1. */
  filter() {
    this.page = 0;
    this.getMedsForms();
  }

  async getMedsForms() {
    this.loading = true;
    const requestId = ++this.requestId;
    try {
      const res = await this.medsService.getMedsForms(this.page, this.form.value);
      if (requestId !== this.requestId) return;
      this.medsForms = res.data;
      this.totalItems = res.count;
    } catch (error) {
      console.error('MedsFormListComponent: error cargando formas', error);
      if (requestId === this.requestId) {
        this.medsForms = [];
        this.totalItems = 0;
      }
    } finally {
      if (requestId === this.requestId) this.loading = false;
    }
  }

  edit(id: number) {
    this.router.navigateByUrl(`modules/meds/form/edit/${id}`);
  }

  remove(id: number) {
    this.medsService.deleteMedsForm(id).then(() => this.sucessSwal.fire());
  }

  toggle(value: boolean) {
    this.showFilters = value;
  }
}
