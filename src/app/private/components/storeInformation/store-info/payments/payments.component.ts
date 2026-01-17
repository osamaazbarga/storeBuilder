import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StoreInfoService } from '../../store-info.service';

@Component({
  selector: 'app-store-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class PaymentsComponent {
  methods = [
    { key: 'card', label: 'البطاقة الائتمانية' },
    { key: 'mada', label: 'مدى' },
    { key: 'applepay', label: 'Apple Pay' },
    { key: 'tabby', label: 'تابي' },
    { key: 'tamara', label: 'تمارا' }
  ];

  constructor(
    private router: Router,
    private storeInfoService: StoreInfoService
  ) {
    // Sync active step with current route
    this.storeInfoService.setActiveStepFromRoute('payments', 3);
  }

  back() { 
    this.storeInfoService.goBackToPreviousStep(3);
  }

  next() { 
    // Mark step 3 as completed
    this.storeInfoService.goToNextStep(3);
  }
}
