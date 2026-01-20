// ========================================
// Custom Domains Service - Angular
// Path: src/app/services/custom-domains.service.ts
// ========================================

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface CustomDomain {
  id: string;  // UUID
  domain: string;
  storeId: number;
  type: 'custom' | 'subdomain';
  isPrimary: boolean;
  status: 'pending' | 'active' | 'failed' | 'deleted';
  sslStatus: 'pending' | 'active' | 'failed';
  verificationToken?: string | null;
  verificationMethod?: string | null;
  verifiedAt?: string | null;
  dnsConfigured: boolean;
  dnsCheckedAt?: string | null;
  sslIssuedAt?: string | null;
  lastError?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  store?: {
    id: number;
    name: string;
    subdomain: string;
  };
}

export interface AddDomainResponse {
  success: boolean;
  domain: CustomDomain;
  instructions: {
    message: string;
    record: {
      type: string;
      name: string;
      value: string;
      ttl: string;
    };
    steps: string[];
    notes: string[];
  };
}

export interface VerifyDomainResponse {
  success: boolean;
  domain: CustomDomain;
  isActive: boolean;
  message: string;
  details: {
    sslStatus: string;
    verificationStatus: string;
    sslActive: boolean;
    dnsVerified: boolean;
  };
}

@Injectable({
  providedIn: 'root',
})
export class CustomDomainsService {
  private apiUrl = environment.apiUrl;
  private domainsSubject = new BehaviorSubject<CustomDomain[]>([]);
  
  public domains$ = this.domainsSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * جلب جميع دومينات المتجر
   */
  getStoreDomains(storeId: number): Observable<CustomDomain[]> {
    return this.http
      .get<CustomDomain[]>(`${this.apiUrl}/custom-domains/store/${storeId}`)
      .pipe(
        tap((domains) => {
          this.domainsSubject.next(domains);
        })
      );
  }

  /**
   * إضافة دومين جديد
   */
  addDomain(storeId: number, domain: string): Observable<AddDomainResponse> {

    return this.http.post<AddDomainResponse>(`${this.apiUrl}/custom-domains`, {
      storeId,
      domain,
    });
  }

  /**
   * حذف دومين
   */
  removeDomain(domainId: string, storeId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/custom-domains/${domainId}`, {
      body: { storeId },
    });
  }

  /**
   * التحقق من حالة الدومين
   */
  verifyDomain(domainId: string, storeId: number): Observable<VerifyDomainResponse> {
    return this.http.post<VerifyDomainResponse>(
      `${this.apiUrl}/custom-domains/${domainId}/verify`,
      { storeId }
    );
  }

  /**
   * البحث عن متجر بالدومين (للـ Public View)
   */
  lookupStoreByDomain(domain: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/custom-domains/lookup/${domain}`);
  }

  /**
   * تحديث قائمة الدومينات المحلية
   */
  private updateLocalDomains(domains: CustomDomain[]) {
    this.domainsSubject.next(domains);
  }

  /**
   * الحصول على حالة الدومين (نصياً)
   */
  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'active': '✅ مفعّل',
      'pending': '⏳ قيد التفعيل',
      'pending_validation': '⏳ في انتظار التحقق',
      'pending_deployment': '⏳ في انتظار النشر',
      'failed': '❌ فشل',
      'error': '❌ خطأ',
      'initializing': '🔄 جاري التجهيز',
    };

    return statusMap[status] || `⚪ ${status}`;
  }

  /**
   * الحصول على لون حالة الدومين (للـ CSS class)
   */
  getStatusClass(status: string): string {
    const classMap: { [key: string]: string } = {
      'active': 'status-active',
      'pending': 'status-pending',
      'pending_validation': 'status-pending',
      'pending_deployment': 'status-pending',
      'failed': 'status-error',
      'error': 'status-error',
      'initializing': 'status-pending',
    };

    return classMap[status] || 'status-unknown';
  }

  /**
   * التحقق من صحة الدومين
   */
  isValidDomain(domain: string): boolean {
    const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    return domainRegex.test(domain);
  }

  /**
   * تنسيق الدومين (إزالة المسافات والأحرف غير المسموحة)
   */
  normalizeDomain(domain: string): string {
    return domain.toLowerCase().trim();
  }
}
