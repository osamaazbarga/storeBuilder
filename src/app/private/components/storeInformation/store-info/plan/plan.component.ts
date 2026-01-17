import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StoreInfoService } from '../../store-info.service';

@Component({
  selector: 'app-store-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class PlanComponent {
  selectedPlan: string | null = null;

  constructor(
    private router: Router,
    private storeInfoService: StoreInfoService
  ) {
    // Sync active step with current route
    this.storeInfoService.setActiveStepFromRoute('plan', 5);
  }

  back() {
    this.router.navigate(['../store-info/theme']);
  }

  selectPlan(planId: string, planName: string, planPrice: string) {
    this.selectedPlan = planId;
    
    // Convert price string to number (remove text and extract number)
    const priceMatch = planPrice.match(/(\d+(?:\.\d+)?)/);
    const price = priceMatch ? parseFloat(priceMatch[1]) : 0;
    
    // Save plan selection to form
    this.storeInfoService.stepForm.patchValue({
      planDetails: {
        plan: planId,
        duration: planPrice.includes('سنوياً') || planPrice.includes('سنويًا') ? 'yearly' : 'monthly',
        planCost: price,
        totalCost: price
      }
    });
  }

  createStore() {
    if (!this.selectedPlan) {
      return;
    }
    
    // Validate form before submitting
    if (!this.storeInfoService.stepForm.valid) {
      return;
    }
    
    // Submit store creation
    this.storeInfoService.submit();
  }
}
