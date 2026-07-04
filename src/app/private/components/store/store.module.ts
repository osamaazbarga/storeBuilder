import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '../dashboard/shared.module';
import { MaterialModule } from 'src/app/shared/material.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule as AppSharedModule } from 'src/app/shared/shared.module';

import { StoreComponent } from './store/store.component';
import { StoreHeaderComponent } from './store/components/store-header/store-header.component';
import { StoreHeroComponent } from './store/components/store-hero/store-hero.component';
import { StoreProductCardComponent } from './store/components/store-product-card/store-product-card.component';
import { StoreProductsGridComponent } from './store/components/store-products-grid/store-products-grid.component';
import { StoreCartSidebarComponent } from './store/components/store-cart-sidebar/store-cart-sidebar.component';
import { StoreFooterComponent } from './store/components/store-footer/store-footer.component';
import { StoreCheckoutComponent } from './store/pages/store-checkout/store-checkout.component';
import { StoreOrderConfirmationComponent } from './store/pages/store-order-confirmation/store-order-confirmation.component';
import { StoreProductDetailComponent } from './store/pages/store-product-detail/store-product-detail.component';

@NgModule({
  declarations: [
    StoreComponent,
    StoreHeaderComponent,
    StoreHeroComponent,
    StoreProductCardComponent,
    StoreProductsGridComponent,
    StoreCartSidebarComponent,
    StoreFooterComponent,
    StoreCheckoutComponent,
    StoreOrderConfirmationComponent,
    StoreProductDetailComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MaterialModule,
    AppSharedModule,
  ],
  exports: [
    StoreComponent,
  ]
})
export class StoreModule { }