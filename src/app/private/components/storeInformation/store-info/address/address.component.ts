import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StoreInfoService } from '../../store-info.service';

@Component({
  selector: 'app-store-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class AddressComponent {
  constructor(
    private router: Router,
    private storeInfoService: StoreInfoService
  ) {
    // Sync active step with current route
    this.storeInfoService.setActiveStepFromRoute('address', 2);
  }

  back() { 
    this.storeInfoService.goBackToPreviousStep(2);
  }

  next() { 
    // Mark step 2 as completed
    this.storeInfoService.goToNextStep(2);
  }
}
