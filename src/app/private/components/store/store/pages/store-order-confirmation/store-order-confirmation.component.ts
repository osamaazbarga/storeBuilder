import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdersService } from 'src/app/services/orders.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-store-order-confirmation',
  templateUrl: './store-order-confirmation.component.html',
  styleUrls: ['./store-order-confirmation.component.css'],
  standalone: false
})
export class StoreOrderConfirmationComponent implements OnInit {
  order: any;
  loading = true;
  store: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ordersService: OrdersService,
    private storeService: StoreService
  ) {}

  ngOnInit() {
    this.store = this.storeService.getStoreData();
    const orderNumber = this.route.snapshot.paramMap.get('orderNumber');
    if (orderNumber) {
      this.ordersService.getOrderByNumber(orderNumber).subscribe({
        next: (order) => { this.order = order; this.loading = false; },
        error: () => { this.loading = false; },
      });
    } else {
      this.loading = false;
    }
  }

  continueShopping() {
    if (this.store) {
      this.router.navigate(['store', this.store.link]);
    } else {
      this.router.navigate(['/']);
    }
  }
}
