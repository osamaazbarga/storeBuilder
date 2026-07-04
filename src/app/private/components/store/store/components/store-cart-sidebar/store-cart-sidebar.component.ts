import {
  Component, Input, Output, EventEmitter, OnInit, OnDestroy, OnChanges
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartItem, CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-store-cart-sidebar',
  templateUrl: './store-cart-sidebar.component.html',
  styleUrls: ['./store-cart-sidebar.component.css'],
  standalone: false
})
export class StoreCartSidebarComponent implements OnInit, OnDestroy {
  @Input() storeId!: number;
  @Input() visible = false;
  @Input() storeLink?: string;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() closed = new EventEmitter<void>();

  items: CartItem[] = [];
  total = 0;
  totalCount = 0;

  private sub?: Subscription;

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit() {
    if (this.storeId) {
      this.sub = this.cartService.getCart$(this.storeId).subscribe((items) => {
        this.items = items;
        this.total = this.cartService.getCartTotal(this.storeId);
        this.totalCount = this.cartService.itemCount(this.storeId);
      });
    }
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  increment(item: CartItem) {
    this.cartService.updateQuantity(this.storeId, item.productId, item.quantity + 1, item.variantId);
  }

  decrement(item: CartItem) {
    this.cartService.updateQuantity(this.storeId, item.productId, item.quantity - 1, item.variantId);
  }

  removeItem(item: CartItem) {
    this.cartService.removeItem(this.storeId, item.productId, item.variantId);
  }

  closeCart() {
    this.visibleChange.emit(false);
    this.closed.emit();
  }

  onClose() {
    this.visibleChange.emit(false);
    this.closed.emit();
  }

  goToCheckout() {
    this.closeCart();
    this.router.navigate(['/checkout']);
  }
}
