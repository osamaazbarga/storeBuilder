import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';
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

  constructor(private router: Router) {}

  back() { this.router.navigate(['../store-info/address']); }
  next() { this.router.navigate(['../store-info/theme']); }
}
