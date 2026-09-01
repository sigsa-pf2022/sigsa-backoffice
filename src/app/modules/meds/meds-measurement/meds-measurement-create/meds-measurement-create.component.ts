import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { MedsService } from 'src/app/services/meds/meds.service';


@Component({
  selector: 'app-meds-measurement-create',
  template: `
    <div class="app-page">
      <h1 class="page-title">{{ this.editMode ? 'Editar' : 'Nueva' }} unidad de medida</h1>
      <app-form-loader *ngIf="this.loading"></app-form-loader>
      <form class="form-card" [formGroup]="this.form" (ngSubmit)="onSubmit()" *ngIf="!this.loading">
        <div class="form-grid">
        <div class="mb-3">
          <label for="name" class="form-label">Nombre</label>
          <input type="text" class="form-control" formControlName="name" id="name" />
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
      [text]="'Unidad de medida de medicamento ' + (editMode ? 'editada' : 'creada') + ' correctamente'"
      icon="success"
      (confirm)="navigate()"
    >
    </swal>
    <swal #errorSwal icon="error"> </swal>
  `,
  styleUrls: ['./meds-measurement-create.component.scss']
})
export class MedsMeasurementCreateComponent implements OnInit {
  @ViewChild('successSwal') public readonly sucessSwal!: SwalComponent;
  @ViewChild('errorSwal') public readonly errorSwal!: SwalComponent;
  editMode = false;
  /** Solo en edición: el form se ve vacío hasta que llegan los datos. */
  loading = false;
  errorText: string = '';
  medsMeasurementToUpdate: any;
  form = this.fb.group({
    name: ['', Validators.required],
    description: '',
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private medsService: MedsService
  ) {}
  ngOnInit(): void {
    const itemId = this.route.snapshot.params['id'];
    this.editMode = itemId ? true : false;
    if (this.editMode) this.setMeasurement(itemId);
  }

  async setMeasurement(itemId: number) {
    this.loading = true;
    try {
      this.medsMeasurementToUpdate = await this.medsService.getMedsMeasurementById(itemId);
      this.form.patchValue(this.medsMeasurementToUpdate);
    } catch (error) {
      console.error('MedsMeasurementCreateComponent: error cargando la unidad', error);
    } finally {
      this.loading = false;
    }
  }

  onSubmit() {
    this.editMode ? this.update() : this.create();
  }

  update() {
    this.medsService
      .updateMedsMeasurement(this.medsMeasurementToUpdate.id, this.form.value)
      .then(() => this.sucessSwal.fire())
      .catch(({error}: {error:any} ) => {
        this.errorSwal.update({ text: error.message });
        this.errorSwal.fire();
      });
  }

  create() {
    this.medsService
      .createMedsMeasurement(this.form.value)
      .then(() => this.sucessSwal.fire())
      .catch(({error}: {error:any}) => {
        this.errorSwal.update({ text: error.message });
        this.errorSwal.fire();
      });
  }

  navigate() {
    this.router.navigateByUrl('/modules/meds/measurement/list');
  }

}
