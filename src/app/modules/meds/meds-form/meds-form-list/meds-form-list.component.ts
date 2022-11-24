import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { MedsService } from 'src/app/services/meds/meds.service';

@Component({
  selector: 'app-meds-form-list',
  template: `
    <div class="skeleton-container">
      <app-module-header title="Formas" [route]="this.route"></app-module-header>
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
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let forms of this.medsForms">
                <th scope="row">{{ forms.id }}</th>
                <td>{{ forms.name }}</td>
                <td>{{ forms.description }}</td>
                <td [class.text-danger]="forms.deleted" [class.text-success]="!forms.deleted">
                  {{ forms.deleted ? 'Deshabilitado' : 'Habilitado' }}
                </td>
                <td>
                  <button
                    class="btn btn-warning me-1"
                    (click)="edit(forms.id)"
                    [disabled]="forms.deleted"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button
                    [disabled]="forms.deleted"
                    class="btn btn-danger"
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
                    confirmButtonColor="red"
                    text="Deshabilitar {{ forms.name }}?"
                  ></swal>
                  <swal
                    #successSwal
                    text="Especializacion deshabilitada correctamente"
                    icon="success"
                    (confirm)="this.getMedsForms()"
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
  styleUrls: ['./meds-form-list.component.scss']
})
export class MedsFormListComponent implements OnInit {

  @ViewChild('successSwal') public readonly sucessSwal!: SwalComponent;
  form = this.fb.group({
    name: '',
    deleted: false,
  });
  medsForms: any[] = [];
  opened = false;
  totalItems = 0;
  route = `/modules/meds/forms/create`;

  constructor(private medsService: MedsService, private router: Router, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.getMedsForms();
    this.form.valueChanges.subscribe(() => this.filter());
  }
  changed(page: any) {
    this.getMedsForms(page);
  }
  async getMedsForms(page: number = 0) {
    const res = await this.medsService.getMedsForms(page);
    this.medsForms = res.data;
    this.totalItems = res.count;
  }

  edit(id: number) {
    this.router.navigateByUrl(`modules/meds/forms/edit/${id}`);
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
