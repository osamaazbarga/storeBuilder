import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { 
  CustomDomainsService, 
  CustomDomain, 
  AddDomainResponse 
} from '../../../services/custom-domains.service';
import { StoreService } from '../../../services/store.service';

/**
 * Custom Domains Component
 * صفحة إدارة الدومينات المخصصة
 */
@Component({
  selector: 'app-custom-domains',
  templateUrl: './custom-domains.component.html',
  styleUrls: ['./custom-domains.component.scss'],
  standalone: false
})
export class CustomDomainsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // البيانات
  domains: CustomDomain[] = [];
  currentStoreId: number | null = null;
  
  // حالات التحميل
  isLoading = false;
  isAdding = false;
  verifyingDomainId: string | null = null;
  
  // النموذج
  newDomain = '';
  
  // الرسائل
  errorMessage = '';
  successMessage = '';
  
  // التعليمات
  showInstructions = false;
  instructions: AddDomainResponse['instructions'] | null = null;

  constructor(
    private customDomainsService: CustomDomainsService,
    private storeService: StoreService
  ) {}

  ngOnInit(): void {
    this.loadCurrentStore();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * تحميل المتجر الحالي
   */
  private loadCurrentStore(): void {
    this.storeService.getMyStore()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (store: any) => {
          if (store?.id) {
            this.currentStoreId = store.id;
            this.loadDomains();
          }
        },
        error: (error) => {
          this.showError('فشل في تحميل بيانات المتجر');
        }
      });
  }

  /**
   * تحميل الدومينات
   */
  loadDomains(): void {
    if (!this.currentStoreId) return;

    this.isLoading = true;
    this.customDomainsService.getStoreDomains(this.currentStoreId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (domains) => {
          this.domains = domains;
          this.isLoading = false;
        },
        error: (error) => {
          this.showError('فشل في تحميل الدومينات');
          this.isLoading = false;
        }
      });
  }

  /**
   * إضافة دومين جديد
   */
  addDomain(): void {
    if (!this.currentStoreId) {
      this.showError('لم يتم العثور على المتجر');
      return;
    }

    if (!this.newDomain.trim()) {
      this.showError('الرجاء إدخال اسم الدومين');
      return;
    }

    // تنظيف الدومين
    const cleanedDomain = this.customDomainsService.cleanDomainName(this.newDomain);

    // التحقق من الصيغة
    if (!this.customDomainsService.isValidDomain(cleanedDomain)) {
      this.showError('صيغة الدومين غير صحيحة');
      return;
    }

    this.isAdding = true;
    this.clearMessages();

    this.customDomainsService.addCustomDomain(this.currentStoreId, cleanedDomain)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.showSuccess('تم إضافة الدومين بنجاح! اتبع التعليمات أدناه');
          this.instructions = response.instructions;
          this.showInstructions = true;
          this.newDomain = '';
          this.loadDomains();
          this.isAdding = false;
        },
        error: (error) => {
          const message = error.error?.message || 'فشل في إضافة الدومين';
          this.showError(message);
          this.isAdding = false;
        }
      });
  }

  /**
   * التحقق من دومين
   */
  verifyDomain(domain: CustomDomain): void {
    if (!this.currentStoreId) return;

    this.verifyingDomainId = domain.id;
    this.clearMessages();

    this.customDomainsService.verifyDomain(this.currentStoreId, domain.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.showSuccess(response.message);
            this.loadDomains();
          } else {
            this.showError(response.message);
          }
          this.verifyingDomainId = null;
        },
        error: (error) => {
          const message = error.error?.message || 'فشل في التحقق من الدومين';
          this.showError(message);
          this.verifyingDomainId = null;
        }
      });
  }

  /**
   * تعيين دومين كـ Primary
   */
  setPrimaryDomain(domain: CustomDomain): void {
    if (!this.currentStoreId) return;
    
    if (!domain.dnsConfigured) {
      this.showError('يجب التحقق من الدومين أولاً');
      return;
    }

    this.customDomainsService.setPrimaryDomain(this.currentStoreId, domain.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.showSuccess(`تم تعيين ${domain.domain} كدومين رئيسي`);
          this.loadDomains();
        },
        error: (error) => {
          this.showError('فشل في تعيين الدومين الرئيسي');
        }
      });
  }

  /**
   * حذف دومين
   */
  removeDomain(domain: CustomDomain): void {
    if (!this.currentStoreId) return;

    const confirmMessage = `هل أنت متأكد من حذف ${domain.domain}؟`;
    if (!confirm(confirmMessage)) {
      return;
    }

    this.customDomainsService.removeDomain(this.currentStoreId, domain.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.showSuccess(response.message || 'تم حذف الدومين');
          this.loadDomains();
        },
        error: (error) => {
          this.showError('فشل في حذف الدومين');
        }
      });
  }

  /**
   * الحصول على حالة الدومين
   */
  getStatusLabel(status: string) {
    return this.customDomainsService.getStatusLabel(status);
  }

  /**
   * الحصول على حالة SSL
   */
  getSslStatusLabel(sslStatus: string) {
    return this.customDomainsService.getSslStatusLabel(sslStatus);
  }

  /**
   * هل الدومين قيد التحقق؟
   */
  isVerifying(domainId: string): boolean {
    return this.verifyingDomainId === domainId;
  }

  /**
   * إغلاق التعليمات
   */
  closeInstructions(): void {
    this.showInstructions = false;
    this.instructions = null;
  }

  /**
   * نسخ النص
   */
  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      this.showSuccess('تم النسخ!');
    });
  }

  /**
   * عرض رسالة خطأ
   */
  private showError(message: string): void {
    this.errorMessage = message;
    this.successMessage = '';
    setTimeout(() => this.errorMessage = '', 5000);
  }

  /**
   * عرض رسالة نجاح
   */
  private showSuccess(message: string): void {
    this.successMessage = message;
    this.errorMessage = '';
    setTimeout(() => this.successMessage = '', 5000);
  }

  /**
   * مسح الرسائل
   */
  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }
}
