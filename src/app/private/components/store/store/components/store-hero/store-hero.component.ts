import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-store-hero',
  templateUrl: './store-hero.component.html',
  styleUrls: ['./store-hero.component.css'],
  standalone: false
})
export class StoreHeroComponent implements OnChanges {
  @Input() theme: any;

  heroBg = '';

  ngOnChanges() {
    this.heroBg = this.theme?.heroBannerImage
      ? `url('${this.theme.heroBannerImage}')`
      : `linear-gradient(135deg, var(--store-primary, #6366F1) 0%, var(--store-secondary, #EC4899) 100%)`;
  }

  scrollToProducts() {
    const el = document.getElementById('products-section');
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
