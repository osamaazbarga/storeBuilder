import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TblUser } from 'src/app/models/TblUser';
import { StoreService } from 'src/app/services/store.service';
import { UsersService } from 'src/app/services/users.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-view',
    templateUrl: './view.component.html',
    styleUrls: ['./view.component.css'],
    standalone: false
})
export class ViewComponent {
  title = 'SuperEcommere';

  users:TblUser[]=[]
  userToEdit?:TblUser
  isStoreView = false;
  isLoginPage = false;
  
  constructor(private userServies:UsersService,private storeService:StoreService,private router:Router){
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects;
        this.isLoginPage = url === '/login';
      }
    });
    const hostname = window.location.hostname; // test12.dokan.local or shop1.local
    const parts = hostname.split('.');
    const platformDomain = environment.platformDomain; // ديناميكي من environment

    // Check if this is NOT the main platform domain
    const isMainPlatform = hostname === platformDomain || hostname === `www.${platformDomain}`;
    
    console.log('🌐 Domain Analysis:', { hostname, parts, platformDomain, isMainPlatform });
    
    if (!isMainPlatform && parts[0] !== 'localhost') {
      let storeIdentifier = '';
      let isCustomDomain = false;
      
      // Case 1: Subdomain of platform (e.g., store1.dokan.local)
      if (hostname.endsWith(`.${platformDomain}`) && parts.length > 2) {
        storeIdentifier = parts[0]; // "store1"
        isCustomDomain = false;
        console.log('🔍 Detected subdomain:', storeIdentifier);
      }
      // Case 2: Custom domain (e.g., shop1.local, mystore.com, www.dokn.shop)
      else if (!hostname.endsWith(`.${platformDomain}`) && hostname !== platformDomain) {
        storeIdentifier = hostname; // Full domain "www.dokn.shop"
        isCustomDomain = true;
        console.log('🔍 Detected custom domain:', storeIdentifier);
      }
      
      if (storeIdentifier) {
        // استخدام الـ method المناسب حسب نوع الدومين
        const loadObservable = isCustomDomain 
          ? this.storeService.loadStoreByCustomDomain(storeIdentifier)
          : this.storeService.loadStoreBySubdomain(storeIdentifier);
        
        loadObservable.subscribe({
          next: (store) => {
            this.isStoreView = true;
            console.log('✅ Store loaded:', store);
          },
          error: (err) => {
            console.error('❌ Store not found for:', storeIdentifier);
            console.error('Error:', err);
            // Don't redirect for custom domains, just show error
            // if (!isCustomDomain && hostname.endsWith(`.${platformDomain}`)) {
            //   window.location.href = `http://${platformDomain}:4200`;
            // }
          }
        });
      }
    }
  }
  ngOnInit():void{
    

    // تحميل المستخدمين فقط إذا كان المستخدم مسجل دخول
    // Loading users only if user is authenticated
    const token = localStorage.getItem('token');
    if (token) {
      this.userServies.getUsers().subscribe({
        next: (result: TblUser[]) => {
          this.users = result;
          console.log('✅ Users loaded:', this.users);
        },
        error: (error) => {
          console.warn('⚠️ Could not load users (requires authentication):', error.status);
          // لا مشكلة - الصفحة العامة لا تحتاج المستخدمين
        }
      });
    } else {
      console.log('ℹ️ No token found - skipping users load (public page)');
    }
  }

  updateEcommList(ecommeres:TblUser[]){
    this.users=ecommeres
  }
  // initNewEcomm(){
  //   this.ecommToEdit=new SuperEcommere()
  //   console.log("initNewEcomm",this.ecommToEdit)
  // }

  // editEcomm(ecomm:SuperEcommere){
  //   this.ecommToEdit=ecomm
  // }

  editUser(ecomm:TblUser){

    
    this.userToEdit=ecomm
  }
}
