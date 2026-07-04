import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-store-footer',
  templateUrl: './store-footer.component.html',
  styleUrls: ['./store-footer.component.css'],
  standalone: false
})
export class StoreFooterComponent {
  @Input() store: any;
  year = new Date().getFullYear();

  scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
