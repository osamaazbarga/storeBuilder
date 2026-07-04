import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-store-product-card',
  templateUrl: './store-product-card.component.html',
  styleUrls: ['./store-product-card.component.css'],
  standalone: false
})
export class StoreProductCardComponent {
  @Input() product: any;
  @Input() storeId!: number;
  @Output() cartUpdated = new EventEmitter<void>();

  constructor(
    private cartService: CartService,
    private router: Router,
    private messageService: MessageService
  ) {}

  addToCart(event: Event) {
    event.stopPropagation();
    if (!this.product || this.product.quantity === 0) return;

    this.cartService.addItem(this.storeId, {
      productId: this.product.id,
      title: this.product.title,
      image: this.product.pictureUrl,
      price: Number(this.product.price),
    });

    this.messageService.add({
      severity: 'success',
      summary: 'تمت الإضافة',
      detail: `${this.product.title} أُضيف للسلة`,
      life: 2500,
    });

    this.cartUpdated.emit();
  }

  viewProduct() {
    if (this.product?.id) {
      this.router.navigate(['/product', this.product.id]);
    }
  }
}
