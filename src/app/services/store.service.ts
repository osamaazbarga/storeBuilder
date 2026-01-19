import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StoreAddEdit } from '../models/store/StoreAddEdit';
import { DomainService } from './domain.service';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private domainService = inject(DomainService);

  private url="Store";
  private storeDataSubject = new BehaviorSubject<any>(null);
  storeData$ = this.storeDataSubject.asObservable();
  
  // localStorage key for store data
  private readonly STORE_DATA_KEY = 'store_data';

  constructor(private http:HttpClient) { 
    // استرجاع البيانات المحفوظة عند بدء الخدمة
    this.loadStoreDataFromStorage();
  }

  setStoreData(data: any) {
    // حفظ البيانات في localStorage
    this.saveStoreDataToStorage(data);
    // تحديث BehaviorSubject
    this.storeDataSubject.next(data);
  }

  getStoreData() {
    return this.storeDataSubject.value;
  }

  // حفظ البيانات في localStorage
  private saveStoreDataToStorage(data: any) {
    try {
      localStorage.setItem(this.STORE_DATA_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving store data to localStorage:', error);
    }
  }

  // استرجاع البيانات من localStorage
  public loadStoreDataFromStorage() {
    try {
      const storedData = localStorage.getItem(this.STORE_DATA_KEY);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        this.storeDataSubject.next(parsedData);
      }
    } catch (error) {
      console.error('Error loading store data from localStorage:', error);
    }
  }

  // مسح البيانات من localStorage
  clearStoreData() {
    try {
      localStorage.removeItem(this.STORE_DATA_KEY);
      this.storeDataSubject.next(null);
    } catch (error) {
      console.error('Error clearing store data from localStorage:', error);
    }
  }

  // التحقق من وجود بيانات محفوظة
  hasStoredStoreData(): boolean {
    try {
      return localStorage.getItem(this.STORE_DATA_KEY) !== null;
    } catch (error) {
      console.error('Error checking stored store data:', error);
      return false;
    }
  }

  // استرجاع البيانات المحفوظة مباشرة
  getStoredStoreData(): any {
    try {
      const storedData = localStorage.getItem(this.STORE_DATA_KEY);
      return storedData ? JSON.parse(storedData) : null;
    } catch (error) {
      console.error('Error getting stored store data:', error);
      return null;
    }
  }

  // تهيئة بيانات المتجر - تحميل من localStorage أو من الخادم
  initializeStoreData(): Observable<any> {
    return new Observable(observer => {
      // التحقق من وجود بيانات محفوظة
      if (this.hasStoredStoreData()) {
        const storedData = this.getStoredStoreData();
        this.storeDataSubject.next(storedData);
        observer.next(storedData);
        observer.complete();
      } else {
        // تحميل البيانات من الخادم
        this.getMyStore().subscribe({
          next: (data) => {
            if (data) {
              this.setStoreData(data);
              observer.next(data);
            } else {
              observer.next(null);
            }
            observer.complete();
          },
          error: (error) => {
            console.error('Error loading store data:', error);
            observer.error(error);
          }
        });
      }
    });
  }

  getStores(){
    this.http.get(`${environment.appUrl}/${this.url}`)
  }
  getIsAvalibleLink(link:string){
    return this.http.get(`${environment.appUrl}/${this.url}/check-available-link/${link}`)
  }

  getStoreByUserId(userId:string){
    return this.http.get(`${environment.appUrl}/${this.url}/get-store-by-user/${userId}`)
  }

  getMyStores(){
    return this.http.get(`${environment.appUrl}/${this.url}/my-stores`)
  }

  getMyStore(){
    return this.http.get(`${environment.appUrl}/${this.url}/my-store`)
  }

  createStore(subdomain: string) {
    return this.http.post<{ success: boolean; subdomain: string }>(
      `${environment.appUrl}/${this.url}/add-edit-store`,
      { subdomain }
    );
  }

  setCustomDomain(domain: string) {
    return this.http.post<{ success: boolean; status: string }>(
      `${environment.appUrl}/${this.url}/custom-domain`,
      { customDomain: domain }
    );
  }

  /**
   * Get subdomain using DomainService
   * الحصول على الـ subdomain باستخدام DomainService
   */
  getSubdomain(): string {
    return this.domainService.getSubdomain() || '';
  }

  /**
   * Check if current view is a store
   * التحقق من أن العرض الحالي هو متجر
   */
  isStoreView(): boolean {
    return this.domainService.isStoreView();
  }

  /**
   * Get domain information
   * الحصول على معلومات النطاق
   */
  getDomainInfo() {
    return this.domainService.getDomainInfo();
  }



 

  /**
   * Loads store details based on subdomain or custom domain
   */
  loadStoreBySubdomain(identifier: string): Observable<StoreAddEdit> {
    console.log('🔍 Loading store by identifier:', identifier);
    
    // تحديد ما إذا كان subdomain أم custom domain
    const platformDomain = environment.platformDomain;
    const isSubdomain = identifier.includes('.') ? identifier.endsWith(`.${platformDomain}`) : !identifier.includes('.');
    
    if (isSubdomain && identifier.includes('.')) {
      // استخراج الـ subdomain فقط (مثال: test.dokn.net -> test)
      identifier = identifier.split('.')[0];
    }
    
    console.log('📡 API Call - Identifier:', identifier, 'IsSubdomain:', isSubdomain);
    
    // استخدام الـ endpoint القديم للتوافق
    return this.http.get<StoreAddEdit>(`${environment.appUrl}/${this.url}/by-subdomain/${identifier}`);
  }
  
  /**
   * Loads store details by custom domain
   * يزيل www. تلقائياً للبحث في قاعدة البيانات
   */
  loadStoreByCustomDomain(domain: string): Observable<StoreAddEdit> {
    // إزالة www. إذا كان موجوداً
    let normalizedDomain = domain.toLowerCase().trim();
    if (normalizedDomain.startsWith('www.')) {
      normalizedDomain = normalizedDomain.substring(4);
    }
    
    console.log('🔍 Loading store by custom domain:', domain, '→ Normalized:', normalizedDomain);
    return this.http.get<StoreAddEdit>(`${environment.appUrl}/${this.url}/by-custom-domain/${normalizedDomain}`);
  }
  
    /**
     * Get all stores for the current user (example)
     */
    getAllStores(): Observable<StoreAddEdit[]> {
      return this.http.get<StoreAddEdit[]>(`${environment.appUrl}/${this.url}`);
    }
  
    /**
     * Create a new store
     */
    // createStore(storeData: Partial<StoreAddEdit>): Observable<StoreAddEdit> {
    //   return this.http.post<StoreAddEdit>(`${environment.appUrl}/${this.url}`, storeData);
    // }
  
    /**
     * Update custom domain for a store
     */
    updateCustomDomain(storeId: number, customDomain: string): Observable<StoreAddEdit> {
      return this.http.put<StoreAddEdit>(`${environment.appUrl}/${this.url}/${storeId}/custom-domain`, { customDomain });
    }
  
    /**
     * Verify domain (e.g. DNS check, etc.)
     */
    verifyDomain(storeId: number): Observable<{ status: string }> {
      return this.http.post<{ status: string }>(`${environment.appUrl}/${this.url}/${storeId}/verify-domain`, {});
    }
  
    /**
     * Deactivate store (soft delete)
     */
    deactivateStore(storeId: number): Observable<void> {
      return this.http.put<void>(`${environment.appUrl}/${this.url}/${storeId}/deactivate`, {});
    }

    // ═══════════════════════════════════════════════════════════════
    // NEW METHODS - Multi-tenant Support
    // ═══════════════════════════════════════════════════════════════

    /**
     * Check if slug/subdomain is available
     * التحقق من توفر الـ slug
     */
    checkSlugAvailability(slug: string): Observable<{
      available: boolean;
      reason?: string;
      category?: string;
      slug?: string;
      preview?: string;
    }> {
      return this.http.get<any>(`${environment.appUrl}/${this.url}/check-slug/${slug}`);
    }

    /**
     * Get pending stores (Admin only)
     * الحصول على المتاجر المعلقة
     */
    getPendingStores(page: number = 1, limit: number = 10): Observable<any> {
      return this.http.get<any>(`${environment.appUrl}/${this.url}/pending?page=${page}&limit=${limit}`);
    }

    /**
     * Approve store (Admin only)
     * الموافقة على المتجر
     */
    approveStore(storeId: number): Observable<any> {
      return this.http.patch<any>(`${environment.appUrl}/${this.url}/${storeId}/approve`, {});
    }

    /**
     * Reject store (Admin only)
     * رفض المتجر
     */
    rejectStore(storeId: number, reason: string): Observable<any> {
      return this.http.patch<any>(`${environment.appUrl}/${this.url}/${storeId}/reject`, { reason });
    }

    /**
     * Get store review logs
     * الحصول على سجل مراجعة المتجر
     */
    getReviewLogs(storeId: number): Observable<any[]> {
      return this.http.get<any[]>(`${environment.appUrl}/${this.url}/${storeId}/review-logs`);
    }

}
