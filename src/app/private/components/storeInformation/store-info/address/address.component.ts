import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-store-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class AddressComponent {
  constructor(private router: Router) {}

  back() { this.router.navigate(['../store-info/identity']); }
  next() { this.router.navigate(['../store-info/payments']); }
}
