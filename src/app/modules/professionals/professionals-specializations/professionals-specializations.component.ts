import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { SwalComponent } from "@sweetalert2/ngx-sweetalert2";
import { ProfessionalsService } from "src/app/services/professionals/professionals.service";

@Component({
  selector: "app-professionals-specializations",
  template: `
    <div class="app-page">
      <app-module-header
        title="Especializaciones"
        [route]="this.route"
        (showFilters)="toggle($event)"
      ></app-module-header>
      <div class="layout">
        <div class="filter" [class.d-none]="!this.showFilters">
          <div class="mt-3 d-flex align-items-center justify-content-between">
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
              <label for="description" class="form-label">Descripcion</label>
              <textarea
                type="textarea"
                rows="3"
                class="form-control"
                formControlName="description"
                id="description"
              ></textarea>
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
                <th scope="col">#</th>
                <th scope="col">Nombre</th>
                <th scope="col">Descripción</th>
                <th scope="col">Estado</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody appTableSkeleton *ngIf="this.loading" [rows]="10" [cols]="5"></tbody>
            <tbody *ngIf="!this.loading">
              <tr
                *ngFor="
                  let specialization of this.professionalsSpecializations;
                  let i = index
                "
              >
                <th scope="row">{{ specialization.id }}</th>
                <td>{{ specialization.name }}</td>
                <td>{{ specialization.description }}</td>
                <td>
                  <span
                    class="status-badge"
                    [class.status-badge--danger]="specialization.deleted"
                    [class.status-badge--success]="!specialization.deleted"
                    >{{ specialization.deleted ? "Deshabilitado" : "Habilitado" }}</span
                  >
                </td>
                <td>
                  <button
                    class="btn-icon btn-icon--edit"
                    (click)="edit(specialization.id)"
                    [disabled]="specialization.deleted"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button
                    [class.d-none]="specialization.deleted"
                    class="btn-icon btn-icon--danger"
                    [swal]="deleteSwal"
                    (confirm)="remove(specialization.id)"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                  <button
                    [class.d-none]="!specialization.deleted"
                    class="btn-icon btn-icon--success"
                    [swal]="recoverSwal"
                    (confirm)="recover(specialization.id)"
                  >
                    <i class="bi bi-recycle"></i>
                  </button>
                  <swal
                    #deleteSwal
                    [showCancelButton]="true"
                    cancelButtonText="Cancelar"
                    icon="question"
                    [focusCancel]="true"
                    [customClass]="{ popup: 'swal-danger' }"
                    text="Deshabilitar {{ specialization.name }}?"
                  ></swal>
                  <swal
                    #recoverSwal
                    [showCancelButton]="true"
                    cancelButtonText="Cancelar"
                    icon="question"
                    [focusCancel]="true"
                    text="Habilitar {{ specialization.name }}?"
                  ></swal>
                  <swal
                    #successSwal
                    [text]="this.successText"
                    icon="success"
                    (confirm)="this.getProfessionalsSpecializations()"
                  >
                  </swal>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="empty-state" *ngIf="!this.loading && this.professionalsSpecializations.length === 0">
            <div class="empty-state__icon"><i class="bi bi-mortarboard"></i></div>
            <h2 class="empty-state__title">Sin resultados</h2>
            <p class="empty-state__subtitle">No se encontraron especializaciones con los parámetros ingresados</p>
          </div>
        </div>
      </div>
      <app-pagination
        [totalItems]="this.totalItems"
        (pageChanged)="changed($event)"
      ></app-pagination>
    </div>
  `,
  styleUrls: ["./professionals-specializations.component.scss"],
})
export class ProfessionalsSpecializationsComponent implements OnInit {
  @ViewChild("successSwal") public readonly sucessSwal!: SwalComponent;
  form = this.fb.group({
    name: "",
    description: "",
    deleted: false,
  });
  professionalsSpecializations: any[] = [];
  loading = true;
  opened = false;
  totalItems = 0;
  route = `/modules/professionals/specializations/create`;
  showFilters = true;
  successText: string = "";
  constructor(
    private professionalsService: ProfessionalsService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getProfessionalsSpecializations();
    this.form.valueChanges.subscribe(() => this.filter());
  }
  changed(page: any) {
    this.getProfessionalsSpecializations(
      page,
      this.form.value.deleted,
      this.form.value.name,
      this.form.value.description
    );
  }
  async getProfessionalsSpecializations(
    page: number = 0,
    deleted: boolean = false,
    name: string = "",
    description: string = ""
  ) {
    this.loading = true;
    try {
      const res = await this.professionalsService.getProfessionalsSpecializations(
        page,
        deleted,
        name,
        description
      );
      this.professionalsSpecializations = res.data;
      this.totalItems = res.total;
    } catch (error) {
      console.error('ProfessionalsSpecializationsComponent: error cargando especializaciones', error);
    } finally {
      this.loading = false;
    }
  }

  edit(id: number) {
    this.router.navigateByUrl(
      `modules/professionals/specializations/edit/${id}`
    );
  }

  remove(id: number) {
    this.successText = "Especializacion deshabilitada correctamente";
    this.professionalsService
      .deleteProfessionalsSpecialization(id)
      .then(() => this.sucessSwal.fire())
      .then(() => this.filter());
  }

  recover(id: number) {
    this.successText = "Especializacion habilitada correctamente";
    this.professionalsService
      .recoverProfessionalsSpecialization(id)
      .then(() => this.sucessSwal.fire())
      .then(() => this.filter());
  }

  openFilter() {
    this.opened = !this.opened;
  }

  async filter() {
    await this.getProfessionalsSpecializations(
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
