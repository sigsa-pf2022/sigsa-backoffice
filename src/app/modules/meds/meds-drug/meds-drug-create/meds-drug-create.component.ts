import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { MedsService } from 'src/app/services/meds/meds.service';

@Component({
  selector: 'app-meds-drug-create',
  template: `
    <div class="skeleton-container">
      <h3 class="pt-4">{{ this.editMode ? 'Editar' : 'Nueva' }} Droga </h3>
      <form class="me-3 mt-3" [formGroup]="this.form" (ngSubmit)="onSubmit()">
        <div class="mb-3">
          <label for="name" class="form-label">Nombre</label>
          <input type="text" class="form-control" formControlName="name" id="name" />
        </div>
        <div>
          <button class="btn btn-success me-3" [disabled]="!this.form.valid" type="submit">Confirmar</button>
          <button class="btn btn-danger" (click)="navigate()">Cancelar</button>
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
  styleUrls: ['./meds-drug-create.component.scss']
})
export class MedsDrugCreateComponent implements OnInit {
  @ViewChild('successSwal') public readonly sucessSwal!: SwalComponent;
  @ViewChild('errorSwal') public readonly errorSwal!: SwalComponent;
  editMode = false;
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
    this.medsDrugToUpdate = await this.medsService.getMedsDrugById(itemId);
    this.form.patchValue(this.medsDrugToUpdate);
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
