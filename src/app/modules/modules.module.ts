import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { MedsComponent } from './meds/meds/meds.component';
import { ProfessionalsComponent } from './professionals/professionals/professionals.component';
import { ProfessionalsSpecializationsComponent } from './professionals/professionals-specializations/professionals-specializations.component';
import { UsersComponent } from './users/users/users.component';
import { ProfessionalsSpecializationsCreateComponent } from './professionals/professionals-specializations-create/professionals-specializations-create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { MedsFormListComponent } from './meds/meds-form/meds-form-list/meds-form-list.component';
import { MedsFormCreateComponent } from './meds/meds-form/meds-form-create/meds-form-create.component';
import { MedsMeasurementListComponent } from './meds/meds-measurement/meds-measurement-list/meds-measurement-list.component';
import { MedsMeasurementCreateComponent } from './meds/meds-measurement/meds-measurement-create/meds-measurement-create.component';
import { MedsTypeCreateComponent } from './meds/meds-type/meds-type-create/meds-type-create.component';
import { MedsTypeListComponent } from './meds/meds-type/meds-type-list/meds-type-list.component';
import { MedsDrugListComponent } from './meds/meds-drug/meds-drug-list/meds-drug-list.component';
import { MedsDrugCreateComponent } from './meds/meds-drug/meds-drug-create/meds-drug-create.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'meds_list',
    pathMatch: 'full',
  },
  {
    path: 'meds',
    children: [
      {
        path: 'list',
        component: MedsComponent,
      },
      {
        path: 'form',
        children:[
          {
            path: 'list',
            component: MedsFormListComponent,
          },
          {
            path: 'create',
            component: MedsFormCreateComponent,
          },
          {
            path: 'edit/:id',
            component: MedsFormCreateComponent,
          },
        ],
      },
      {
        path: 'measurement',
        children:[
          {
            path: 'list',
            component: MedsMeasurementListComponent,
          },
          {
            path: 'create',
            component: MedsMeasurementCreateComponent,
          },
          {
            path: 'edit/:id',
            component: MedsMeasurementCreateComponent,
          },
        ],
      },
      {
        path: 'type',
        children:[
          {
            path: 'list',
            component: MedsTypeListComponent,
          },
          {
            path: 'create',
            component: MedsTypeCreateComponent,
          },
          {
            path: 'edit/:id',
            component: MedsTypeCreateComponent,
          },
        ],
      },
      {
        path: 'drug',
        children:[
          {
            path: 'list',
            component: MedsDrugListComponent,
          },
          {
            path: 'create',
            component: MedsDrugCreateComponent,
          },
          {
            path: 'edit/:id',
            component: MedsDrugCreateComponent,
          },
        ],
      },
    ],
  },
  {
    path: 'professionals',
    children: [
      {
        path: 'list',
        component: ProfessionalsComponent,
      },
      {
        path: 'specializations',
        children: [
          {
            path: 'list',
            component: ProfessionalsSpecializationsComponent,
          },
          {
            path: 'create',
            component: ProfessionalsSpecializationsCreateComponent,
          },
          {
            path: 'edit/:id',
            component: ProfessionalsSpecializationsCreateComponent,
          },
        ],
      },
    ],
  },
  {
    path: 'users',
    children: [
      {
        path: 'list',
        component: UsersComponent,
      },
    ],
  },
];
@NgModule({
  declarations: [
    MedsComponent,
    ProfessionalsComponent,
    ProfessionalsSpecializationsComponent,
    UsersComponent,
    ProfessionalsSpecializationsCreateComponent,
    MedsFormListComponent,
    MedsFormCreateComponent,
    MedsMeasurementListComponent,
    MedsMeasurementCreateComponent,
    MedsTypeCreateComponent,
    MedsTypeListComponent,
    MedsDrugListComponent,
    MedsDrugCreateComponent,

  ],
  imports: [
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SharedModule,
    SweetAlert2Module,
  ],
})
export class ModulesModule {}
