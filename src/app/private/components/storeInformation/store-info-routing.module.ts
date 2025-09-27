import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorizationGuard } from 'src/app/guards/auth.guard';
import { StoreInfoComponent } from './store-info/store-info.component';
import { NewStoreWizardComponent } from './store-info/new-wizard/new-store-wizard.component';
import { IdentityComponent } from './store-info/identity/identity.component';
import { AddressComponent } from './store-info/address/address.component';
import { PaymentsComponent } from './store-info/payments/payments.component';
import { ThemeComponent } from './store-info/theme/theme.component';
import { PlanComponent } from './store-info/plan/plan.component';


const routes: Routes = [
  {
    path: '',
    component: StoreInfoComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'identity' },
      { path: 'identity', component: IdentityComponent },
      { path: 'address', component: AddressComponent },
      { path: 'payments', component: PaymentsComponent },
      { path: 'theme', component: ThemeComponent },
      { path: 'plan', component: PlanComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreInfoRoutingModule { }
