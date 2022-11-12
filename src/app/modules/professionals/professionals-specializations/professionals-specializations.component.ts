import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { ProfessionalsService } from 'src/app/services/professionals/professionals.service';

@Component({
  selector: 'app-professionals-specializations',
  template: `
    <div class="skeleton-container">
      <app-module-header title="Especializaciones" [route]="this.route"></app-module-header>
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
                <th scope="col">Descripción</th>
                <th scope="col">Estado</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let specialization of this.professionalsSpecializations">
                <th scope="row">{{ specialization.id }}</th>
                <td>{{ specialization.name }}</td>
                <td>{{ specialization.description }}</td>
                <td [class.text-danger]="specialization.deleted" [class.text-success]="!specialization.deleted">
                  {{ specialization.deleted ? 'Deshabilitado' : 'Habilitado' }}
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
                    [disabled]="specialization.deleted"
                    class="btn btn-danger"
                    [swal]="deleteSwal"
                    (confirm)="remove(specialization.id)"
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
                    text="Deshabilitar {{ specialization.name }}?"
                  ></swal>
                  <swal
                    #successSwal
                    text="Especializacion deshabilitada correctamente"
                    icon="success"
                    (confirm)="this.getProfessionalsSpecializations()"
                  >
                  </swal>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <app-pagination [totalItems]="this.totalItems" (pageChanged)="changed($event)"></app-pagination>
  `,
  styleUrls: ['./professionals-specializations.component.scss'],
})
export class ProfessionalsSpecializationsComponent implements OnInit {
  @ViewChild('successSwal') public readonly sucessSwal!: SwalComponent;
  form = this.fb.group({
    name: '',
    deleted: false,
  });
  professionalsSpecializations: any[] = [];
  opened = false;
  totalItems = 0;
  route = `/modules/professionals/specializations/create`;

  constructor(private professionalsService: ProfessionalsService, private router: Router, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.getProfessionalsSpecializations();
    this.form.valueChanges.subscribe(() => this.filter());
  }
  changed(page: any) {
    this.getProfessionalsSpecializations(page);
  }
  async getProfessionalsSpecializations(page: number = 0) {
    const res = await this.professionalsService.getProfessionalsSpecializations(page);
    this.professionalsSpecializations = res.data;
    this.totalItems = res.count;
  }

  edit(id: number) {
    this.router.navigateByUrl(`modules/professionals/specializations/edit/${id}`);
  }

  remove(id: number) {
    this.professionalsService.deleteProfessionalsSpecialization(id).then(() => this.sucessSwal.fire());
  }

  openFilter() {
    this.opened = !this.opened;
  }

  filter() {
    console.log(this.form.value);
  }
}
