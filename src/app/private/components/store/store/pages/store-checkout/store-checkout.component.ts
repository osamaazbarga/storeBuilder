import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CartService, CartItem } from 'src/app/services/cart.service';
import { OrdersService } from 'src/app/services/orders.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-store-checkout',
  templateUrl: './store-checkout.component.html',
  styleUrls: ['./store-checkout.component.css'],
  standalone: false
})
export class StoreCheckoutComponent implements OnInit {
  store: any;
  cartItems: CartItem[] = [];
  cartTotal = 0;
  paymentMethods: any[] = [];
  submitting = false;

  checkoutForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService,
    private ordersService: OrdersService,
    private storeService: StoreService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.store = this.storeService.getStoreData();

    if (!this.store) {
      this.router.navigate(['/']);
      return;
    }

    this.cartItems = this.cartService.getCart(this.store.id);
    this.cartTotal = this.cartService.getCartTotal(this.store.id);

    this.buildForm();
    this.loadPaymentMethods();
  }

  private buildForm() {
    this.checkoutForm = this.fb.group({
      customerName: ['', [Validators.required, Validators.minLength(3)]],
      customerEmail: ['', [Validators.required, Validators.email]],
      customerPhone: [''],
      shippingAddress: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        district: [''],
        postalCode: [''],
        country: ['SA', Validators.required],
      }),
      paymentMethod: ['mock_card', Validators.required],
      notes: [''],
    });
  }

  private loadPaymentMethods() {
    // Load store's enabled payment methods from store data
    if (this.store?.paymentMethods) {
      this.paymentMethods = this.store.paymentMethods.filter((m: any) => m.isActive);
    }
  }

  selectPayment(method: string) {
    this.checkoutForm.patchValue({ paymentMethod: method });
  }

  placeOrder() {
    if (this.checkoutForm.invalid || this.cartItems.length === 0) return;

    this.submitting = true;
    const formValue = this.checkoutForm.value;

    const payload = {
      storeId: this.store.id,
      customerName: formValue.customerName,
      customerEmail: formValue.customerEmail,
      customerPhone: formValue.customerPhone || undefined,
      shippingAddress: formValue.shippingAddress,
      paymentMethod: formValue.paymentMethod,
      notes: formValue.notes || undefined,
      items: this.cartItems.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
      })),
    };

    this.ordersService.createOrder(payload).subscribe({
      next: (order) => {
        this.cartService.clearCart(this.store.id);
        this.router.navigate(['/order-confirmation', order.orderNumber]);
      },
      error: (err) => {
        this.submitting = false;
        this.messageService.add({
          severity: 'error',
          summary: 'خطأ',
          detail: err?.error?.message || 'حدث خطأ أثناء إرسال الطلب',
        });
      },
    });
  }

  goBack() {
    this.router.navigate(['store', this.store.link]);
  }
}
