import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ModulesModule } from './modules/modules.module';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ModulesModule,
    SharedModule,
    // Defaults en un solo lugar: el resto de la UI está en español y el
    // botón de confirmar venía con el "OK" por defecto de la librería.
    SweetAlert2Module.forRoot({
      provideSwal: () =>
        import('sweetalert2').then(({ default: swal }) =>
          swal.mixin({
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar',
          }),
        ),
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
