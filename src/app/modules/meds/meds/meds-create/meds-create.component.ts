import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { MedsService } from 'src/app/services/meds/meds.service';

@Component({
  selector: 'app-meds-create',
  template: `
    <div class="skeleton-container">
      <h3 class="pt-4">{{ this.editMode ? 'Editar' : 'Nuevo' }} medicamento</h3>
      <form class="me-3 mt-3" [formGroup]="this.form" (ngSubmit)="onSubmit()">
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
          <label for="laboratory" class="form-label">Laboratorio</label>
          <input
            type="text"
            class="form-control"
            formControlName="laboratory"
            id="laboratory"
          />
        </div>
        <div class="mb-3">
          <label for="code" class="form-label">Código</label>
          <input
            type="text"
            class="form-control"
            formControlName="code"
            id="code"
          />
        </div>
        <div class="mb-3">
          <label for="dosage" class="form-label">Dosis</label>
          <input
            type="text"
            class="form-control"
            formControlName="dosage"
            id="dosage"
          />
        </div>
        <div class="mb-3">
          <label for="drug" class="form-label">Droga</label>
          <select
            id="drug"
            class="form-select"
            aria-label="drugs"
            formControlName="drug"
          >
            <option *ngFor="let drug of this.drugs" [value]="drug.id">
              {{ drug.name }}
            </option>
          </select>
        </div>
        <div class="mb-3">
          <label for="type" class="form-label">Tipo</label>
          <select
            id="type"
            class="form-select"
            aria-label="types"
            formControlName="type"
          >
            <option *ngFor="let type of this.types" [value]="type.id">
              {{ type.name }}
            </option>
          </select>
        </div>
        <div class="mb-3">
          <label for="shape" class="form-label">Forma</label>
          <select
            id="shape"
            class="form-select"
            aria-label="forms"
            formControlName="shape"
          >
            <option *ngFor="let shape of this.shapes" [value]="shape.id">
              {{ shape.name }}
            </option>
          </select>
        </div>
        <div class="mb-3">
          <label for="measurementUnit" class="form-label"
            >Unidad de medida</label
          >
          <select
            id="measurementUnit"
            class="form-select"
            aria-label="measurementUnits"
            formControlName="measurementUnit"
          >
            <option
              *ngFor="let measurementUnit of this.measurementUnits"
              [value]="measurementUnit.id"
            >
              {{ measurementUnit.name }}
            </option>
          </select>
        </div>

        <div>
          <button
            class="btn btn-success me-3"
            [disabled]="!this.form.valid"
            type="submit"
          >
            Confirmar
          </button>
          <button class="btn btn-danger" (click)="navigate()">Cancelar</button>
        </div>
      </form>
    </div>
    <swal
      #successSwal
      [text]="
        'Droga del medicamento ' +
        (editMode ? 'editada' : 'creada') +
        ' correctamente'
      "
      icon="success"
      (confirm)="navigate()"
    >
    </swal>
    <swal #errorSwal icon="error"> </swal>
  `,
  styleUrls: ['./meds-create.component.scss'],
})
export class MedsCreateComponent implements OnInit {
  @ViewChild('successSwal') public readonly sucessSwal!: SwalComponent;
  @ViewChild('errorSwal') public readonly errorSwal!: SwalComponent;
  editMode = false;
  errorText: string = '';
  medsToUpdate: any;
  drugs: any[];
  types: any[];
  shapes: any[];
  measurementUnits: any[];
  form = this.fb.group({
    name: ['', Validators.required],
    laboratory: '',
    code: null,
    dosage: [null, Validators.required],
    shape: [null, Validators.required],
    type: [null, Validators.required],
    drug: [null, Validators.required],
    measurementUnit: [null, Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private medsService: MedsService
  ) {}
  ngOnInit(): void {
    this.setData();
    const itemId = this.route.snapshot.params['id'];
    this.editMode = itemId ? true : false;
    if (this.editMode) this.setMed(itemId);
  }

  async setData() {
    this.drugs = await this.medsService.getAllMedsDrugs();
    this.types = await this.medsService.getAllMedsTypes();
    this.shapes = await this.medsService.getAllMedsForms();
    this.measurementUnits = await this.medsService.getAllMedsMeasurements();
  }

  async setMed(itemId: number) {
    this.medsToUpdate = await this.medsService.getMedsById(itemId);
    this.form.patchValue(this.medsToUpdate);
  }

  onSubmit() {
    this.editMode ? this.update() : this.create();
  }

  update() {
    this.medsService
      .updateMeds(this.medsToUpdate.id, this.form.value)
      .then(() => this.sucessSwal.fire())
      .catch(({ error }: { error: any }) => {
        this.errorSwal.update({ text: error.message });
        this.errorSwal.fire();
      });
  }

  create() {
    this.medsService
      .createMeds(this.form.value)
      .then(() => this.sucessSwal.fire())
      .catch(({ error }: { error: any }) => {
        this.errorSwal.update({ text: error.message });
        this.errorSwal.fire();
      });
  }

  navigate() {
    this.router.navigateByUrl('/modules/meds/list');
  }
}
