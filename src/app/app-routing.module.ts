import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AdminGuard } from './shared/guards/admin.guard';
import { LoginGuard } from './shared/guards/login.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [AdminGuard] },
  {
    path: 'modules',
    canActivate: [AdminGuard],
    canActivateChild: [AdminGuard],
    canLoad: [AdminGuard],
    loadChildren: () => import('./modules/modules.module').then((m) => m.ModulesModule),
  },
  // Cualquier otra cosa cae al panel, y si no hay sesión el guard la manda al login.
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
