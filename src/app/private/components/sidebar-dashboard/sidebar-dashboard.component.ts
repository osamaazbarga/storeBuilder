import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take, Subject, takeUntil } from 'rxjs';
import { User } from 'src/app/models/account/user';
import { StoreService } from 'src/app/services/store.service';
import { UsersService } from 'src/app/services/users.service';
import { LanguageService } from 'src/app/services/language.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sidebar-dashboard',
  templateUrl: './sidebar-dashboard.component.html',
  styleUrls: ['./sidebar-dashboard.component.scss'],
  standalone: false
})
export class SidebarDashboardComponent implements OnInit, OnDestroy {
  errorMessages: string[] = [];
  mode: string | undefined;
  storeData: any;
  currentLang: string = 'ar';
  isRTL: boolean = true;
  isMobileSidebarOpen: boolean = false;
  isCollapsed: boolean = false;
  activeRoute: string = '';
  defaultLogo: string = './assets/images/defult-img-store.jpg';
  private destroy$ = new Subject<void>();

  constructor(
    private storeService: StoreService,
    private userService: UsersService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public languageService: LanguageService
  ) {
    // Track route changes for active state
    this.router.events.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.activeRoute = this.router.url;
    });
  }

  ngOnInit() {
    // Set initial active route
    this.activeRoute = this.router.url;

    // Subscribe to language changes
    this.languageService.lang$.pipe(takeUntil(this.destroy$)).subscribe(lang => {
      this.currentLang = lang;
      this.isRTL = lang === 'ar' || lang === 'he';
    });

    // Subscribe to store data changes
    this.storeService.storeData$.pipe(takeUntil(this.destroy$)).subscribe(data => {
      if (data) {
        this.storeData = data;
      }
    });

    // Listen for window resize to handle responsive behavior
    this.handleWindowResize();

    // Check if token exists and load store data
    const token = this.userService.getJWT();
    if (token) {
      // Check for stored data first
      if (this.storeService.hasStoredStoreData()) {
        const storedData = this.storeService.getStoredStoreData();
        this.storeData = storedData;
        this.storeService.setStoreData(storedData);
      } else {
        // Fetch from server
        this.getMyStores();
      }
    } else {
      const mode = this.activatedRoute.snapshot.paramMap.get('mode');
      if (mode) {
        this.mode = mode;
      }
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Mobile Sidebar Toggle
  toggleMobileSidebar() {
    this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
    console.log('Mobile sidebar toggled:', this.isMobileSidebarOpen);
  }

  closeMobileSidebar() {
    this.isMobileSidebarOpen = false;
  }

  // Sidebar Collapse Toggle
  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
    console.log('Sidebar collapsed:', this.isCollapsed);
  }

  // Handle window resize
  private handleWindowResize() {
    if (typeof window !== 'undefined') {
      const checkScreenSize = () => {
        const isMobile = window.innerWidth <= 768;
        if (!isMobile && this.isMobileSidebarOpen) {
          this.isMobileSidebarOpen = false;
        }
      };

      // Initial check
      checkScreenSize();

      // Listen to resize events
      window.addEventListener('resize', checkScreenSize);
    }
  }

  // Handle overlay click
  onOverlayClick() {
    this.closeMobileSidebar();
  }

  // Handle ESC key
  onEscapeKey(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.isMobileSidebarOpen) {
      this.closeMobileSidebar();
    }
  }


  getStoreByUserId(userId:string){
    this.errorMessages=[];
    

      this.storeService.getStoreByUserId(userId).subscribe({
          next:(res:any)=>{
            if(res){
              this.storeData=res
            } 
            else{
              this.errorMessages.push("no Stores yet");
            }     
            // this.sharedService.showNotification(true,res.value.title,res.value.message);
            // this.router.navigateByUrl('/login')
          },
          error:error=>{
            if(error.error.errors){
              this.errorMessages=error.error.errors
              
            }
            else{
              this.errorMessages.push(error.error)
            }
            
          }
      })
    
  }

  getMyStores(){
    this.errorMessages=[];
    
    this.storeService.getMyStore().subscribe({
        next:(res:any)=>{
          if(res){
            this.storeData=res;
            // حفظ البيانات في localStorage
            this.storeService.setStoreData(res);
            console.log('Store data saved to localStorage:', res);
          } 
          else{
            this.errorMessages.push("no Stores yet");
          }     
        },
        error:error=>{
          if(error.error.errors){
            this.errorMessages=error.error.errors
            
          }
          else{
            this.errorMessages.push(error.error)
          }
          
        }
    })
  }

  routerLink() {
    if (!this.storeData?.link) {
      console.warn('No store link available');
      return;
    }
    // Navigate to store subdomain using platform domain from environment
    const protocol = environment.production ? 'https' : 'http';
    const port = environment.production ? '' : ':4200';
    window.location.href = `${protocol}://${this.storeData.link}.${environment.platformDomain}${port}/`;
  }

  /**
   * Check if a route is currently active
   */
  isRouteActive(route: string): boolean {
    return this.activeRoute === route || this.activeRoute.startsWith(route + '/');
  }

  /**
   * Navigate to a specific route
   */
  navigateTo(route: string) {
    this.router.navigate([route]);
    // Close mobile sidebar after navigation
    if (this.isMobileSidebarOpen) {
      this.closeMobileSidebar();
    }
  }

  itemList = [
    // الصفحة الرئيسية
    { labelKey: 'MERCHANT.DASHBOARD', icon: 'dashboard', route: '/dashboard' },

    // إدارة المتجر
    { labelKey: 'MERCHANT.STORE_MANAGEMENT', kind: "main" },
    { labelKey: 'MERCHANT.PRODUCTS', icon: 'inventory_2', route: '/dashboard/products' },
    { labelKey: 'MERCHANT.ORDERS', icon: 'shopping_cart', route: '/dashboard/orders' },
    { labelKey: 'MERCHANT.CUSTOMERS', icon: 'people', route: '/dashboard/customers' },
    { labelKey: 'MERCHANT.INVENTORY', icon: 'inventory', route: '/dashboard/inventory' },

    // التحليلات والتقارير
    { labelKey: 'MERCHANT.ANALYTICS_REPORTS', kind: "main" },
    { labelKey: 'MERCHANT.SALES_ANALYTICS', icon: 'analytics', route: '/dashboard/analytics' },
    { labelKey: 'MERCHANT.FINANCIAL_REPORTS', icon: 'assessment', route: '/dashboard/reports' },
    { labelKey: 'MERCHANT.CUSTOMER_INSIGHTS', icon: 'insights', route: '/dashboard/insights' },

    // التسويق والمبيعات
    { labelKey: 'MERCHANT.MARKETING_SALES', kind: "main" },
    { labelKey: 'MERCHANT.MARKETING_CAMPAIGNS', icon: 'campaign', route: '/dashboard/marketing' },
    { labelKey: 'MERCHANT.DISCOUNT_COUPONS', icon: 'local_offer', route: '/dashboard/coupons' },
    { labelKey: 'MERCHANT.EMAIL_MARKETING', icon: 'email', route: '/dashboard/email-marketing' },
    { labelKey: 'MERCHANT.SOCIAL_MEDIA', icon: 'share', route: '/dashboard/social' },

    // قنوات البيع
    { labelKey: 'MERCHANT.SALES_CHANNELS', kind: "main" },
    { labelKey: 'MERCHANT.ONLINE_STORE', icon: 'storefront', route: '/dashboard/online-store' },
    { labelKey: 'MERCHANT.MARKETPLACE', icon: 'shopping_bag', route: '/dashboard/marketplace' },
    { labelKey: 'MERCHANT.SOCIAL_COMMERCE', icon: 'shopping_basket', route: '/dashboard/social-commerce' },

    // الأدوات المساعدة
    { labelKey: 'MERCHANT.TOOLS_UTILITIES', kind: "main" },
    { labelKey: 'MERCHANT.BULK_ACTIONS', icon: 'batch_prediction', route: '/dashboard/bulk-actions' },
    { labelKey: 'MERCHANT.IMPORT_EXPORT', icon: 'import_export', route: '/dashboard/import-export' },
    { labelKey: 'MERCHANT.API_INTEGRATIONS', icon: 'api', route: '/dashboard/integrations' },

    // الإعدادات
    { labelKey: 'MERCHANT.SETTINGS', kind: "main" },
    { labelKey: 'MERCHANT.STORE_SETTINGS', icon: 'settings', route: '/dashboard/store-settings' },
    { labelKey: 'MERCHANT.CUSTOM_DOMAINS', icon: 'language', route: '/dashboard/custom-domains' },
    { labelKey: 'MERCHANT.PAYMENT_SETTINGS', icon: 'payment', route: '/dashboard/payment-settings' },
    { labelKey: 'MERCHANT.SHIPPING_SETTINGS', icon: 'local_shipping', route: '/dashboard/shipping' },
    { labelKey: 'MERCHANT.TAX_SETTINGS', icon: 'receipt', route: '/dashboard/tax-settings' },

    // المظهر والتصميم
    { labelKey: 'MERCHANT.DESIGN_APPEARANCE', kind: "main" },
    { labelKey: 'MERCHANT.THEME_CUSTOMIZATION', icon: 'palette', route: '/dashboard/themes' },
    { labelKey: 'MERCHANT.PAGE_BUILDER', icon: 'web', route: '/dashboard/page-builder' },
    { labelKey: 'MERCHANT.MOBILE_APP', icon: 'phone_android', route: '/dashboard/mobile-app' },

    // التطبيقات والإضافات
    { labelKey: 'MERCHANT.APPS_EXTENSIONS', kind: "main" },
    { labelKey: 'MERCHANT.INSTALLED_APPS', icon: 'extension', route: '/dashboard/installed-apps' },
    { labelKey: 'MERCHANT.APP_STORE', icon: 'apps', route: '/dashboard/app-store' },

    // الحساب والفوترة
    { labelKey: 'MERCHANT.ACCOUNT_BILLING', kind: "main" },
    { labelKey: 'MERCHANT.SUBSCRIPTION_PLAN', icon: 'card_membership', route: '/dashboard/subscription' },
    { labelKey: 'MERCHANT.BILLING_INVOICES', icon: 'receipt_long', route: '/dashboard/billing' },
    { labelKey: 'MERCHANT.ACCOUNT_SETTINGS', icon: 'account_circle', route: '/dashboard/account' }
  ];

}
