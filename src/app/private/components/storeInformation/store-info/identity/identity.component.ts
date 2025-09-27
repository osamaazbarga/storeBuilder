import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-store-identity',
  templateUrl: './identity.component.html',
  styleUrls: ['./identity.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class IdentityComponent {
  constructor(private router: Router) {}

  next() {
    this.router.navigate(['../store-info/address']);
  }
}
