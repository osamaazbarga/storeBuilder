import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardHomeComponent } from './dashboard/home/admin-dashboard-home.component';
import { AdminFooterDashboardComponent } from './footer-dashboard/footer-dashboard.component';
import { AdminNavbarDashboardComponent } from './navbar-dashboard/navbar-dashboard.component';
import { AddEditMemberComponent } from './add-edit-member/add-edit-member.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdminViewComponent } from './admin-view/admin-view.component';





@NgModule({
  declarations: [
    AdminDashboardHomeComponent,
    AdminFooterDashboardComponent,
    AdminNavbarDashboardComponent,
    AddEditMemberComponent,
    AdminViewComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule
  ]
})
export class AdminModule { }
