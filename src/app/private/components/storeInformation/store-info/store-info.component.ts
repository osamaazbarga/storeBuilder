import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { StoreInfoService } from '../store-info.service';
// import { EXTRAS, Extra, PLANS, Plan } from './om';
// import { FormBuilder, Validators } from '@angular/forms';
// import { NgbCarousel, NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
// import { PrimeNGConfig } from 'primeng/api';
// import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-store-info',
  templateUrl: './store-info.component.html',
  styleUrls: ['./store-info.component.scss'],

})
export class StoreInfoComponent implements OnInit{
  stepForm!: FormGroup;
  activeStep$?: number;

  constructor(private storeInfoService: StoreInfoService) { }

  ngOnInit(): void {
    this.stepForm = this.storeInfoService.stepForm;

    this.storeInfoService.activeStep$.subscribe(
      step => this.activeStep$ = step
    );
  }


  confirmAndSubmitForm() {
    this.storeInfoService.submit();

  }
  
}
