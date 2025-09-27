import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { StoreInfoService } from '../../store-info.service';

@Component({
    selector: 'app-new-store-wizard',
    templateUrl: './new-store-wizard.component.html',
    styleUrls: ['./new-store-wizard.component.scss'],
    standalone: false
})
export class NewStoreWizardComponent implements OnInit {
  stepForm!: FormGroup;
  activeStep$?: number;

  constructor(private storeInfoService: StoreInfoService) {}

  ngOnInit(): void {
    this.stepForm = this.storeInfoService.stepForm;
    this.storeInfoService.activeStep$.subscribe(step => this.activeStep$ = step);
  }

  confirmAndSubmitForm() { this.storeInfoService.submit(); }
}
