import { Component } from '@angular/core';
import { TblUser } from 'src/app/models/TblUser';
import { StoreService } from 'src/app/services/store.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
    selector: 'app-public-home',
    templateUrl: './public-home.component.html',
    styleUrls: ['./public-home.component.css'],
    standalone: false
})
export class PublicHomeComponent {
  title = 'SuperEcommere';

  users:TblUser[]=[]
  userToEdit?:TblUser
  isStoreView = false;

  constructor(private userServies:UsersService,private storeService:StoreService){
  }
  ngOnInit():void{

    const hostname = window.location.hostname; // test12.dokan.local
    const parts = hostname.split('.');
    const platformDomain = 'dokan.local';

    // If subdomain is present and not "www" or main domain
    if (hostname !== platformDomain && hostname !== `www.${platformDomain}` &&
        parts.length > 2 && parts[0] !== 'www' && parts[0] !== 'localhost') {
      this.isStoreView = true;
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
