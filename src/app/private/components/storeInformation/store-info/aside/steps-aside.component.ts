import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-steps-aside',
  templateUrl: './steps-aside.component.html',
  styleUrls: ['./steps-aside.component.scss'],
  standalone: true
})
export class StepsAsideComponent {
  constructor(private router: Router) {}

  isActive(segment: 'identity'|'address'|'payments'|'theme'|'plan'): boolean {
    const url = this.router.url;
    return url.includes(`/store-info/${segment}`) || url.endsWith(`/store-info/${segment}`);
  }
}
