import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

/**
 * Domain Service - خدمة إدارة النطاقات
 */
@Injectable({
  providedIn: 'root'
})
export class DomainService {

  constructor(private http: HttpClient) { }

  /**
   * Get all domains for a store
   * الحصول على جميع نطاقات المتجر
   */
  getStoreDomains(storeId: number): Observable<any[]> {
    return this.http.get<any[]>(`${environment.appUrl}/stores/${storeId}/domains`);
  }

  /**
   * Add a custom domain
   * إضافة نطاق مخصص
   */
  addCustomDomain(storeId: number, domain: string, type: 'subdomain' | 'custom'): Observable<any> {
    return this.http.post<any>(`${environment.appUrl}/stores/${storeId}/domains`, {
      domain,
      type
    });
  }

  /**
   * Verify a domain
   * التحقق من نطاق
   */
  verifyDomain(domainId: string, method: 'txt' | 'cname'): Observable<{
    verified: boolean;
    message: string;
    expected?: string;
    found?: string;
  }> {
    return this.http.post<any>(`${environment.appUrl}/stores/0/domains/${domainId}/verify`, {
      method
    });
  }

  /**
   * Set primary domain
   * تعيين النطاق الأساسي
   */
  setPrimaryDomain(storeId: number, domainId: string): Observable<any> {
    return this.http.patch<any>(`${environment.appUrl}/stores/${storeId}/domains/${domainId}/set-primary`, {});
  }

  /**
   * Remove a domain
   * حذف نطاق
   */
  removeDomain(storeId: number, domainId: string): Observable<any> {
    return this.http.delete<any>(`${environment.appUrl}/stores/${storeId}/domains/${domainId}`);
  }

  /**
   * Get verification instructions
   * الحصول على تعليمات التحقق
   */
  getVerificationInstructions(domainId: string): Observable<{
    domain: string;
    status: string;
    txtRecord: any;
    cnameRecord: any;
    aRecord: any;
  }> {
    return this.http.get<any>(`${environment.appUrl}/stores/0/domains/${domainId}/verification-instructions`);
  }
}
