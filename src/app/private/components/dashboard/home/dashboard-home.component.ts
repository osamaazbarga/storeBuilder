import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription, takeUntil, Subject } from 'rxjs';
import { LanguageService } from 'src/app/services/language.service';
import { SidebarDashboardComponent } from '../../sidebar-dashboard/sidebar-dashboard.component';
import { StoreService } from 'src/app/services/store.service';
import { UsersService } from 'src/app/services/users.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss'],
  standalone: false
})
export class DashboardHomeComponent implements OnInit, OnDestroy {
  @ViewChild('sidebar') sidebar!: SidebarDashboardComponent;

  // Language and RTL support
  currentLang: string = 'ar';
  isRTL: boolean = true;

  // User stores
  userStores: any[] = [];
  loading = true;
  platformDomain = environment.platformDomain;

  private destroy$ = new Subject<void>();

  constructor(
    public languageService: LanguageService,
    private storeService: StoreService,
    private usersService: UsersService
  ) {}

  ngOnInit() {
    // Subscribe to language changes
    this.languageService.lang$.pipe(takeUntil(this.destroy$)).subscribe(lang => {
      this.currentLang = lang;
      this.isRTL = lang === 'ar' || lang === 'he';
    });

    // Load user stores
    this.loadUserStores();
  }

  loadUserStores(): void {
    this.storeService.getMyStores().subscribe({
      next: (stores: any) => {
        this.userStores = Array.isArray(stores) ? stores : [];
        this.loading = false;
        console.log('📦 User stores loaded:', this.userStores);
      },
      error: (err) => {
        console.error('❌ Error loading stores:', err);
        this.userStores = [];
        this.loading = false;
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Sidebar toggle handler
  onSidebarToggle() {
    if (this.sidebar) {
      this.sidebar.toggleMobileSidebar();
    }
  }
}
