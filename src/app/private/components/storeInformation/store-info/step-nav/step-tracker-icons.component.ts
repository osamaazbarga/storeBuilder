import { Component, OnInit } from '@angular/core';
import { StoreInfoService } from '../../store-info.service';

@Component({
  selector: 'app-step-tracker-icons',
  templateUrl: './step-tracker-icons.component.html',
  styleUrls: ['./step-tracker-icons.component.scss']
})
export class StepTrackerIconsComponent implements OnInit {

  stepDetails: { step: number; description: string;}[] = [
    { step: 1, description: 'بسبس' },
    { step: 2, description: 'بسبس' },
    { step: 3, description: 'بسبس' },
    { step: 4, description: 'بسبسبس' }
  ]
  activeStep$?: number;

  constructor(private storeInfoService: StoreInfoService) { }

  ngOnInit(): void {
    this.storeInfoService.activeStep$.subscribe(
      activeStep => this.activeStep$ = activeStep);
  }

}
