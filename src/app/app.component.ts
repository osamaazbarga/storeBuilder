import { Component, OnInit } from '@angular/core';
import { UsersService } from './services/users.service';
import { SharedService } from './shared/shared.service';
import { StoreService } from './services/store.service';
import { Router } from '@angular/router';
import { SocketService } from './services/socket.service';
import { environment } from 'src/environments/environment';

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
    // Check for existing JWT and refresh user
    this.refreshUserOnInit();
    
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

  private refreshUserOnInit(): void {
    const jwt = this.userServies.getJWT();
    
    if (jwt) {
      console.log('🔐 JWT found, loading stored data...');
      // Simply load stored data from localStorage
      this.storeService.loadStoreDataFromStorage();
    } else {
      console.log('ℹ️ No JWT found');
    }
  }

  getSubdomain(): string | null {
    const host = window.location.hostname; // e.g. test12.dokn.net
    const parts = host.split('.');
    const platformDomain = environment.platformDomain;
  
    // Remove platform domain
    if (parts.length >= 3 && host.endsWith(`.${platformDomain}`)) {
      return parts[0]; // "test12"
    }
  
    return null; // Default domain (e.g., dokn.net)
  }

}
