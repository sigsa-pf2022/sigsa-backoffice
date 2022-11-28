import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { MedsService } from 'src/app/services/meds/meds.service';

@Component({
  selector: 'app-meds-type-list',
  template: `
    <div class="skeleton-container">
      <app-module-header title="Tipos" [route]="this.route"></app-module-header>
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
              <tr *ngFor="let type of this.medsTypes">
                <th scope="row">{{ type.id }}</th>
                <td>{{ type.name }}</td>
                <td>{{ type.description }}</td>
                <td [class.text-danger]="type.deleted" [class.text-success]="!type.deleted">
                  {{ type.deleted ? 'Deshabilitado' : 'Habilitado' }}
                </td>
                <td>
                  <button
                    class="btn btn-warning me-1"
                    (click)="edit(type.id)"
                    [disabled]="type.deleted"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button
                    [disabled]="type.deleted"
                    class="btn btn-danger"
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
                    confirmButtonColor="red"
                    text="Deshabilitar {{ type.name }}?"
                  ></swal>
                  <swal
                    #successSwal
                    text="Especializacion deshabilitada correctamente"
                    icon="success"
                    (confirm)="this.getMedsTypes()"
                  >
                  </swal>
                </td>
              </tr>
            </tbody>
          </table>
          <h5 *ngIf="this.medsTypes.length === 0">
            No se encontraron specializaciones con los parametros ingresados
          </h5>
        </div>
      </div>
    </div>
    <app-pagination [totalItems]="this.totalItems" (pageChanged)="changed($event)"></app-pagination>
  `,

  styleUrls: ['./meds-type-list.component.scss']
})
export class MedsTypeListComponent implements OnInit {
  @ViewChild('successSwal') public readonly sucessSwal!: SwalComponent;
  form = this.fb.group({
    name: '',
    deleted: false,
  });
  medsTypes: any[] = [];
  opened = false;
  totalItems = 0;
  route = `/modules/meds/type/create`;

  constructor(private medsService: MedsService, private router: Router, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.getMedsTypes();
    this.form.valueChanges.subscribe(() => this.filter());
  }
  changed(page: any) {
    this.getMedsTypes(page);
  }
  async getMedsTypes(page: number = 0) {
    const res = await this.medsService.getMedsTypes(page);
    this.medsTypes = res.data;
    this.totalItems = res.count;
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

  filter() {
    console.log(this.form.value);
  }

  // toggle(value: boolean) {
  //   this.showFilters = value;
  // }
}