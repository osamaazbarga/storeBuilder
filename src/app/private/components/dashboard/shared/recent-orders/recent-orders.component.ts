import { Component, OnInit, Input } from '@angular/core';

export interface Order {
  id: string;
  customerName: string;
  customerEmail?: string;
  customerAvatar?: string;
  orderDate: Date;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: number;
  paymentMethod: 'credit_card' | 'paypal' | 'bank_transfer' | 'cash_on_delivery';
}

@Component({
  selector: 'app-recent-orders',
  templateUrl: './recent-orders.component.html',
  styleUrls: ['./recent-orders.component.scss'],
  standalone: false
})
export class RecentOrdersComponent implements OnInit {
  @Input() orders: Order[] = [];
  @Input() title: string = 'DASHBOARD.RECENT_ORDERS';
  @Input() showActions: boolean = true;
  @Input() maxItems: number = 5;

  displayedOrders: Order[] = [];

  ngOnInit() {
    this.displayedOrders = this.orders.slice(0, this.maxItems);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending':
        return 'badge-warning';
      case 'processing':
        return 'badge-info';
      case 'shipped':
        return 'badge-primary';
      case 'delivered':
        return 'badge-success';
      case 'cancelled':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'pending':
        return 'hourglass_empty';
      case 'processing':
        return 'sync';
      case 'shipped':
        return 'local_shipping';
      case 'delivered':
        return 'check_circle';
      case 'cancelled':
        return 'cancel';
      default:
        return 'help';
    }
  }

  getPaymentIcon(method: string): string {
    switch (method) {
      case 'credit_card':
        return 'credit_card';
      case 'paypal':
        return 'payment';
      case 'bank_transfer':
        return 'account_balance';
      case 'cash_on_delivery':
        return 'money';
      default:
        return 'payment';
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatDate(date: Date): string {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return 'اليوم';
    } else if (diffDays === 2) {
      return 'أمس';
    } else if (diffDays <= 7) {
      return `منذ ${diffDays} أيام`;
    } else {
      return date.toLocaleDateString();
    }
  }

  getCustomerInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  onViewOrder(order: Order) {
    // Navigate to order details
    console.log('View order:', order.id);
  }

  onUpdateStatus(order: Order) {
    // Update order status
    console.log('Update status for order:', order.id);
  }

  onViewAllOrders() {
    // Navigate to orders page
    console.log('View all orders');
  }

  trackByOrderId(index: number, order: Order): string {
    return order.id;
  }
}
