import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-store-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class PlanComponent {
  constructor(private router: Router) {}
  back() { this.router.navigate(['../store-info/theme']); }
}
