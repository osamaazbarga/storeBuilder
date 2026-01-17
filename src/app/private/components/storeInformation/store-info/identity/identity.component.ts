import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { StoreInfoService } from '../../store-info.service';

@Component({
  selector: 'app-store-identity',
  templateUrl: './identity.component.html',
  styleUrls: ['./identity.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class IdentityComponent implements OnInit {
  stepForm!: FormGroup;
  selectedStoreType: string = 'individual';

  constructor(
    private router: Router,
    private storeInfoService: StoreInfoService
  ) {}

  ngOnInit(): void {
    this.stepForm = this.storeInfoService.stepForm;
    
    // Sync active step with current route
    this.storeInfoService.setActiveStepFromRoute('identity', 1);
    
    // Load saved values if any
    const savedValues = this.stepForm.value.personalDetails;
    if (savedValues.storeName || savedValues.storeLink) {
      // Form values are already loaded through service
    }
  }

  next() {
    // Mark form group as touched to show validation errors
    const personalDetails = this.stepForm.get('personalDetails');
    if (personalDetails) {
      personalDetails.markAllAsTouched();
    }

    // Check if form is valid before proceeding
    if (this.stepForm.get('personalDetails')?.valid) {
      this.storeInfoService.goToNextStep(1);
    }
  }

  selectStoreType(type: string) {
    this.selectedStoreType = type;
    // You can save store type to form if needed
    // this.stepForm.patchValue({
    //   personalDetails: {
    //     ...this.stepForm.value.personalDetails,
    //     storeType: type
    //   }
    // });
  }

  get personalDetailsForm(): FormGroup {
    return this.stepForm.get('personalDetails') as FormGroup;
  }
}
