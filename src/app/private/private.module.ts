import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



import { NavbarDashboardComponent } from './components/navbar-dashboard/navbar-dashboard.component';
import { FooterDashboardComponent } from './components/footer-dashboard/footer-dashboard.component';
import { HomeComponent } from './components/dashboard/home/home.component';
import { SharedModule } from '../shared/shared.module';
import { SidebarDashboardComponent } from './components/sidebar-dashboard/sidebar-dashboard.component';
import { StoreInfoComponent } from './components/storeInformation/store-info/store-info.component';
import { MainComponent } from './components/dashboard/pages/main/main.component';
import { PrivateRoutingModule } from './private-routing.module';
import { ProductsComponent } from './components/dashboard/pages/products/products.component';
import { ButtonComponent } from '../components/button/button.component';
import { PrimeNgCompnentsModule } from '../shared/prime-ng-compnents.module';
import { AddProductComponent } from './components/dashboard/pages/products/add-product/add-product.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MaterialModule } from '../shared/material.module';
import { DropDargComponent } from '../shared/components/drop-darg/drop-darg.component';
import { DragDropDirective } from '../shared/directives/drag-drop.directive';


@NgModule({
  declarations: [
    NavbarDashboardComponent,
    FooterDashboardComponent,
    HomeComponent,
    SidebarDashboardComponent,
    MainComponent,
    ProductsComponent,
    AddProductComponent,
    DropDargComponent,
    DragDropDirective

  
    
  ],
  imports: [
    CommonModule,
    SharedModule,
    PrivateRoutingModule,
    PrimeNgCompnentsModule,
    MatGridListModule,
    MaterialModule,
    
  ]
})
export class PrivateModule { }
