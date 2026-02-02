// ========================================
// Domain Purchase Service - Angular
// Path: src/app/services/domain-purchase.service.ts
// ========================================

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DomainAvailability {
  domain: string;
  available: boolean;
  premium: boolean;
  price: number;
  extension: string;
}

export interface DomainPrices {
  prices: Record<string, number>;
}

export interface PurchasedDomain {
  id: string;
  domain: string;
  type: string;
  status: string;
  sslStatus: string;
  isPrimary: boolean;
  expiresAt?: string;
  purchasedAt?: string;
  autoRenew: boolean;
  store?: {
    id: number;
    name: string;
    subdomain: string;
  };
}

export interface PurchaseResponse {
  success: boolean;
  message: string;
  domain?: PurchasedDomain;
  orderId?: string;
  instructions?: {
    message: string;
    notes: string[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class DomainPurchaseService {
  private apiUrl = `${environment.apiUrl}/domain-purchase`;

  constructor(private http: HttpClient) {}

  /**
   * Check domain availability
   */
  checkAvailability(domain: string): Observable<DomainAvailability[]> {
    return this.http.get<DomainAvailability[]>(`${this.apiUrl}/check`, {
      params: { domain }
    });
  }

  /**
   * Get domain prices
   */
  getDomainPrices(): Observable<DomainPrices> {
    return this.http.get<DomainPrices>(`${this.apiUrl}/prices`);
  }

  /**
   * Check service status
   */
  getServiceStatus(): Observable<{ available: boolean; message: string }> {
    return this.http.get<{ available: boolean; message: string }>(`${this.apiUrl}/status`);
  }

  /**
   * Purchase a domain
   */
  purchaseDomain(domain: string, storeId: number, years: number = 1): Observable<PurchaseResponse> {
    return this.http.post<PurchaseResponse>(`${this.apiUrl}/purchase`, {
      domain,
      storeId,
      years
    });
  }

  /**
   * Get user's purchased domains
   */
  getMyPurchasedDomains(): Observable<PurchasedDomain[]> {
    return this.http.get<PurchasedDomain[]>(`${this.apiUrl}/my-domains`);
  }

  /**
   * Get all user's domains
   */
  getAllMyDomains(): Observable<PurchasedDomain[]> {
    return this.http.get<PurchasedDomain[]>(`${this.apiUrl}/all-domains`);
  }

  /**
   * Get store domains
   */
  getStoreDomains(storeId: number): Observable<PurchasedDomain[]> {
    return this.http.get<PurchasedDomain[]>(`${this.apiUrl}/store/${storeId}`);
  }

  /**
   * Update auto-renew setting
   */
  updateAutoRenew(domainId: string, autoRenew: boolean): Observable<any> {
    return this.http.patch(`${this.apiUrl}/domain/${domainId}/auto-renew`, { autoRenew });
  }
}
