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
    { labelKey: 'Orders', icon: 'shopping_bag', route: '/dashboard/orders' },
    { labelKey: 'Customers', icon: 'people', route: '/dashboard/customers' },
    { labelKey: 'Reports', icon: 'receipt_long', route: '/dashboard/customers' },
    { labelKey: 'Questions and Evaluations', icon: 'rate_review', route: '/dashboard/customers' },
    { labelKey: 'Marketing tools', icon: 'campaign', route: '/dashboard/customers' },
    { labelKey: 'Sales channels', icon: 'people', route: '/dashboard/customers' ,kind:"main"},
    { labelKey: 'Localy', icon: 'people', route: '/dashboard/customers' },
    { labelKey: 'Supporting tools', icon: 'people', route: '/dashboard/customers' ,kind:"main"},
    { labelKey: 'Merchant Services', icon: 'business_center', route: '/dashboard/customers' },
    { labelKey: 'Settings', icon: 'people', route: '/dashboard/customers' ,kind:"main"},
    { labelKey: 'Store plan', icon: 'store', route: '/dashboard/customers' },
    { labelKey: 'Store Settings', icon: 'settings', route: '/dashboard/customers' },
    { labelKey: 'Wallet & Billing', icon: 'wallet', route: '/dashboard/customers' },
    { labelKey: 'Store Appearance', icon: 'people', route: '/dashboard/customers' ,kind:"main"},
    { labelKey: 'Theme Store', icon: 'storefront', route: '/dashboard/customers' },
    { labelKey: 'New Store Design', icon: 'widget_width', route: '/dashboard/customers' },
    { labelKey: 'App Store', icon: 'people', route: '/dashboard/customers' ,kind:"main"},
    { labelKey: 'Installed Apps', icon: 'extension', route: '/dashboard/customers' },
    { labelKey: 'App Store', icon: 'apps', route: '/dashboard/customers' },



  ];

}
