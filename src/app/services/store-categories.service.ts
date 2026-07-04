import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface StoreCategory {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  storeId: number;
}

@Injectable({ providedIn: 'root' })
export class StoreCategoriesService {
  private readonly base = `${environment.apiUrl}/store-categories`;

  constructor(private http: HttpClient) {}

  getByStore(storeId: number): Observable<StoreCategory[]> {
    return this.http.get<StoreCategory[]>(`${this.base}/store/${storeId}`);
  }

  create(data: Omit<StoreCategory, 'id'>): Observable<StoreCategory> {
    return this.http.post<StoreCategory>(this.base, data);
  }

  update(id: number, data: Partial<StoreCategory>): Observable<StoreCategory> {
    return this.http.patch<StoreCategory>(`${this.base}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
