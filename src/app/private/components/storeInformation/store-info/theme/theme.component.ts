import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StoreInfoService } from '../../store-info.service';

@Component({
  selector: 'app-store-theme',
  templateUrl: './theme.component.html',
  styleUrls: ['./theme.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ThemeComponent {
  constructor(
    private router: Router,
    private storeInfoService: StoreInfoService
  ) {
    // Sync active step with current route
    this.storeInfoService.setActiveStepFromRoute('theme', 4);
  }

  back() { 
    this.storeInfoService.goBackToPreviousStep(4);
  }

  next() { 
    // Mark step 4 as completed
    this.storeInfoService.goToNextStep(4);
  }
}
