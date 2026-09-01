import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { MedsService } from 'src/app/services/meds/meds.service';

@Component({
  selector: 'app-meds-type-list',
  template: `
    <div class="app-page">
      <app-module-header
        title="Tipos"
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
                <th scope="col">Descripción</th>
                <th scope="col">Estado</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody appTableSkeleton *ngIf="this.loading" [rows]="10" [cols]="5"></tbody>
            <tbody *ngIf="!this.loading">
              <tr *ngFor="let type of this.medsTypes">
                <th scope="row">{{ type.id }}</th>
                <td>{{ type.name }}</td>
                <td>{{ type.description }}</td>
                <td>
                  <span
                    class="status-badge"
                    [class.status-badge--danger]="type.deleted"
                    [class.status-badge--success]="!type.deleted"
                    >{{ type.deleted ? 'Deshabilitado' : 'Habilitado' }}</span
                  >
                </td>
                <td>
                  <button
                    class="btn-icon btn-icon--edit"
                    (click)="edit(type.id)"
                    [disabled]="type.deleted"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button
                    [disabled]="type.deleted"
                    class="btn-icon btn-icon--danger"
                    [swal]="deleteSwal"
                    (confirm)="remove(type.id)"
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
                    text="Deshabilitar {{ type.name }}?"
                  ></swal>
                  <swal
                    #successSwal
                    text="Tipo de medicamento deshabilitada correctamente"
                    icon="success"
                    (confirm)="this.getMedsTypes()"
                  >
                  </swal>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="empty-state" *ngIf="!this.loading && this.medsTypes.length === 0">
            <div class="empty-state__icon"><i class="bi bi-tags"></i></div>
            <h2 class="empty-state__title">Sin resultados</h2>
            <p class="empty-state__subtitle">No se encontraron tipos de medicamentos con los parámetros ingresados</p>
          </div>
        </div>
      </div>
      <app-pagination
        [totalItems]="this.totalItems"
        (pageChanged)="changed($event)"
      ></app-pagination>
    </div>
  `,

  styleUrls: ['./meds-type-list.component.scss'],
})
export class MedsTypeListComponent implements OnInit {
  @ViewChild('successSwal') public readonly sucessSwal!: SwalComponent;
  form = this.fb.group({
    name: '',
    deleted: false,
  });
  medsTypes: any[] = [];
  loading = true;
  opened = false;
  showFilters = true;
  totalItems = 0;
  route = `/modules/meds/type/create`;

  constructor(
    private medsService: MedsService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getMedsTypes();
    this.form.valueChanges.subscribe(() => this.filter());
  }
  changed(page: any) {
    this.getMedsTypes(page);
  }
  async getMedsTypes(
    page: number = 0,
    deleted: boolean = false,
    name: string = '',
    description: string = ''
  ) {
    this.loading = true;
    try {
      const res = await this.medsService.getMedsTypes(
        page,
        deleted,
        name,
        description
      );
      this.medsTypes = res.data;
      this.totalItems = res.count;
    } catch (error) {
      console.error('MedsTypeListComponent: error cargando tipos', error);
    } finally {
      this.loading = false;
    }
  }

  edit(id: number) {
    this.router.navigateByUrl(`modules/meds/type/edit/${id}`);
  }

  remove(id: number) {
    this.medsService.deleteMedsType(id).then(() => this.sucessSwal.fire());
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

  async filter() {
    await this.getMedsTypes(
      0,
      this.form.value.deleted,
      this.form.value.name,
      this.form.value.description
    );
  }

  toggle(value: boolean) {
    this.showFilters = value;
  }
}
