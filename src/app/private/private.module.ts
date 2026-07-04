import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NavbarDashboardComponent } from './components/navbar-dashboard/navbar-dashboard.component';
import { FooterDashboardComponent } from './components/footer-dashboard/footer-dashboard.component';
import { DashboardHomeComponent } from './components/dashboard/home/dashboard-home.component';
import { SharedModule } from '../shared/shared.module';
import { SidebarDashboardComponent } from './components/sidebar-dashboard/sidebar-dashboard.component';
import { StoreInfoComponent } from './components/storeInformation/store-info/store-info.component';
import { MainComponent } from './components/dashboard/pages/main/main.component';
import { PrivateRoutingModule } from './private-routing.module';
import { ProductsComponent } from './components/dashboard/pages/products/products.component';
import { ButtonComponent } from '../components/button/button.component';
import { PrimeNgCompnentsModule } from '../shared/prime-ng-compnents.module';
import { MatGridListModule } from '@angular/material/grid-list';
import { MaterialModule } from '../shared/material.module';
import { DropDargComponent } from '../shared/components/drop-darg/drop-darg.component';
import { DragDropDirective } from '../shared/directives/drag-drop.directive';
import { SidebarItemComponent } from '../components/sidebar-item/sidebar-item.component';
import { TranslateModule } from '@ngx-translate/core';

import { AngularPinturaModule } from '@pqina/angular-pintura';
import { CategoriesComponent } from './components/dashboard/pages/products/categories/categories.component';
import { CustomDomainsNewComponent } from './components/custom-domains/custom-domains-new.component';
import { StoreDesignComponent } from './components/dashboard/pages/store-design/store-design.component';
import { OrdersComponent } from './components/dashboard/pages/orders/orders.component';

// Dashboard Shared Components
import { SharedModule as DashboardSharedModule } from './components/dashboard/shared.module';

@NgModule({
  declarations: [
    NavbarDashboardComponent,
    FooterDashboardComponent,
    DashboardHomeComponent,
    SidebarDashboardComponent,
    MainComponent,
    ProductsComponent,
    DropDargComponent,
    DragDropDirective,
    SidebarItemComponent,
    CategoriesComponent,
    StoreDesignComponent,
    OrdersComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    SharedModule,
    DashboardSharedModule,
    PrivateRoutingModule,
    PrimeNgCompnentsModule,
    MatGridListModule,
    MaterialModule,
    TranslateModule.forChild(),
    AngularPinturaModule,
    CustomDomainsNewComponent
  ],
  exports: [
    DashboardHomeComponent,
    MainComponent,
    ProductsComponent,
    CategoriesComponent,
    StoreDesignComponent,
    OrdersComponent
  ]
})
export class PrivateModule { }
