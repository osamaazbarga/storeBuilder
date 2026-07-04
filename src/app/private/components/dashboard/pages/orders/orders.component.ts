import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { OrdersService } from 'src/app/services/orders.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
  standalone: false
})
export class OrdersComponent implements OnInit {
  store: any;
  orders: any[] = [];
  totalOrders = 0;
  loading = false;
  stats: any;
  selectedStatus: string | null = null;
  expandedRows: Record<string, boolean> = {};
  currentPage = 1;

  statusOptions = [
    { label: 'قيد الانتظار', value: 'PENDING' },
    { label: 'مؤكد', value: 'CONFIRMED' },
    { label: 'قيد المعالجة', value: 'PROCESSING' },
    { label: 'تم الشحن', value: 'SHIPPED' },
    { label: 'تم التسليم', value: 'DELIVERED' },
    { label: 'ملغي', value: 'CANCELLED' },
    { label: 'مسترد', value: 'REFUNDED' },
  ];

  constructor(
    private ordersService: OrdersService,
    private storeService: StoreService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.store = this.storeService.getStoreData();
    if (this.store?.id) {
      this.loadOrders();
      this.loadStats();
    }
  }

  loadOrders() {
    if (!this.store?.id) return;
    this.loading = true;
    this.ordersService.getStoreOrders(
      this.store.id,
      this.currentPage,
      20,
      this.selectedStatus || undefined
    ).subscribe({
      next: (data: any) => {
        this.orders = data.orders;
        this.totalOrders = data.total;
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }

  loadStats() {
    if (!this.store?.id) return;
    this.ordersService.getStoreStats(this.store.id).subscribe({
      next: (s: any) => { this.stats = s; },
    });
  }

  onLazyLoad(event: any) {
    this.currentPage = Math.floor(event.first / 20) + 1;
    this.loadOrders();
  }

  toggleExpand(order: any) {
    if (this.expandedRows[order.id]) {
      delete this.expandedRows[order.id];
    } else {
      this.expandedRows = { [order.id]: true };
    }
  }

  updateStatus(order: any, status: string) {
    this.ordersService.updateOrderStatus(order.id, status).subscribe({
      next: (updated: any) => {
        order.status = updated.status;
        this.messageService.add({
          severity: 'success',
          summary: 'تم التحديث',
          detail: `حالة الطلب ${order.orderNumber} تم تحديثها`,
        });
        this.loadStats();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'فشل تحديث الحالة' });
      },
    });
  }

  getStatusLabel(status: string): string {
    return this.statusOptions.find((s) => s.value === status)?.label ?? status;
  }

  getStatusSeverity(status: string): string {
    const map: Record<string, string> = {
      PENDING: 'warn',
      CONFIRMED: 'info',
      PROCESSING: 'info',
      SHIPPED: 'secondary',
      DELIVERED: 'success',
      CANCELLED: 'danger',
      REFUNDED: 'danger',
    };
    return map[status] || 'info';
  }

  getPaymentLabel(status: string): string {
    const map: Record<string, string> = { PENDING: 'معلق', PAID: 'مدفوع', FAILED: 'فشل', REFUNDED: 'مسترد' };
    return map[status] || status;
  }

  getPaymentSeverity(status: string): string {
    const map: Record<string, string> = { PENDING: 'warn', PAID: 'success', FAILED: 'danger', REFUNDED: 'secondary' };
    return map[status] || 'info';
  }
}
