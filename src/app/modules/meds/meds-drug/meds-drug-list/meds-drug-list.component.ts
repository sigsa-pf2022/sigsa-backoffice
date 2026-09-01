import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { MedsService } from 'src/app/services/meds/meds.service';

@Component({
  selector: 'app-meds-drug-list',
  template: `
    <div class="app-page">
      <app-module-header title="Drogas" [route]="this.route"></app-module-header>
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
            <tbody appTableSkeleton *ngIf="this.loading" [rows]="10" [cols]="4"></tbody>
            <tbody *ngIf="!this.loading">
              <tr *ngFor="let drug of this.medsDrugs">
                <th scope="row">{{ drug.id }}</th>
                <td>{{ drug.name }}</td>
                <td>
                  <span
                    class="status-badge"
                    [class.status-badge--danger]="drug.deleted"
                    [class.status-badge--success]="!drug.deleted"
                    >{{ drug.deleted ? 'Deshabilitado' : 'Habilitado' }}</span
                  >
                </td>
                <td>
                  <button
                    class="btn-icon btn-icon--edit"
                    (click)="edit(drug.id)"
                    [disabled]="drug.deleted"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button
                    [disabled]="drug.deleted"
                    class="btn-icon btn-icon--danger"
                    [swal]="deleteSwal"
                    (confirm)="remove(drug.id)"
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
                    text="Deshabilitar {{ drug.name }}?"
                  ></swal>
                  <swal
                    #successSwal
                    text="Droga del medicamento deshabilitada correctamente"
                    icon="success"
                    (confirm)="this.getMedsDrugs()"
                  >
                  </swal>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="empty-state" *ngIf="!this.loading && this.medsDrugs.length === 0">
            <div class="empty-state__icon"><i class="bi bi-eyedropper"></i></div>
            <h2 class="empty-state__title">Sin resultados</h2>
            <p class="empty-state__subtitle">No se encontraron drogas de medicamentos con los parámetros ingresados</p>
          </div>
        </div>
      </div>
      <app-pagination [totalItems]="this.totalItems" (pageChanged)="changed($event)"></app-pagination>
    </div>
  `,
  styleUrls: ['./meds-drug-list.component.scss']
})
export class MedsDrugListComponent implements OnInit {
  @ViewChild('successSwal') public readonly sucessSwal!: SwalComponent;
  form = this.fb.group({
    name: '',
    deleted: false,
  });
  medsDrugs: any[] = [];
  opened = false;
  loading = true;
  totalItems = 0;
  route = `/modules/meds/drug/create`;

  constructor(private medsService: MedsService, private router: Router, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.getMedsDrugs();
    this.form.valueChanges.subscribe(() => this.filter());
  }
  changed(page: any) {
    this.getMedsDrugs(page);
  }
  async getMedsDrugs(page: number = 0) {
    this.loading = true;
    try {
      const res = await this.medsService.getMedsDrugs(page);
      this.medsDrugs = res.data;
      this.totalItems = res.count;
    } catch (error) {
      console.error('MedsDrugListComponent: error cargando drogas', error);
    } finally {
      this.loading = false;
    }
  }

  edit(id: number) {
    this.router.navigateByUrl(`modules/meds/drug/edit/${id}`);
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

  // toggle(value: boolean) {
  //   this.showFilters = value;
  // }
}
