import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { ProfessionalsService } from 'src/app/services/professionals/professionals.service';

@Component({
  selector: 'app-professionals-specializations-create',
  template: `
    <div class="skeleton-container">
      <h3 class="pt-4">{{ this.editMode ? 'Editar' : 'Nueva' }} Especialización</h3>
      <form class="me-3 mt-3" [formGroup]="this.form" (ngSubmit)="onSubmit()">
        <div class="mb-3">
          <label for="name" class="form-label">Nombre</label>
          <input type="text" class="form-control" formControlName="name" id="name" />
        </div>
        <div class="mb-3">
          <label for="description" class="form-label">Descripción</label>
          <textarea class="form-control" id="description" formControlName="description" rows="3"></textarea>
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
  styleUrls: ['./professionals-specializations-create.component.scss'],
})
export class ProfessionalsSpecializationsCreateComponent implements OnInit {
  @ViewChild('successSwal') public readonly sucessSwal!: SwalComponent;
  @ViewChild('errorSwal') public readonly errorSwal!: SwalComponent;
  editMode = false;
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
    this.professionalToUpdate = await this.professionalsService.getProfessionalsSpecializationById(itemId);
    this.form.patchValue(this.professionalToUpdate);
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
