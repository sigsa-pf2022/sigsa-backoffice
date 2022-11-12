import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { BarchartComponent } from './components/barchart/barchart.component';
import { ModuleHeaderComponent } from './components/module-header/module-header.component';
import { PaginationComponent } from './components/pagination/pagination.component';

@NgModule({
  declarations: [NavbarComponent, SidebarComponent, BarchartComponent, ModuleHeaderComponent, PaginationComponent],
  imports: [CommonModule],
  exports: [NavbarComponent, SidebarComponent, BarchartComponent, ModuleHeaderComponent, PaginationComponent],
})
export class SharedModule {}
