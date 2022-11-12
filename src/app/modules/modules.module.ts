import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { MedsComponent } from './meds/meds/meds.component';
import { MedsTypeComponent } from './meds/meds-type/meds-type.component';
import { ProfessionalsComponent } from './professionals/professionals/professionals.component';
import { ProfessionalsSpecializationsComponent } from './professionals/professionals-specializations/professionals-specializations.component';
import { UsersComponent } from './users/users/users.component';
import { ProfessionalsSpecializationsCreateComponent } from './professionals/professionals-specializations-create/professionals-specializations-create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

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
    MedsTypeComponent,
    ProfessionalsComponent,
    ProfessionalsSpecializationsComponent,
    UsersComponent,
    ProfessionalsSpecializationsCreateComponent,
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
