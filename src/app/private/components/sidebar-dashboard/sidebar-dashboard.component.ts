import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { User } from 'src/app/models/account/user';
import { StoreService } from 'src/app/services/store.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-sidebar-dashboard',
  templateUrl: './sidebar-dashboard.component.html',
  styleUrls: ['./sidebar-dashboard.component.css']
})
export class SidebarDashboardComponent {
  errorMessages:string[]=[]
  mode:string|undefined;
  storeData:any

  constructor(private storeService:StoreService,private userService:UsersService,private activatedRoute:ActivatedRoute,private router:Router){
    this.userService.user$.pipe(take(1)).subscribe({
              next:(user:User|null)=>{
                if(user){
                    this.getStoreByUserId(user.id!)
                }
                else{
                  const mode=this.activatedRoute.snapshot.paramMap.get('mode');
                  if(mode){
                    this.mode=mode
                    console.log(this.mode);
                  }             
                }
              }
        })
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

  routerLink(){
    // this.router.navigateByUrl(`https://${this.storeData.link}.localtest.me:4200/`)
    window.location.href = `https://${this.storeData.link}.localtest.me:4200/`
   }

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
