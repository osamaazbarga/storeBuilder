import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StoreAddEdit } from '../models/store/StoreAddEdit';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  private url="Store";

  constructor(private http:HttpClient) { }

  getStores(){
    this.http.get(`${environment.appUrl}/${this.url}`)
  }
  getIsAvalibleLink(link:string){
    return this.http.get(`${environment.appUrl}/${this.url}/check-availble-link/${link}`)
  }

  getStoreByUserId(userId:string){
    return this.http.get(`${environment.appUrl}/${this.url}/get-store-by-user/${userId}`)
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

  getSubdomain(): string {
    const host = window.location.hostname; // e.g., test12.localtest.me
    const parts = host.split('.');
    return parts.length > 2 ? parts[0] : ''; // returns 'test12'
  }



 

    /**
   * Loads store details based on subdomain
   */
    loadStoreBySubdomain(subdomain: string): Observable<StoreAddEdit> {
      return this.http.get<StoreAddEdit>(`${environment.appUrl}/${this.url}/by-subdomain/${subdomain}`);
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

}
