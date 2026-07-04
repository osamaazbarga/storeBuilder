import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CartService } from 'src/app/services/cart.service';
import { StoreService } from 'src/app/services/store.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-store-product-detail',
  templateUrl: './store-product-detail.component.html',
  styleUrls: ['./store-product-detail.component.css'],
  standalone: false
})
export class StoreProductDetailComponent implements OnInit {
  product: any = null;
  store: any = null;
  loading = true;
  quantity = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storeService: StoreService,
    private cartService: CartService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.store = this.storeService.getStoreData();

    const productId = Number(this.route.snapshot.paramMap.get('id'));
    if (!productId) {
      this.goBack();
      return;
    }

    this.storeService.getProductById(productId).pipe(
      catchError(() => of(null))
    ).subscribe((product) => {
      this.loading = false;
      if (!product) {
        this.goBack();
        return;
      }
      this.product = product;
    });
  }

  get maxQty(): number {
    return this.product?.quantity ?? 0;
  }

  incrementQty() {
    if (this.quantity < this.maxQty) this.quantity++;
  }

  decrementQty() {
    if (this.quantity > 1) this.quantity--;
  }

  addToCart() {
    if (!this.product || this.product.quantity === 0) return;

    for (let i = 0; i < this.quantity; i++) {
      this.cartService.addItem(this.store?.id, {
        productId: this.product.id,
        title: this.product.title,
        image: this.product.pictureUrl,
        price: Number(this.product.price),
      });
    }

    this.messageService.add({
      severity: 'success',
      summary: 'تمت الإضافة',
      detail: `${this.quantity}× ${this.product.title} أُضيف للسلة`,
      life: 2500,
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
