import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

/**
 * Custom Domain Interface
 * واجهة الدومين المخصص
 */
export interface CustomDomain {
  id: string;
  domain: string;
  type: 'subdomain' | 'custom';
  isPrimary: boolean;
  status: 'pending' | 'verifying' | 'active' | 'failed';
  sslStatus: 'pending' | 'active' | 'failed';
  dnsConfigured: boolean;
  verificationToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Add Domain Response
 */
export interface AddDomainResponse {
  domain: CustomDomain;
  instructions: {
    message: string;
    records: Array<{
      type: string;
      name: string;
      value: string;
      ttl: string;
    }>;
    verificationToken: string;
    nextStep: string;
  };
}

/**
 * Verify Domain Response
 */
export interface VerifyDomainResponse {
  success: boolean;
  message: string;
  domain?: CustomDomain;
  dnsCheck?: {
    configured: boolean;
    records: any[];
  };
}

/**
 * Custom Domains Service
 * خدمة إدارة الدومينات المخصصة
 */
@Injectable({
  providedIn: 'root'
})
export class CustomDomainsService {
  private readonly apiUrl = `${environment.apiUrl}/stores`;
  
  // Observable للدومينات
  private domainsSubject = new BehaviorSubject<CustomDomain[]>([]);
  public domains$ = this.domainsSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * جلب دومينات المتجر
   * Get store domains
   */
  getStoreDomains(storeId: number): Observable<CustomDomain[]> {
    return this.http.get<CustomDomain[]>(`${this.apiUrl}/${storeId}/domains`).pipe(
      tap(domains => this.domainsSubject.next(domains))
    );
  }

  /**
   * إضافة دومين مخصص
   * Add custom domain
   */
  addCustomDomain(storeId: number, domain: string): Observable<AddDomainResponse> {
    return this.http.post<AddDomainResponse>(
      `${this.apiUrl}/${storeId}/domains`,
      { domain }
    );
  }

  /**
   * التحقق من دومين
   * Verify domain
   */
  verifyDomain(storeId: number, domainId: string): Observable<VerifyDomainResponse> {
    return this.http.post<VerifyDomainResponse>(
      `${this.apiUrl}/${storeId}/domains/${domainId}/verify`,
      {}
    );
  }

  /**
   * تعيين دومين كـ Primary
   * Set domain as primary
   */
  setPrimaryDomain(storeId: number, domainId: string): Observable<CustomDomain> {
    return this.http.patch<CustomDomain>(
      `${this.apiUrl}/${storeId}/domains/${domainId}/primary`,
      {}
    );
  }

  /**
   * حذف دومين
   * Remove domain
   */
  removeDomain(storeId: number, domainId: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(
      `${this.apiUrl}/${storeId}/domains/${domainId}`
    );
  }

  /**
   * تنظيف اسم الدومين
   * Clean domain name
   */
  cleanDomainName(domain: string): string {
    let cleaned = domain.trim().toLowerCase();
    
    // إزالة http:// أو https://
    cleaned = cleaned.replace(/^https?:\/\//, '');
    
    // إزالة / في النهاية
    cleaned = cleaned.replace(/\/$/, '');
    
    // إزالة www. في البداية (اختياري)
    // cleaned = cleaned.replace(/^www\./, '');
    
    return cleaned;
  }

  /**
   * التحقق من صحة الدومين
   * Validate domain format
   */
  isValidDomain(domain: string): boolean {
    const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i;
    return domainRegex.test(domain);
  }

  /**
   * الحصول على حالة الدومين
   * Get domain status label
   */
  getStatusLabel(status: string): { text: string; color: string; icon: string } {
    switch (status) {
      case 'active':
        return { text: 'مفعّل', color: '#28a745', icon: '✅' };
      case 'verifying':
        return { text: 'جاري التحقق', color: '#007bff', icon: '🔄' };
      case 'pending':
        return { text: 'في انتظار التحقق', color: '#ffc107', icon: '⏳' };
      case 'failed':
        return { text: 'فشل', color: '#dc3545', icon: '❌' };
      default:
        return { text: status, color: '#6c757d', icon: '⚪' };
    }
  }

  /**
   * الحصول على حالة SSL
   * Get SSL status label
   */
  getSslStatusLabel(sslStatus: string): { text: string; color: string } {
    switch (sslStatus) {
      case 'active':
        return { text: 'SSL مفعّل', color: '#28a745' };
      case 'pending':
        return { text: 'SSL قيد الإصدار', color: '#ffc107' };
      case 'failed':
        return { text: 'فشل SSL', color: '#dc3545' };
      default:
        return { text: sslStatus, color: '#6c757d' };
    }
  }
}
