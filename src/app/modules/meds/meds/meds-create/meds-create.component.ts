import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { MedsService } from 'src/app/services/meds/meds.service';

@Component({
  selector: 'app-meds-create',
  template: `
    <div class="app-page">
      <h1 class="page-title">{{ this.editMode ? 'Editar' : 'Nuevo' }} medicamento</h1>
      <app-form-loader *ngIf="this.loading"></app-form-loader>
      <form class="form-card" [formGroup]="this.form" (ngSubmit)="onSubmit()" *ngIf="!this.loading">
        <div class="form-grid">
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
  /** Los 4 selects arrancan vacíos, y en edición además hay que traer el med. */
  loading = true;
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
  async ngOnInit(): Promise<void> {
    const itemId = this.route.snapshot.params['id'];
    this.editMode = itemId ? true : false;

    this.loading = true;
    try {
      // Los catálogos y el medicamento a editar son independientes entre sí.
      await Promise.all([
        this.setData(),
        this.editMode ? this.setMed(itemId) : Promise.resolve(),
      ]);
    } catch (error) {
      console.error('MedsCreateComponent: error cargando el formulario', error);
    } finally {
      this.loading = false;
    }
  }

  async setData() {
    // Los cuatro catálogos son independientes: en paralelo el form aparece
    // en el tiempo de la request más lenta, no en la suma de las cuatro.
    const [drugs, types, shapes, measurementUnits] = await Promise.all([
      this.medsService.getAllMedsDrugs(),
      this.medsService.getAllMedsTypes(),
      this.medsService.getAllMedsForms(),
      this.medsService.getAllMedsMeasurements(),
    ]);
    this.drugs = drugs;
    this.types = types;
    this.shapes = shapes;
    this.measurementUnits = measurementUnits;
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
