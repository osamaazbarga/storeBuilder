import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoreComponent } from './store/store.component';
import { StoreCheckoutComponent } from './store/pages/store-checkout/store-checkout.component';
import { StoreOrderConfirmationComponent } from './store/pages/store-order-confirmation/store-order-confirmation.component';

const routes: Routes = [
  { path: '', component: StoreComponent },
  { path: 'checkout', component: StoreCheckoutComponent },
  { path: 'order-confirmation/:orderNumber', component: StoreOrderConfirmationComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreRoutingModule { }
