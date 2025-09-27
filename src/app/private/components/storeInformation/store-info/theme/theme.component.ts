import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-store-theme',
  templateUrl: './theme.component.html',
  styleUrls: ['./theme.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ThemeComponent {
  constructor(private router: Router) {}
  back() { this.router.navigate(['../store-info/payments']); }
  next() { this.router.navigate(['../store-info/plan']); }
}
