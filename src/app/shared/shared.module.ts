import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { BarchartComponent } from './components/barchart/barchart.component';
import { ModuleHeaderComponent } from './components/module-header/module-header.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { KpiCardComponent } from './components/kpi-card/kpi-card.component';
import { DateRangeSelectorComponent } from './components/date-range-selector/date-range-selector.component';

@NgModule({
  declarations: [
    NavbarComponent,
    SidebarComponent,
    BarchartComponent,
    ModuleHeaderComponent,
    PaginationComponent,
    KpiCardComponent,
    DateRangeSelectorComponent,
  ],
  imports: [CommonModule, FormsModule],
  exports: [
    NavbarComponent,
    SidebarComponent,
    BarchartComponent,
    ModuleHeaderComponent,
    PaginationComponent,
    KpiCardComponent,
    DateRangeSelectorComponent,
  ],
})
export class SharedModule {}
