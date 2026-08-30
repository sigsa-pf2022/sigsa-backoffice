import { Component } from '@angular/core';

/**
 * Spinner centrado para los formularios de edición, que hacen fetch y recién
 * después parchean los campos. Sin esto el form se veía vacío y se llenaba solo.
 */
@Component({
  selector: 'app-form-loader',
  template: `
    <div class="form-loader sk-fade-in" role="status">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>
  `,
  styles: [
    `
      .form-loader {
        display: flex;
        justify-content: center;
        padding: 64px 24px;
      }
    `,
  ],
})
export class FormLoaderComponent {}
