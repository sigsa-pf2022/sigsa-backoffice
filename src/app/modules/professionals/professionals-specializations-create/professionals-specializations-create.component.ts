import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { ProfessionalsService } from 'src/app/services/professionals/professionals.service';

@Component({
  selector: 'app-professionals-specializations-create',
  template: `
    <div class="app-page">
      <h1 class="page-title">{{ this.editMode ? 'Editar' : 'Nueva' }} Especialización</h1>
      <app-form-loader *ngIf="this.loading"></app-form-loader>
      <form class="form-card" [formGroup]="this.form" (ngSubmit)="onSubmit()" *ngIf="!this.loading">
        <div class="form-grid">
        <div class="mb-3">
          <label for="name" class="form-label">Nombre</label>
          <input type="text" class="form-control" formControlName="name" id="name" />
        </div>
        <div class="mb-3 form-grid--full">
          <label for="description" class="form-label">Descripción</label>
          <textarea class="form-control" id="description" formControlName="description" rows="3"></textarea>
        </div>
        </div>
        <div class="form-card__actions">
          <button class="btn btn-primary" [disabled]="!this.form.valid" type="submit">
            Confirmar
          </button>
          <button class="btn btn-ghost" type="button" (click)="navigate()">
            Cancelar
          </button>
        </div>
      </form>
    </div>
    <swal
      #successSwal
      [text]="'Especializacion ' + (editMode ? 'editada' : 'creada') + ' correctamente'"
      icon="success"
      (confirm)="navigate()"
    >
    </swal>
    <swal #errorSwal icon="error"> </swal>
  `,
  styleUrls: ['./professionals-specializations-create.component.scss'],
})
export class ProfessionalsSpecializationsCreateComponent implements OnInit {
  @ViewChild('successSwal') public readonly sucessSwal!: SwalComponent;
  @ViewChild('errorSwal') public readonly errorSwal!: SwalComponent;
  editMode = false;
  /** Solo en edición: el form se ve vacío hasta que llegan los datos. */
  loading = false;
  errorText: string = '';
  professionalToUpdate: any;
  form = this.fb.group({
    name: ['', Validators.required],
    description: '',
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private professionalsService: ProfessionalsService
  ) {}
  ngOnInit(): void {
    const itemId = this.route.snapshot.params['id'];
    this.editMode = itemId ? true : false;
    if (this.editMode) this.setForm(itemId);
  }

  async setForm(itemId: number) {
    this.loading = true;
    try {
      this.professionalToUpdate = await this.professionalsService.getProfessionalsSpecializationById(itemId);
      this.form.patchValue(this.professionalToUpdate);
    } catch (error) {
      console.error('ProfessionalsSpecializationsCreateComponent: error cargando la especialización', error);
    } finally {
      this.loading = false;
    }
  }

  onSubmit() {
    this.editMode ? this.update() : this.create();
  }

  update() {
    this.professionalsService
      .updateProfessionalsSpecialization(this.professionalToUpdate.id, this.form.value)
      .then(() => this.sucessSwal.fire())
      .catch(({ error }) => {
        this.errorSwal.update({ text: error.message });
        this.errorSwal.fire();
      });
  }

  create() {
    this.professionalsService
      .createProfessionalsSpecialization(this.form.value)
      .then(() => this.sucessSwal.fire())
      .catch(({ error }) => {
        this.errorSwal.update({ text: error.message });
        this.errorSwal.fire();
      });
  }

  navigate() {
    this.router.navigateByUrl('/modules/professionals/specializations/list');
  }

}
