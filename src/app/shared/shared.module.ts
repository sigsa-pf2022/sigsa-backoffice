import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { BarchartComponent } from './components/barchart/barchart.component';
import { ModuleHeaderComponent } from './components/module-header/module-header.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { KpiCardComponent } from './components/kpi-card/kpi-card.component';
import { DateRangeSelectorComponent } from './components/date-range-selector/date-range-selector.component';
import { TableSkeletonComponent } from './components/table-skeleton/table-skeleton.component';
import { FormLoaderComponent } from './components/form-loader/form-loader.component';

@NgModule({
  declarations: [
    NavbarComponent,
    SidebarComponent,
    BarchartComponent,
    ModuleHeaderComponent,
    PaginationComponent,
    KpiCardComponent,
    DateRangeSelectorComponent,
    TableSkeletonComponent,
    FormLoaderComponent,
  ],
  imports: [CommonModule, FormsModule, RouterModule],
  exports: [
    NavbarComponent,
    SidebarComponent,
    BarchartComponent,
    ModuleHeaderComponent,
    PaginationComponent,
    KpiCardComponent,
    DateRangeSelectorComponent,
    TableSkeletonComponent,
    FormLoaderComponent,
  ],
})
export class SharedModule {}
