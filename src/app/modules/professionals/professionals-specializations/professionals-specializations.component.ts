import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { SwalComponent } from "@sweetalert2/ngx-sweetalert2";
import { ProfessionalsService } from "src/app/services/professionals/professionals.service";

@Component({
  selector: "app-professionals-specializations",
  template: `
    <div class="skeleton-container">
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
            <tbody>
              <tr
                *ngFor="
                  let specialization of this.professionalsSpecializations;
                  let i = index
                "
              >
                <th scope="row">{{ specialization.id }}</th>
                <td>{{ specialization.name }}</td>
                <td>{{ specialization.description }}</td>
                <td
                  [class.text-danger]="specialization.deleted"
                  [class.text-success]="!specialization.deleted"
                >
                  {{ specialization.deleted ? "Deshabilitado" : "Habilitado" }}
                </td>
                <td>
                  <button
                    class="btn btn-warning me-1"
                    (click)="edit(specialization.id)"
                    [disabled]="specialization.deleted"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button
                    [class.d-none]="specialization.deleted"
                    class="btn btn-danger"
                    [swal]="deleteSwal"
                    (confirm)="remove(specialization.id)"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                  <button
                    [class.d-none]="!specialization.deleted"
                    class="btn btn-outline-success"
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
                    confirmButtonColor="red"
                    text="Deshabilitar {{ specialization.name }}?"
                  ></swal>
                  <swal
                    #recoverSwal
                    [showCancelButton]="true"
                    cancelButtonText="Cancelar"
                    icon="question"
                    [focusCancel]="true"
                    confirmButtonColor="green"
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
          <h5 *ngIf="this.professionalsSpecializations.length === 0">
            No se encontraron specializaciones con los parametros ingresados
          </h5>
        </div>
      </div>
    </div>
    <app-pagination
      [totalItems]="this.totalItems"
      (pageChanged)="changed($event)"
    ></app-pagination>
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
    const res = await this.professionalsService.getProfessionalsSpecializations(
      page,
      deleted,
      name,
      description
    );
    this.professionalsSpecializations = res.data;
    this.totalItems = res.total;
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
