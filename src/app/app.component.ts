import { Component, OnInit } from '@angular/core';
import { UsersService } from './services/users.service';
import { SharedService } from './shared/shared.service';
import { StoreService } from './services/store.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: false
})
export class AppComponent implements OnInit{
  store:any=null
  constructor(private userServies:UsersService,
    private sharedService:SharedService,private storeService:StoreService,
    private router: Router
  ){
    
  }
  ngOnInit():void{
    this.refreshUser()
    
  //   const subdomain = this.getSubdomain();
  // if (subdomain) {
  //   this.storeService.loadStoreBySubdomain(subdomain).subscribe({
  //     next: store => {
  //       this.store = store;
  //       console.log('Store loaded:', store);
  //     },
  //     error: err => {
  //       console.error('Store not found:', err);
  //     }
  //   });
  // }
  }

  getSubdomain(): string | null {
    const host = window.location.hostname; // e.g. test12.localtest.me
    const parts = host.split('.');
  
    // Remove localtest and top-level domain (e.g., me)
    if (parts.length >= 3) {
      return parts[0]; // "test12"
    }
  
    return null; // Default domain (e.g., localtest.me)
  }
  private refreshUser(){
    const jwt=this.userServies.getJWT();
    if(jwt){
      this.userServies.refreshUser(jwt).subscribe({
        next:_=>{

        },
        error:error=>{
          this.userServies.logout();
          if(error.status===401){
            this.sharedService.showNotification(false,'Account blocked',error.error)
          }
        }

      })


    }else{
      this.userServies.refreshUser(null).subscribe()
    }
  }
}
