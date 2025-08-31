import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take, Subscription, takeUntil, Subject } from 'rxjs';
import { User } from 'src/app/models/account/user';
import { StoreService } from 'src/app/services/store.service';
import { UsersService } from 'src/app/services/users.service';
import { LanguageService } from 'src/app/services/language.service';
import { StatCardData } from '../../shared/stat-card/stat-card.component';
import { ChartData } from '../../shared/sales-chart/sales-chart.component';
import { Order } from '../../shared/recent-orders/recent-orders.component';

interface PerformanceMetric {
  label: string;
  value: string;
  icon: string;
  iconClass: string;
  trendClass: string;
}

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css'],
    standalone: false
})
export class MainComponent implements OnInit, OnDestroy {
  errorMessages: string[] = [];
  mode: string | undefined;
  storeData: any = null;

  // Statistics Data
  statisticsData: StatCardData[] = [];

  // Chart Data
  salesChartData: ChartData = { labels: [], datasets: [] };
  revenueChartData: ChartData = { labels: [], datasets: [] };
  categoriesChartData: ChartData = { labels: [], datasets: [] };

  // Recent Orders Data
  recentOrdersData: Order[] = [];

  // Performance Metrics
  performanceMetrics: PerformanceMetric[] = [];

  // Language and RTL support
  currentLang: string = 'ar';
  isRTL: boolean = true;

  private destroy$ = new Subject<void>();
  private subscriptions: Subscription[] = [];

  constructor(
    private storeService: StoreService,
    private userService: UsersService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public languageService: LanguageService
  ) {}

  ngOnInit() {
    // Subscribe to language changes
    this.languageService.lang$.pipe(takeUntil(this.destroy$)).subscribe(lang => {
      this.currentLang = lang;
      this.isRTL = lang === 'ar' || lang === 'he';
    });

    this.initializeComponent();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

    private initializeComponent() {
   
    // Check if token exists
    const token = this.userService.getJWT();
    if (token) {
      console.log('Token found, fetching store data...');
      this.getMyStore();
    } else {
      console.log('No token found, using demo data');
      const mode = this.activatedRoute.snapshot.paramMap.get('mode');
      if (mode) {
        this.mode = mode;
        console.log(this.mode);
      }
      this.initializeDemoData();
    }
  }

  getStoreByUserId(userId: string) {
    this.errorMessages = [];
    
    // Use getMyStore instead of getStoreByUserId to use token
    const storeSub = this.storeService.getStoreByUserId(userId).subscribe({
      next: (res: any) => {
        console.log('Store data received:', res);

        if (res != null) {
          this.storeData = res;
          this.storeService.setStoreData(this.storeData);
          this.initializeStoreData();
        } else {
          this.errorMessages.push("no Stores yet");
          this.initializeDemoData();
        }
      },
      error: error => {
        console.error('Error fetching store:', error);
        if (error.error.errors) {
          this.errorMessages = error.error.errors;
        } else {
          this.errorMessages.push(error.error);
        }
        this.initializeDemoData();
      }
    });

    this.subscriptions.push(storeSub);
  }

  getMyStore() {
    this.errorMessages = [];

    // Use getMyStore to use token instead of user ID
    const storeSub = this.storeService.getMyStore().subscribe({
      next: (res: any) => {
        console.log('Store data received:', res);

        if (res != null) {
          this.storeData = res;
          this.storeService.setStoreData(this.storeData);
          this.initializeStoreData();
        } else {
          this.errorMessages.push("no Stores yet");
          this.initializeDemoData();
        }
      },
      error: error => {
        console.error('Error fetching store:', error);
        if (error.error.errors) {
          this.errorMessages = error.error.errors;
        } else {
          this.errorMessages.push(error.error);
        }
        this.initializeDemoData();
      }
    });

    this.subscriptions.push(storeSub);
  }

  private initializeStoreData() {
    // Initialize with real store data
    this.statisticsData = [
      {
        title: 'DASHBOARD.TOTAL_SALES',
        value: 125643,
        icon: 'trending_up',
        color: 'success',
        percentage: 12.5,
        trend: 'up',
        description: 'DASHBOARD.THIS_MONTH',
        prefix: '$'
      },
      {
        title: 'DASHBOARD.TOTAL_ORDERS',
        value: 1846,
        icon: 'shopping_cart',
        color: 'primary',
        percentage: 8.2,
        trend: 'up',
        description: 'DASHBOARD.THIS_MONTH'
      },
      {
        title: 'DASHBOARD.TOTAL_CUSTOMERS',
        value: 2957,
        icon: 'people',
        color: 'info',
        percentage: 15.3,
        trend: 'up',
        description: 'DASHBOARD.ACTIVE_CUSTOMERS'
      },
      {
        title: 'DASHBOARD.CONVERSION_RATE',
        value: 3.47,
        icon: 'percent',
        color: 'warning',
        percentage: -2.1,
        trend: 'down',
        description: 'DASHBOARD.THIS_MONTH',
        suffix: '%'
      }
    ];

    this.initializeChartData();
    this.initializeRecentOrders();
    this.initializePerformanceMetrics();
  }

  private initializeDemoData() {
    // Initialize with demo data for new users
    this.statisticsData = [
      {
        title: 'DASHBOARD.TOTAL_SALES',
        value: 0,
        icon: 'trending_up',
        color: 'success',
        description: 'DASHBOARD.START_SELLING',
        prefix: '$'
      },
      {
        title: 'DASHBOARD.TOTAL_ORDERS',
        value: 0,
        icon: 'shopping_cart',
        color: 'primary',
        description: 'DASHBOARD.AWAITING_ORDERS'
      },
      {
        title: 'DASHBOARD.TOTAL_CUSTOMERS',
        value: 0,
        icon: 'people',
        color: 'info',
        description: 'DASHBOARD.BUILD_CUSTOMER_BASE'
      },
      {
        title: 'DASHBOARD.PRODUCTS',
        value: 0,
        icon: 'inventory_2',
        color: 'warning',
        description: 'DASHBOARD.ADD_FIRST_PRODUCT'
      }
    ];

    this.recentOrdersData = [];
    this.initializeEmptyCharts();
    this.initializeEmptyMetrics();
  }

  private initializeChartData() {
    // Sales Chart Data
    this.salesChartData = {
      labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
      datasets: [{
        label: 'المبيعات',
        data: [12000, 19000, 15000, 25000, 22000, 30000],
        borderColor: 'rgba(231, 76, 60, 1)',
        backgroundColor: 'rgba(231, 76, 60, 0.1)',
        fill: true,
        tension: 0.4
      }]
    };

    // Revenue Chart Data
    this.revenueChartData = {
      labels: ['الأسبوع 1', 'الأسبوع 2', 'الأسبوع 3', 'الأسبوع 4'],
      datasets: [{
        label: 'الإيرادات',
        data: [8500, 12300, 9800, 15600],
        backgroundColor: ['rgba(231, 76, 60, 1)', 'rgba(241, 90, 74, 1)', 'rgba(76, 175, 80, 1)', 'rgba(255, 152, 0, 1)']
      }]
    };

    // Categories Chart Data
    this.categoriesChartData = {
      labels: ['إلكترونيات', 'ملابس', 'كتب', 'منزل وحديقة', 'رياضة'],
      datasets: [{
        label: 'المبيعات حسب الفئة',
        data: [35, 25, 15, 15, 10],
        backgroundColor: ['rgba(231, 76, 60, 1)', 'rgba(241, 90, 74, 1)', 'rgba(76, 175, 80, 1)', 'rgba(255, 152, 0, 1)', 'rgba(244, 67, 53, 1)']
      }]
    };
  }

  private initializeEmptyCharts() {
    this.salesChartData = {
      labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
      datasets: [{
        label: 'المبيعات',
        data: [0, 0, 0, 0, 0, 0],
        borderColor: 'rgba(231, 76, 60, 1)',
        backgroundColor: 'rgba(231, 76, 60, 0.1)',
        fill: true
      }]
    };

    this.revenueChartData = {
      labels: ['لا توجد بيانات'],
      datasets: [{
        label: 'الإيرادات',
        data: [0],
        backgroundColor: ['#e9ecef']
      }]
    };

    this.categoriesChartData = {
      labels: ['لا توجد بيانات'],
      datasets: [{
        label: 'الفئات',
        data: [1],
        backgroundColor: ['#e9ecef']
      }]
    };
  }

  private initializeRecentOrders() {
    this.recentOrdersData = [
      {
        id: 'ORD-001',
        customerName: 'أحمد محمد',
        customerEmail: 'ahmed@example.com',
        orderDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1), // 1 day ago
        status: 'delivered',
        total: 156.50,
        items: 3,
        paymentMethod: 'credit_card'
      },
      {
        id: 'ORD-002',
        customerName: 'فاطمة علي',
        customerEmail: 'fatima@example.com',
        orderDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
        status: 'shipped',
        total: 89.99,
        items: 2,
        paymentMethod: 'paypal'
      },
      {
        id: 'ORD-003',
        customerName: 'محمد حسن',
        customerEmail: 'mohamed@example.com',
        orderDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
        status: 'processing',
        total: 234.75,
        items: 5,
        paymentMethod: 'bank_transfer'
      }
    ];
  }

  private initializePerformanceMetrics() {
    this.performanceMetrics = [
      {
        label: 'DASHBOARD.PAGE_VIEWS',
        value: '12,543',
        icon: 'visibility',
        iconClass: 'text-info',
        trendClass: 'text-success'
      },
      {
        label: 'DASHBOARD.BOUNCE_RATE',
        value: '2.4%',
        icon: 'bounce_rate',
        iconClass: 'text-warning',
        trendClass: 'text-success'
      },
      {
        label: 'DASHBOARD.SESSION_DURATION',
        value: '3:42',
        icon: 'schedule',
        iconClass: 'text-primary',
        trendClass: 'text-success'
      },
      {
        label: 'DASHBOARD.RETURN_CUSTOMERS',
        value: '68%',
        icon: 'repeat',
        iconClass: 'text-success',
        trendClass: 'text-success'
      }
    ];
  }

  private initializeEmptyMetrics() {
    this.performanceMetrics = [
      {
        label: 'DASHBOARD.PAGE_VIEWS',
        value: '0',
        icon: 'visibility',
        iconClass: 'text-secondary',
        trendClass: 'text-secondary'
      },
      {
        label: 'DASHBOARD.CUSTOMERS',
        value: '0',
        icon: 'people',
        iconClass: 'text-secondary',
        trendClass: 'text-secondary'
      },
      {
        label: 'DASHBOARD.PRODUCTS',
        value: '0',
        icon: 'inventory_2',
        iconClass: 'text-secondary',
        trendClass: 'text-secondary'
      },
      {
        label: 'DASHBOARD.ORDERS',
        value: '0',
        icon: 'shopping_cart',
        iconClass: 'text-secondary',
        trendClass: 'text-secondary'
      }
    ];
  }

  // Event Handlers
  onQuickAction(action: string) {
    switch (action) {
      case 'add-product':
        this.router.navigate(['/dashboard/products/addproduct']);
        break;
      case 'view-orders':
        this.router.navigate(['/dashboard/orders']);
        break;
      case 'customer-support':
        console.log('Customer support');
        break;
      case 'marketing':
        this.router.navigate(['/dashboard/marketing']);
        break;
      case 'analytics':
        this.router.navigate(['/dashboard/analytics']);
        break;
      case 'settings':
        this.router.navigate(['/dashboard/store-settings']);
        break;
    }
  }

  onCreateStore() {
    this.router.navigate(['/store-info']);
  }

  // Track By Functions
  trackByStatId(index: number, stat: StatCardData): string {
    return stat.title;
  }

  trackByOrderId(index: number, order: Order): string {
    return order.id;
  }
}
