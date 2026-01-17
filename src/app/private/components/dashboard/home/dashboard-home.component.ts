import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription, takeUntil, Subject } from 'rxjs';
import { LanguageService } from 'src/app/services/language.service';
import { SidebarDashboardComponent } from '../../sidebar-dashboard/sidebar-dashboard.component';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css'],
  standalone: false
})
export class DashboardHomeComponent implements OnInit, OnDestroy {
  @ViewChild('sidebar') sidebar!: SidebarDashboardComponent;

  // Language and RTL support
  currentLang: string = 'ar';
  isRTL: boolean = true;

  private destroy$ = new Subject<void>();

  constructor(
    public languageService: LanguageService
  ) {}

  ngOnInit() {
    // Subscribe to language changes
    this.languageService.lang$.pipe(takeUntil(this.destroy$)).subscribe(lang => {
      this.currentLang = lang;
      this.isRTL = lang === 'ar' || lang === 'he';
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
