import { Component, OnInit, inject } from '@angular/core';
import { UsersService } from './services/users.service';
import { SharedService } from './shared/shared.service';
import { StoreService } from './services/store.service';
import { Router } from '@angular/router';
import { SocketService } from './services/socket.service';
import { DomainService } from './services/domain.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: false
})
export class AppComponent implements OnInit{
  private domainService = inject(DomainService);
  
  store:any=null
  storeName = '';
  
  constructor(
    private userServies:UsersService,
    private sharedService:SharedService,
    private storeService:StoreService,
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
    
    // Get domain information using DomainService
    const domainInfo = this.domainService.getDomainInfo();
    console.log('🌐 App Domain Info:', domainInfo);
    
    if (domainInfo.storeIdentifier) {
      this.storeName = domainInfo.storeIdentifier;
      console.log('🛍️ Current store:', this.storeName);
      
      // Load store data if this is a store view
      if (domainInfo.isSubdomain || domainInfo.isCustomDomain) {
        this.storeService.loadStoreBySubdomain(domainInfo.storeIdentifier).subscribe({
          next: store => {
            this.store = store;
            console.log('✅ Store loaded in AppComponent:', store);
          },
          error: err => {
            console.error('❌ Store not found in AppComponent:', err);
          }
        });
      }
    }
  }

}
