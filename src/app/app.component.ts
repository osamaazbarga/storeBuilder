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

  const hostname = window.location.hostname; // ex: test.dokan.local
  this.storeName = hostname.split('.')[0];   // يرجع "test"
  console.log('🛍️ Current store:', this.storeName);
  }

  getSubdomain(): string | null {
    const host = window.location.hostname; // e.g. test12.dokan.local
    const parts = host.split('.');
    const platformDomain = 'dokan.local';
  
    // Remove platform domain
    if (parts.length >= 3 && host.endsWith(`.${platformDomain}`)) {
      return parts[0]; // "test12"
    }
  
    return null; // Default domain (e.g., dokan.local)
  }

}
