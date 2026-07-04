import {
  Component, Input, Output, EventEmitter, OnInit, OnDestroy, HostListener
} from '@angular/core';
import { Subscription } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';
import { StoreCategory } from 'src/app/services/store-categories.service';

@Component({
  selector: 'app-store-header',
  templateUrl: './store-header.component.html',
  styleUrls: ['./store-header.component.css'],
  standalone: false
})
export class StoreHeaderComponent implements OnInit, OnDestroy {
  @Input() store: any;
  @Input() categories: StoreCategory[] = [];
  @Input() selectedCategory: StoreCategory | null = null;

  @Output() categorySelected = new EventEmitter<StoreCategory | null>();
  @Output() searchChanged = new EventEmitter<string>();
  @Output() cartToggled = new EventEmitter<void>();

  cartCount = 0;
  searchQuery = '';
  mobileMenuOpen = false;
  isScrolled = false;

  private sub?: Subscription;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    if (this.store?.id) {
      this.sub = this.cartService.cartCount$(this.store.id).subscribe(
        (count) => (this.cartCount = count)
      );
    }
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled = window.scrollY > 10;
  }

  selectCategory(cat: StoreCategory | null) {
    this.categorySelected.emit(cat);
    this.mobileMenuOpen = false;
  }

  onSearch() {
    this.searchChanged.emit(this.searchQuery);
  }

  toggleCart() {
    this.cartToggled.emit();
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }
}
