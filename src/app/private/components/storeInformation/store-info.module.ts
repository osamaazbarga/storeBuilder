import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreInfoRoutingModule } from './store-info-routing.module';
import { SharedModule } from '../dashboard/shared.module';
import { StoreInfoComponent } from './store-info/store-info.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { StepOnePersonalDetailsComponent } from './store-info/form-steps/step-one-personal-details/step-one-personal-details.component';
import { StepTwoPlanDetailsComponent } from './store-info/form-steps/step-two-plan-details/step-two-plan-details.component';
import { StepThreeAddOnsComponent } from './store-info/form-steps/step-three-add-ons/step-three-add-ons.component';
import { StepFourSummaryComponent } from './store-info/form-steps/step-four-summary/step-four-summary.component';
import { StepFiveConfimComponent } from './store-info/form-steps/step-five-confim/step-five-confim.component';
import { ReactiveFormsModule } from '@angular/forms';
import { StepTrackerIconsComponent } from './store-info/step-nav/step-tracker-icons.component';
import { ProgressionButtonsComponent } from './store-info/progression-buttons/progression-buttons.component';



@NgModule({
  declarations: [
    StoreInfoComponent,
    StepTrackerIconsComponent,
    ProgressionButtonsComponent,
    // FormComponent,
    StepOnePersonalDetailsComponent,
    StepTwoPlanDetailsComponent,
    StepThreeAddOnsComponent,
    StepFourSummaryComponent,
    StepFiveConfimComponent
  ],
  imports: [
    CommonModule,
    StoreInfoRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    MaterialModule
  ]
})
export class StoreInfoModule { }
