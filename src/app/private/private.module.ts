import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivateRoutingModule } from './private-routing.module';

import { NavbarDashboardComponent } from './components/navbar-dashboard/navbar-dashboard.component';
import { FooterDashboardComponent } from './components/footer-dashboard/footer-dashboard.component';
import { HomeComponent } from './components/dashboard/home/home.component';
import { SharedModule } from '../shared/shared.module';
import { SidebarDashboardComponent } from './components/sidebar-dashboard/sidebar-dashboard.component';


@NgModule({
  declarations: [
    NavbarDashboardComponent,
    FooterDashboardComponent,
    HomeComponent,
    SidebarDashboardComponent
  ],
  imports: [
    CommonModule,
    PrivateRoutingModule,
    SharedModule
  ]
})
export class PrivateModule { }
