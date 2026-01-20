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
export class AppComponent implements OnInit {
  constructor(
    private userServies: UsersService,
    private sharedService: SharedService,
    private storeService: StoreService,
    private router: Router,
    private socketService: SocketService
  ) {
    
  }

  ngOnInit(): void {
    // Check for existing JWT and refresh user
    this.refreshUserOnInit();
    
    // WebSocket setup
    this.socketService.onNewMessage().subscribe(msg => {
      console.log('📥 Received from WS:', msg);
    });

    // إرسال رسالة للباك إند
    this.socketService.sendMessage('Hello from Angular!');
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
}
