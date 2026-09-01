import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { MedsService } from 'src/app/services/meds/meds.service';

@Component({
  selector: 'app-meds-drug-create',
  template: `
    <div class="app-page">
      <h1 class="page-title">{{ this.editMode ? 'Editar' : 'Nueva' }} droga</h1>
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
      [text]="'Droga del medicamento ' + (editMode ? 'editada' : 'creada') + ' correctamente'"
      icon="success"
      (confirm)="navigate()"
    >
    </swal>
    <swal #errorSwal icon="error"> </swal>
  `,
  styleUrls: ['./meds-drug-create.component.scss']
})
export class MedsDrugCreateComponent implements OnInit {
  @ViewChild('successSwal') public readonly sucessSwal!: SwalComponent;
  @ViewChild('errorSwal') public readonly errorSwal!: SwalComponent;
  editMode = false;
  /** Solo en edición: el form se ve vacío hasta que llega la droga. */
  loading = false;
  errorText: string = '';
  medsDrugToUpdate: any;
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
    if (this.editMode) this.setDrug(itemId);
  }

  async setDrug(itemId: number) {
    this.loading = true;
    try {
      this.medsDrugToUpdate = await this.medsService.getMedsDrugById(itemId);
      this.form.patchValue(this.medsDrugToUpdate);
    } catch (error) {
      console.error('MedsDrugCreateComponent: error cargando la droga', error);
    } finally {
      this.loading = false;
    }
  }

  onSubmit() {
    this.editMode ? this.update() : this.create();
  }

  update() {
    this.medsService
      .updateMedsDrug(this.medsDrugToUpdate.id, this.form.value)
      .then(() => this.sucessSwal.fire())
      .catch(({error}: {error:any} ) => {
        this.errorSwal.update({ text: error.message });
        this.errorSwal.fire();
      });
  }

  create() {
    this.medsService
      .createMedsDrug(this.form.value)
      .then(() => this.sucessSwal.fire())
      .catch(({error}: {error:any}) => {
        this.errorSwal.update({ text: error.message });
        this.errorSwal.fire();
      });
  }

  navigate() {
    this.router.navigateByUrl('/modules/meds/drug/list');
  }


}
