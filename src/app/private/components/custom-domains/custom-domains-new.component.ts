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

  // State
  domains: CustomDomain[] = [];
  userStores: any[] = []; // قائمة متاجر المستخدم
  selectedStoreId: number | null = null; // المتجر المختار
  newDomain = '';
  currentStoreId: number | null = null;
  loading = false;
  loadingStores = false;
  verifying: string | null = null; // Domain ID (UUID)
  error = '';

  // Instructions Modal
  showInstructions = false;
  instructions: AddDomainResponse['instructions'] | null = null;
  currentDomain: CustomDomain | null = null;

  constructor(
    private customDomainsService: CustomDomainsService,
    private storeService: StoreService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    // جلب قائمة متاجر المستخدم
    this.loadUserStores();
    
    // جلب Store ID من الـ StoreService
    this.storeService.storeData$
      .pipe(takeUntil(this.destroy$))
      .subscribe((store) => {
        if (store?.id) {
          this.currentStoreId = store.id;
          // إذا لم يتم تحديد متجر، استخدم المتجر الحالي
          if (!this.selectedStoreId) {
            this.selectedStoreId = store.id;
            this.loadDomains();
          }
        }
      });

    // الاستماع للـ domains$ stream
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

  /**
   * جلب قائمة متاجر المستخدم
   */
  loadUserStores(): void {
    this.loadingStores = true;
    this.storeService.getMyStores()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stores) => {
          this.userStores = stores  as any[];
          this.loadingStores = false;
          console.log('📦 User stores loaded:', stores);
        },
        error: (err) => {
          console.error('Failed to load user stores:', err);
          this.loadingStores = false;
        },
      });
  }

  /**
   * تغيير المتجر المحدد
   */
  onStoreChange(storeId: number): void {
    this.selectedStoreId = storeId;
    this.loadDomains();
  }

  /**
   * جلب جميع الدومينات
   */
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

  /**
   * إضافة دومين جديد
   */
  addDomain(): void {
    const storeId = this.selectedStoreId || this.currentStoreId;
    if (!this.newDomain.trim() || !storeId) return;

    // التحقق من صحة الدومين
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
          // إضافة الدومين للقائمة
          this.domains.unshift(response.domain);
          
          // عرض التعليمات
          this.instructions = response.instructions;
          this.currentDomain = response.domain;
          this.showInstructions = true;
          
          // إفراغ الـ input
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

  /**
   * التحقق من حالة الدومين
   */
  verifyDomain(domain: CustomDomain): void {
    const storeId = this.selectedStoreId || this.currentStoreId;
    if (!storeId) return;

    this.verifying = domain.id;

    this.customDomainsService
      .verifyDomain(domain.id, storeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          // تحديث الدومين في القائمة
          const index = this.domains.findIndex((d) => d.id === domain.id);
          if (index !== -1) {
            this.domains[index] = response.domain;
          }

          // عرض رسالة
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

  /**
   * حذف دومين
   */
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
          // إزالة من القائمة
          this.domains = this.domains.filter((d) => d.id !== domain.id);
          this.sharedService.showNotification(true, 'نجح', 'تم حذف الدومين بنجاح');
        },
        error: (err) => {
          const errorMessage = err.error?.message || 'فشل في حذف الدومين';
          this.sharedService.showNotification(false, 'خطأ', errorMessage);
        },
      });
  }

  /**
   * نسخ نص إلى Clipboard
   */
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

  /**
   * إغلاق نافذة التعليمات
   */
  closeInstructions(): void {
    this.showInstructions = false;
    this.instructions = null;
    this.currentDomain = null;
  }

  /**
   * فتح نافذة التعليمات لدومين موجود
   */
  showDomainInstructions(domain: CustomDomain): void {
    this.currentDomain = domain;
    this.showInstructions = true;
    
    // إنشاء تعليمات مبسطة
    this.instructions = {
      message: 'أضف السجل التالي في إعدادات DNS الخاصة بدومينك',
      record: {
        type: 'CNAME',
        name: domain.domain.startsWith('www.') ? 'www' : '@',
        value: 'dokn.net',
        ttl: 'Auto',
      },
      steps: [
        '1️⃣ سجّل الدخول لموقع مزود الدومين',
        '2️⃣ اذهب إلى إعدادات DNS',
        '3️⃣ أضف سجل CNAME بالقيم المعروضة',
        '4️⃣ احفظ التغييرات',
        '5️⃣ انتظر 5-10 دقائق',
        '6️⃣ اضغط "تحقق"',
      ],
      notes: [],
    };
  }

  /**
   * الحصول على نص حالة الدومين
   */
  getStatusText(status: string): string {
    return this.customDomainsService.getStatusText(status);
  }

  /**
   * الحصول على CSS class لحالة الدومين
   */
  getStatusClass(status: string): string {
    return this.customDomainsService.getStatusClass(status);
  }

  /**
   * هل الدومين مفعّل بالكامل؟
   */
  isFullyActive(domain: CustomDomain): boolean {
    return (
      domain.status === 'active' &&
      domain.sslStatus === 'active'
    );
  }

  /**
   * زيارة الدومين
   */
  visitDomain(domain: CustomDomain): void {
    const url = `https://${domain.domain}`;
    window.open(url, '_blank');
  }
}
