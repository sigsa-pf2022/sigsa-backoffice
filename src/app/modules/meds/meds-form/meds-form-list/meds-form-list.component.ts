import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { MedsService } from 'src/app/services/meds/meds.service';

@Component({
  selector: 'app-meds-form-list',
  template: `
    <div class="app-page">
      <app-module-header
        title="Formas"
        [route]="this.route"
      ></app-module-header>
      <div class="layout">
        <div class="filter">
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
  opened = false;
  totalItems = 0;
  route = `/modules/meds/form/create`;

  constructor(
    private medsService: MedsService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getMedsForms();
    this.form.valueChanges.subscribe(() => this.filter());
  }
  changed(page: any) {
    this.getMedsForms(page);
  }
  async getMedsForms(page: number = 0) {
    this.loading = true;
    try {
      const res = await this.medsService.getMedsForms(page);
      this.medsForms = res.data;
      this.totalItems = res.count;
    } catch (error) {
      console.error('MedsFormListComponent: error cargando formas', error);
    } finally {
      this.loading = false;
    }
  }

  edit(id: number) {
    this.router.navigateByUrl(`modules/meds/form/edit/${id}`);
  }

  remove(id: number) {
    this.medsService.deleteMedsForm(id).then(() => this.sucessSwal.fire());
  }

  openFilter() {
    this.opened = !this.opened;
  }

  filter() {
    console.log(this.form.value);
  }
}
