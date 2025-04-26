import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar-dashboard',
  templateUrl: './sidebar-dashboard.component.html',
  styleUrls: ['./sidebar-dashboard.component.css']
})
export class SidebarDashboardComponent {
  itemList = [
    { labelKey: 'MERCHANT.DASHBOARD', icon: 'dashboard', route: '/dashboard' },
    { labelKey: 'MERCHANT.PRODUCTS', icon: 'apparel', route: '/dashboard/products' },
    { labelKey: 'MERCHANT.ORDERS', icon: 'shopping_bag', route: '/dashboard/orders' },
    { labelKey: 'MERCHANT.CUDTOMERS', icon: 'people', route: '/dashboard/customers' },
    { labelKey: 'MERCHANT.REPORTS', icon: 'receipt_long', route: '/dashboard/customers' },
    { labelKey: 'MERCHANT.QUESTIONSANDEVALUATIONS', icon: 'rate_review', route: '/dashboard/customers' },
    { labelKey: 'MERCHANT.MARKETINGTOOLS', icon: 'campaign', route: '/dashboard/customers' },
    { labelKey: 'MERCHANT.SALESCHANNELS', icon: 'people', route: '/dashboard/customers' ,kind:"main"},
    { labelKey: 'MERCHANT.LOCALY', icon: 'people', route: '/dashboard/customers' },
    { labelKey: 'MERCHANT.SUPPORTINGTOOLS', icon: 'people', route: '/dashboard/customers' ,kind:"main"},
    { labelKey: 'MERCHANT.MERCHANTSERVICES', icon: 'business_center', route: '/dashboard/customers' },
    { labelKey: 'MERCHANT.SETTINGS', icon: 'people', route: '/dashboard/customers' ,kind:"main"},
    { labelKey: 'MERCHANT.STOREPLAN', icon: 'store', route: '/dashboard/customers' },
    { labelKey: 'MERCHANT.STORESETTINGS', icon: 'settings', route: '/dashboard/customers' },
    { labelKey: 'MERCHANT.WALLETANDBILLING', icon: 'wallet', route: '/dashboard/customers' },
    { labelKey: 'MERCHANT.STOREAPPEARANCE', icon: 'people', route: '/dashboard/customers' ,kind:"main"},
    { labelKey: 'MERCHANT.THEMESTORE', icon: 'storefront', route: '/dashboard/customers' },
    { labelKey: 'MERCHANT.NEWSTOREDESIGN', icon: 'widget_width', route: '/dashboard/customers' },
    { labelKey: 'MERCHANT.APPSTORE', icon: 'people', route: '/dashboard/customers' ,kind:"main"},
    { labelKey: 'MERCHANT.INSTALLEDAPPS', icon: 'extension', route: '/dashboard/customers' },
    { labelKey: 'MERCHANT.VISITAPPSTORE', icon: 'apps', route: '/dashboard/customers' },



  ];

}
