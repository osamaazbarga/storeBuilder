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
    // Use DomainService to detect if this is a store view
    this.isStoreView = this.domainService.isStoreView();
    
    const domainInfo = this.domainService.getDomainInfo();
    console.log('🏪 Domain Info:', domainInfo);

    // If this is a store view, load store data
    if (this.isStoreView && domainInfo.storeIdentifier) {
      this.storeService.loadStoreBySubdomain(domainInfo.storeIdentifier).subscribe({
        next: (store) => {
          console.log('✅ Store loaded:', store);
        },
        error: (err) => {
          console.error('❌ Store not found:', err);
          // Redirect to main platform if store not found
          this.domainService.navigateToMainPlatform();
        }
      });
    }
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
