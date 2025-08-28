import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UsersService } from 'src/app/services/users.service';
import { User } from 'src/app/models/account/user';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  icon: string;
  time: Date;
  read: boolean;
}

@Component({
  selector: 'app-navbar-dashboard',
  templateUrl: './navbar-dashboard.component.html',
  styleUrls: ['./navbar-dashboard.component.css'],
  standalone: false
})
export class NavbarDashboardComponent implements OnInit, OnDestroy {
  @Output() sidebarToggle = new EventEmitter<void>();
  
  currentUser: User | null = null;
  notifications: Notification[] = [];
  notificationCount = 0;
  
  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private usersService: UsersService
  ) {}

  ngOnInit() {
    this.initializeComponent();
    this.loadNotifications();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private initializeComponent() {
    const userSub = this.usersService.user$.subscribe(user => {
      this.currentUser = user;
    });
    
    this.subscriptions.push(userSub);
  }

  private loadNotifications() {
    // Mock notifications - replace with actual service call
    this.notifications = [
      {
        id: '1',
        title: 'DASHBOARD.NEW_ORDER_RECEIVED',
        message: 'Order #12345 has been placed',
        type: 'success',
        icon: 'shopping_cart',
        time: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        read: false
      },
      {
        id: '2',
        title: 'DASHBOARD.LOW_STOCK_ALERT',
        message: 'Product "T-Shirt" is running low',
        type: 'warning',
        icon: 'inventory_2',
        time: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        read: false
      },
      {
        id: '3',
        title: 'DASHBOARD.PAYMENT_RECEIVED',
        message: 'Payment of $150.00 received',
        type: 'primary',
        icon: 'payment',
        time: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        read: true
      }
    ];
    
    this.notificationCount = this.notifications.filter(n => !n.read).length;
  }

  getUserInitials(): string {
    if (!this.currentUser?.firstName) return 'U';
    
    return this.currentUser.firstName
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  formatNotificationTime(time: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) {
      return 'الآن';
    } else if (diffMins < 60) {
      return `منذ ${diffMins} دقيقة`;
    } else if (diffHours < 24) {
      return `منذ ${diffHours} ساعة`;
    } else {
      return `منذ ${diffDays} يوم`;
    }
  }

  // Search functionality
  onSearch(event: any) {
    const query = event.target.value;
    if (query.length > 2) {
      // Implement search logic
      console.log('Searching for:', query);
      // You can emit an event or call a service here
    }
  }

  // Quick Actions
  onQuickAction(action: string) {
    switch (action) {
      case 'add-product':
        this.router.navigate(['/dashboard/products/add']);
        break;
      case 'add-customer':
        this.router.navigate(['/dashboard/customers/add']);
        break;
      case 'create-campaign':
        this.router.navigate(['/dashboard/marketing/campaigns/create']);
        break;
      default:
        console.log('Quick action:', action);
    }
  }

  // Notification handlers
  onNotificationClick(notification: Notification) {
    // Mark as read
    notification.read = true;
    this.notificationCount = this.notifications.filter(n => !n.read).length;
    
    // Navigate based on notification type
    switch (notification.type) {
      case 'success':
        if (notification.icon === 'shopping_cart') {
          this.router.navigate(['/dashboard/orders']);
        }
        break;
      case 'warning':
        if (notification.icon === 'inventory_2') {
          this.router.navigate(['/dashboard/products']);
        }
        break;
      case 'primary':
        if (notification.icon === 'payment') {
          this.router.navigate(['/dashboard/billing']);
        }
        break;
    }
  }

  onViewAllNotifications() {
    this.router.navigate(['/dashboard/notifications']);
  }

  // Settings
  onOpenSettings() {
    this.router.navigate(['/dashboard/settings']);
  }

  // User Profile Actions
  onViewProfile() {
    this.router.navigate(['/dashboard/profile']);
  }

  onAccountSettings() {
    this.router.navigate(['/dashboard/account-settings']);
  }

  onBilling() {
    this.router.navigate(['/dashboard/billing']);
  }

  onLogout() {
    this.usersService.logout();
    this.router.navigate(['/login']);
  }

  // Mobile sidebar toggle
  toggleSidebar() {
    this.sidebarToggle.emit();
  }

  // Utility methods
  markAllNotificationsAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.notificationCount = 0;
  }

  clearNotifications() {
    this.notifications = [];
    this.notificationCount = 0;
  }

  addNotification(notification: Omit<Notification, 'id'>) {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString()
    };
    
    this.notifications.unshift(newNotification);
    if (!newNotification.read) {
      this.notificationCount++;
    }
    
    // Keep only last 10 notifications
    if (this.notifications.length > 10) {
      this.notifications = this.notifications.slice(0, 10);
    }
  }

  // Real-time notification simulation (for demo purposes)
  private simulateRealTimeNotifications() {
    setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance every interval
        this.addNotification({
          title: 'DASHBOARD.NEW_ACTIVITY',
          message: 'New activity in your store',
          type: 'info',
          icon: 'info',
          time: new Date(),
          read: false
        });
      }
    }, 30000); // Check every 30 seconds
  }
}
