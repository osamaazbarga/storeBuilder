// ========================================
// Custom Domains Component - Angular
// Path: src/app/private/components/custom-domains/custom-domains-new.component.ts
// ========================================

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CustomDomainsService, CustomDomain, AddDomainResponse } from '../../../services/custom-domains.service';
import { DomainPurchaseService, DomainAvailability } from '../../../services/domain-purchase.service';
import { StoreService } from '../../../services/store.service';
import { SharedService } from '../../../shared/shared.service';

@Component({
  selector: 'app-custom-domains',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './custom-domains-new.component.html',
  styleUrls: ['./custom-domains-new.component.scss'],
})
export class CustomDomainsNewComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Tab State
  activeTab: 'link' | 'buy' = 'link';

  // State
  domains: CustomDomain[] = [];
  userStores: any[] = [];
  selectedStoreId: number | null = null;
  newDomain = '';
  currentStoreId: number | null = null;
  loading = false;
  loadingStores = false;
  verifying: string | null = null;
  creatingSSL: string | null = null;
  error = '';

  // Instructions Modal
  showInstructions = false;
  instructions: AddDomainResponse['instructions'] | null = null;
  currentDomain: CustomDomain | null = null;

  // ═══════════════════════════════════════════════════════════
  // Domain Purchase State
  // ═══════════════════════════════════════════════════════════
  searchQuery = '';
  isSearching = false;
  availableDomains: DomainAvailability[] = [];
  domainPrices: Record<string, number> = {};
  purchaseServiceAvailable = true; // Set to true to always show the tab

  // Purchase Modal
  showPurchaseModal = false;
  selectedDomainToBuy: DomainAvailability | null = null;
  purchaseYears = 1;
  isPurchasing = false;

  constructor(
    private customDomainsService: CustomDomainsService,
    private domainPurchaseService: DomainPurchaseService,
    private storeService: StoreService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.loadUserStores();
    this.loadDomainPrices();
    this.checkPurchaseService();
    
    this.storeService.storeData$
      .pipe(takeUntil(this.destroy$))
      .subscribe((store) => {
        if (store?.id) {
          this.currentStoreId = store.id;
          if (!this.selectedStoreId) {
            this.selectedStoreId = store.id;
            this.loadDomains();
          }
        }
      });

    this.customDomainsService.domains$
      .pipe(takeUntil(this.destroy$))
      .subscribe((domains) => {
        this.domains = domains;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ═══════════════════════════════════════════════════════════
  // Tab Switch
  // ═══════════════════════════════════════════════════════════
  switchTab(tab: 'link' | 'buy'): void {
    console.log('Switching to tab:', tab);
    this.activeTab = tab;
    this.error = '';
  }

  // ═══════════════════════════════════════════════════════════
  // Domain Purchase Methods
  // ═══════════════════════════════════════════════════════════
  
  checkPurchaseService(): void {
    // Always show the purchase tab - remove API check for now
    this.purchaseServiceAvailable = true;
    
    // Uncomment below when the API is ready:
    // this.domainPurchaseService.getServiceStatus()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe({
    //     next: (status) => {
    //       this.purchaseServiceAvailable = status.available;
    //     },
    //     error: () => {
    //       this.purchaseServiceAvailable = true; // Show tab even on error
    //     }
    //   });
  }

  loadDomainPrices(): void {
    this.domainPurchaseService.getDomainPrices()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.domainPrices = response.prices;
        },
        error: (err) => {
          console.error('Failed to load domain prices:', err);
        }
      });
  }

  searchDomain(): void {
    if (!this.searchQuery.trim()) return;

    this.isSearching = true;
    this.availableDomains = [];
    this.error = '';

    this.domainPurchaseService.checkAvailability(this.searchQuery.trim())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (results) => {
          this.availableDomains = results;
          this.isSearching = false;
        },
        error: (err) => {
          this.error = err.error?.message || 'فشل في البحث عن الدومين';
          this.isSearching = false;
        }
      });
  }

  openPurchaseModal(domain: DomainAvailability): void {
    if (!domain.available) return;
    
    this.selectedDomainToBuy = domain;
    this.purchaseYears = 1;
    this.showPurchaseModal = true;
  }

  closePurchaseModal(): void {
    this.showPurchaseModal = false;
    this.selectedDomainToBuy = null;
    this.purchaseYears = 1;
  }

  getTotalPrice(): number {
    if (!this.selectedDomainToBuy) return 0;
    return this.selectedDomainToBuy.price * this.purchaseYears;
  }

  purchaseDomain(): void {
    const storeId = this.selectedStoreId || this.currentStoreId;
    if (!this.selectedDomainToBuy || !storeId) return;

    this.isPurchasing = true;

    this.domainPurchaseService.purchaseDomain(
      this.selectedDomainToBuy.domain,
      storeId,
      this.purchaseYears
    )
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        this.sharedService.showNotification(true, 'نجح', response.message);
        this.closePurchaseModal();
        this.loadDomains();
        this.availableDomains = [];
        this.searchQuery = '';
        this.isPurchasing = false;
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'فشل في شراء الدومين';
        this.sharedService.showNotification(false, 'خطأ', errorMessage);
        this.isPurchasing = false;
      }
    });
  }

  // ═══════════════════════════════════════════════════════════
  // Existing Methods (Link Domain)
  // ═══════════════════════════════════════════════════════════

  loadUserStores(): void {
    this.loadingStores = true;
    this.storeService.getMyStores()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stores) => {
          this.userStores = stores as any[];
          this.loadingStores = false;
        },
        error: (err) => {
          console.error('Failed to load user stores:', err);
          this.loadingStores = false;
        },
      });
  }

  onStoreChange(storeId: number): void {
    this.selectedStoreId = storeId;
    this.loadDomains();
  }

  loadDomains(): void {
    const storeId = this.selectedStoreId || this.currentStoreId;
    if (!storeId) return;

    this.customDomainsService
      .getStoreDomains(storeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (domains) => {
          this.domains = domains;
        },
        error: (err) => {
          console.error('Failed to load domains:', err);
          this.sharedService.showNotification(false, 'خطأ', 'فشل في جلب الدومينات');
        },
      });
  }

  addDomain(): void {
    const storeId = this.selectedStoreId || this.currentStoreId;
    if (!this.newDomain.trim() || !storeId) return;

    const normalizedDomain = this.customDomainsService.normalizeDomain(this.newDomain);
    
    if (!this.customDomainsService.isValidDomain(normalizedDomain)) {
      this.error = 'الدومين غير صحيح. يرجى إدخال دومين صالح (مثال: www.mystore.com)';
      return;
    }

    this.loading = true;
    this.error = '';
    this.instructions = null;

    this.customDomainsService
      .addDomain(storeId, normalizedDomain)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.domains.unshift(response.domain);
          this.instructions = response.instructions;
          this.currentDomain = response.domain;
          this.showInstructions = true;
          this.newDomain = '';
          this.loading = false;
          this.sharedService.showNotification(true, 'نجح', 'تم إضافة الدومين بنجاح!');
        },
        error: (err) => {
          this.error = err.error?.message || 'فشل في إضافة الدومين. حاول مرة أخرى.';
          this.loading = false;
          this.sharedService.showNotification(false, 'خطأ', this.error);
        },
      });
  }

  verifyDomain(domain: CustomDomain): void {
    const storeId = this.selectedStoreId || this.currentStoreId;
    if (!storeId) return;

    this.verifying = domain.id;

    this.customDomainsService
      .verifyDomain(domain.id, storeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          const index = this.domains.findIndex((d) => d.id === domain.id);
          if (index !== -1) {
            this.domains[index] = response.domain;
          }

          const isSuccess = response.isActive;
          const title = response.isActive ? 'نجح' : 'معلومة';
          this.sharedService.showNotification(isSuccess, title, response.message);

          this.verifying = null;
        },
        error: (err) => {
          const errorMessage = err.error?.message || 'فشل في التحقق من الدومين';
          this.sharedService.showNotification(false, 'خطأ', errorMessage);
          this.verifying = null;
        },
      });
  }

  removeDomain(domain: CustomDomain): void {
    const storeId = this.selectedStoreId || this.currentStoreId;
    if (!storeId) return;

    const confirmed = confirm(`هل أنت متأكد من حذف الدومين: ${domain.domain}؟`);
    if (!confirmed) return;

    this.customDomainsService
      .removeDomain(domain.id, storeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.domains = this.domains.filter((d) => d.id !== domain.id);
          this.sharedService.showNotification(true, 'نجح', 'تم حذف الدومين بنجاح');
        },
        error: (err) => {
          const errorMessage = err.error?.message || 'فشل في حذف الدومين';
          this.sharedService.showNotification(false, 'خطأ', errorMessage);
        },
      });
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(
      () => {
        this.sharedService.showNotification(true, 'نجح', 'تم النسخ!');
      },
      (err) => {
        console.error('Failed to copy:', err);
        this.sharedService.showNotification(false, 'خطأ', 'فشل في النسخ');
      }
    );
  }

  closeInstructions(): void {
    this.showInstructions = false;
    this.instructions = null;
    this.currentDomain = null;
  }

  showDomainInstructions(domain: CustomDomain): void {
    this.currentDomain = domain;
    this.showInstructions = true;
    
    this.instructions = {
      message: 'أضف السجل التالي في إعدادات DNS الخاصة بدومينك',
      record: {
        type: 'CNAME',
        name: domain.domain.startsWith('www.') ? 'www' : '@',
        value: 'dokn.net',
        ttl: 'Auto',
      },
      steps: [
        '1. سجّل الدخول لموقع مزود الدومين',
        '2. اذهب إلى إعدادات DNS',
        '3. أضف سجل CNAME بالقيم المعروضة',
        '4. احفظ التغييرات',
        '5. انتظر 5-10 دقائق',
        '6. اضغط "تحقق"',
      ],
      notes: [],
    };
  }

  getStatusText(status: string): string {
    return this.customDomainsService.getStatusText(status);
  }

  getStatusClass(status: string): string {
    return this.customDomainsService.getStatusClass(status);
  }

  isFullyActive(domain: CustomDomain): boolean {
    return domain.status === 'active' && domain.sslStatus === 'active';
  }

  visitDomain(domain: CustomDomain): void {
    const url = `https://${domain.domain}`;
    window.open(url, '_blank');
  }

  createSSL(domain: CustomDomain): void {
    const storeId = this.selectedStoreId || this.currentStoreId;
    if (!storeId) return;

    if (domain.status !== 'active') {
      this.sharedService.showNotification(false, 'تنبيه', 'يجب أن يكون الدومين مفعل أولاً');
      return;
    }

    const confirmed = confirm(`هل تريد إنشاء شهادة SSL لـ: ${domain.domain}?`);
    if (!confirmed) return;

    this.creatingSSL = domain.id;

    this.storeService
      .createSSLForDomain(storeId, domain.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          const index = this.domains.findIndex((d) => d.id === domain.id);
          if (index !== -1) {
            this.domains[index] = { ...this.domains[index], sslStatus: response.status || 'pending' };
          }

          this.sharedService.showNotification(response.success, response.success ? 'نجح' : 'معلومة', response.message);
          this.creatingSSL = null;

          setTimeout(() => this.loadDomains(), 2000);
        },
        error: (err) => {
          this.sharedService.showNotification(false, 'خطأ', err.error?.message || 'فشل في إنشاء شهادة SSL');
          this.creatingSSL = null;
        },
      });
  }

  canCreateSSL(domain: CustomDomain): boolean {
    return domain.status === 'active' && (domain.sslStatus === 'pending' || domain.sslStatus === 'failed');
  }

  getDomainTypeText(type: string): string {
    switch (type) {
      case 'purchased': return 'مشترى';
      case 'custom': return 'خارجي';
      case 'subdomain': return 'فرعي';
      default: return type;
    }
  }
}
