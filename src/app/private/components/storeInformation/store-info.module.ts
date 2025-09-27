import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreInfoRoutingModule } from './store-info-routing.module';
import { IdentityComponent } from './store-info/identity/identity.component';
import { AddressComponent } from './store-info/address/address.component';
import { PaymentsComponent } from './store-info/payments/payments.component';
import { ThemeComponent } from './store-info/theme/theme.component';
import { PlanComponent } from './store-info/plan/plan.component';
import { SharedModule } from '../dashboard/shared.module';
import { StoreInfoComponent } from './store-info/store-info.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { StepOnePersonalDetailsComponent } from './store-info/form-steps/step-one-personal-details/step-one-personal-details.component';
import { StepTwoPlanDetailsComponent } from './store-info/form-steps/step-two-plan-details/step-two-plan-details.component';
import { StepThreeAddOnsComponent } from './store-info/form-steps/step-three-add-ons/step-three-add-ons.component';
import { StepFourSummaryComponent } from './store-info/form-steps/step-four-summary/step-four-summary.component';
import { StepFiveConfimComponent } from './store-info/form-steps/step-five-confim/step-five-confim.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StepTrackerIconsComponent } from './store-info/step-nav/step-tracker-icons.component';
import { ProgressionButtonsComponent } from './store-info/progression-buttons/progression-buttons.component';
import { StepTwoAddProductComponent } from './store-info/form-steps/step-two-add-product/step-two-add-product.component';
import { StepThreeShippingComponent } from './store-info/form-steps/step-three-shipping/step-three-shipping.component';
import { StepFourPaymentsComponent } from './store-info/form-steps/step-four-payments/step-four-payments.component';
import { StepFiveThemesComponent } from './store-info/form-steps/step-five-themes/step-five-themes.component';
import { StepSixPlansComponent } from './store-info/form-steps/step-six-plans/step-six-plans.component';
import { NewStoreWizardComponent } from './store-info/new-wizard/new-store-wizard.component';
import { StepsAsideComponent } from './store-info/aside/steps-aside.component';



@NgModule({
  declarations: [
    StoreInfoComponent,
    // legacy components below remain declared but not used in new flow
    StepTrackerIconsComponent,
    ProgressionButtonsComponent,
    StepOnePersonalDetailsComponent,
    StepTwoPlanDetailsComponent,
    StepThreeAddOnsComponent,
    StepFourSummaryComponent,
    StepFiveConfimComponent,
    StepTwoAddProductComponent,
    StepThreeShippingComponent,
    StepFourPaymentsComponent,
    StepFiveThemesComponent,
    StepSixPlansComponent,
    NewStoreWizardComponent
  ],
  imports: [
    CommonModule,
    StoreInfoRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    MaterialModule,

    // new standalone wizard pages
    IdentityComponent,
    AddressComponent,
    PaymentsComponent,
    ThemeComponent,
    PlanComponent,
    StepsAsideComponent
  ]
})
export class StoreInfoModule { }
