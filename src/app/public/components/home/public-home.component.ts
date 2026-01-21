import { Component, inject } from '@angular/core';
import { TblUser } from 'src/app/models/TblUser';
import { StoreService } from 'src/app/services/store.service';
import { UsersService } from 'src/app/services/users.service';
import { DomainService } from 'src/app/services/domain.service';

@Component({
    selector: 'app-public-home',
    templateUrl: './public-home.component.html',
    styleUrls: ['./public-home.component.css'],
    standalone: false
})
export class PublicHomeComponent {
  private domainService = inject(DomainService);
  
  title = 'SuperEcommere';

  users:TblUser[]=[]
  userToEdit?:TblUser
  isStoreView = false;

  constructor(private userServies:UsersService,private storeService:StoreService){
  }
  ngOnInit():void{
    // 🚀 استخدام API الجديد - الباك إند يحدد المتجر من الدومين
    // Using new API - Backend determines store from domain
    this.storeService.getCurrentStore().subscribe({
      next: (response) => {
        console.log('🏪 Store resolution:', response);
        
        if (response.isStoreView && response.store) {
          // متجر موجود - Store found
          this.isStoreView = true;
          this.storeService.setCurrentStore(response.store);
          console.log('✅ Store loaded:', response.store.name);
        } else if (response.isMainPlatform) {
          // الموقع الرئيسي - Main platform
          this.isStoreView = false;
          console.log('📍 Main platform');
        }
      },
      error: (err) => {
        console.error('❌ Store resolution error:', err);
        this.isStoreView = false;
      }
    });
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
          // لا مشكلة - الصفحة الرئيسية لا تحتاج المستخدمين
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
