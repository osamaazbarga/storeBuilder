import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StoreInfoService } from '../../store-info.service';

@Component({
  selector: 'app-steps-aside',
  templateUrl: './steps-aside.component.html',
  styleUrls: ['./steps-aside.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class StepsAsideComponent {
  steps = [
    { number: 1, segment: 'identity' as const, label: 'معلومات المتجر' },
    { number: 2, segment: 'address' as const, label: 'عنوان الشحن' },
    { number: 3, segment: 'payments' as const, label: 'المدفوعات الإلكترونية' },
    { number: 4, segment: 'theme' as const, label: 'تصميم المتجر' },
    { number: 5, segment: 'plan' as const, label: 'الباقات' }
  ];

  constructor(
    private router: Router,
    private storeInfoService: StoreInfoService
  ) {}

  isActive(segment: 'identity'|'address'|'payments'|'theme'|'plan'): boolean {
    const url = this.router.url;
    return url.includes(`/store-info/${segment}`) || url.endsWith(`/store-info/${segment}`);
  }

  isCompleted(stepNumber: number): boolean {
    return this.storeInfoService.isStepCompleted(stepNumber);
  }

  canNavigateTo(stepNumber: number): boolean {
    return this.storeInfoService.canNavigateToStep(stepNumber);
  }

  navigateToStep(stepNumber: number): void {
    if (this.canNavigateTo(stepNumber)) {
      this.storeInfoService.navigateToStep(stepNumber);
    }
  }
}
