import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

export interface DomainInfo {
  isMainPlatform: boolean;
  isSubdomain: boolean;
  isCustomDomain: boolean;
  storeIdentifier: string | null;
  fullDomain: string;
}

@Injectable({
  providedIn: 'root'
})
export class DomainService {
  private platformDomain = environment.platformDomain;

  constructor() {}

  /**
   * Analyzes current domain and returns detailed information
   * يحلل النطاق الحالي ويرجع معلومات مفصلة
   */
  getDomainInfo(): DomainInfo {
    const hostname = window.location.hostname.toLowerCase();
    const parts = hostname.split('.');

    console.log('🌐 Domain Analysis:', {
      hostname,
      parts,
      platformDomain: this.platformDomain
    });

    // Case 1: Main platform (e.g., dokn.net)
    if (hostname === this.platformDomain || hostname === `www.${this.platformDomain}`) {
      return {
        isMainPlatform: true,
        isSubdomain: false,
        isCustomDomain: false,
        storeIdentifier: null,
        fullDomain: hostname
      };
    }

    // Case 2: Subdomain of platform (e.g., store1.dokn.net)
    if (hostname.endsWith(`.${this.platformDomain}`) && parts.length > this.getPlatformPartsCount()) {
      const storeIdentifier = parts[0];
      return {
        isMainPlatform: false,
        isSubdomain: true,
        isCustomDomain: false,
        storeIdentifier,
        fullDomain: hostname
      };
    }

    // Case 3: Custom domain (e.g., mystore.com, shop.example.com)
    // Any domain that doesn't match above cases is treated as custom domain
    if (!hostname.includes(this.platformDomain)) {
      return {
        isMainPlatform: false,
        isSubdomain: false,
        isCustomDomain: true,
        storeIdentifier: hostname, // Use full domain as identifier
        fullDomain: hostname
      };
    }

    // Default: treat as main platform
    return {
      isMainPlatform: true,
      isSubdomain: false,
      isCustomDomain: false,
      storeIdentifier: null,
      fullDomain: hostname
    };
  }

  /**
   * Gets the number of parts in platform domain
   * يحصل على عدد الأجزاء في نطاق المنصة
   */
  private getPlatformPartsCount(): number {
    return this.platformDomain.split('.').length;
  }

  /**
   * Extracts subdomain from hostname
   * استخراج الـ subdomain من الـ hostname
   */
  getSubdomain(): string | null {
    const domainInfo = this.getDomainInfo();
    return domainInfo.storeIdentifier;
  }

  /**
   * Check if current domain is a store (subdomain or custom domain)
   * التحقق من أن النطاق الحالي هو متجر
   */
  isStoreView(): boolean {
    const domainInfo = this.getDomainInfo();
    return domainInfo.isSubdomain || domainInfo.isCustomDomain;
  }

  /**
   * Get store identifier for API calls
   * الحصول على معرف المتجر لاستدعاءات API
   */
  getStoreIdentifier(): string | null {
    const domainInfo = this.getDomainInfo();
    return domainInfo.storeIdentifier;
  }

  /**
   * Build subdomain URL for a store
   * بناء رابط subdomain للمتجر
   */
  buildStoreUrl(storeSlug: string): string {
    if (environment.production) {
      return `https://${storeSlug}.${this.platformDomain}`;
    } else {
      // For local development
      return `http://${storeSlug}.${this.platformDomain}:4200`;
    }
  }

  /**
   * Navigate to main platform
   * الانتقال إلى المنصة الرئيسية
   */
  navigateToMainPlatform(): void {
    const url = environment.production
      ? `https://${this.platformDomain}`
      : `http://${this.platformDomain}:4200`;
    window.location.href = url;
  }
}
