import { Component, OnInit } from '@angular/core';
import { UsersService } from './services/users.service';
import { SharedService } from './shared/shared.service';
import { StoreService } from './services/store.service';
import { Router } from '@angular/router';
import { SocketService } from './services/socket.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: false
})
export class AppComponent implements OnInit{
  store:any=null
  storeName = '';
  constructor(private userServies:UsersService,
    private sharedService:SharedService,private storeService:StoreService,
    private router: Router,
    private socketService: SocketService
  ){
    
  }
  ngOnInit():void{
    // this.refreshUser()
    this.socketService.onNewMessage().subscribe(msg => {
      console.log('📥 Received from WS:', msg);
    });

    // إرسال رسالة للباك إند
    this.socketService.sendMessage('Hello from Angular!');
    
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

  const hostname = window.location.hostname; // ex: test.localtest.me
  this.storeName = hostname.split('.')[0];   // يرجع "test"
  console.log('🛍️ Current store:', this.storeName);
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
