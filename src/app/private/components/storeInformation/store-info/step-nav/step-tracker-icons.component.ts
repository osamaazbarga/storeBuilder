import { Component, OnInit } from '@angular/core';
import { StoreInfoService } from '../../store-info.service';

@Component({
    selector: 'app-step-tracker-icons',
    templateUrl: './step-tracker-icons.component.html',
    styleUrls: ['./step-tracker-icons.component.scss'],
    standalone: false
})
export class StepTrackerIconsComponent implements OnInit {

  stepDetails: { step: number; description: string;}[] = [
    { step: 1, description: 'معلومات المتجر' },
    { step: 2, description: 'أضف أول منتج' },
    { step: 3, description: 'فعل خيارات الشحن' },
    { step: 4, description: 'فعل المدفوعات الإلكترونية' },
    { step: 5, description: 'اختر تصميم متجرك' },
    { step: 6, description: 'اكتشف باقات سلة' }
  ]
  activeStep$?: number;

  constructor(private storeInfoService: StoreInfoService) { }

  ngOnInit(): void {
    this.storeInfoService.activeStep$.subscribe(
      activeStep => this.activeStep$ = activeStep);
  }

}
