import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

/**
 * Reserved Words Service - خدمة الكلمات المحجوزة
 */
@Injectable({
  providedIn: 'root'
})
export class ReservedWordsService {

  constructor(private http: HttpClient) { }

  /**
   * Check if a word is reserved
   * التحقق من كلمة محجوزة
   */
  checkWord(word: string, language?: 'en' | 'ar' | 'all'): Observable<{
    isReserved: boolean;
    reason?: string;
    category?: string;
  }> {
    return this.http.post<any>(`${environment.appUrl}/reserved-words/check`, {
      word,
      language
    });
  }

  /**
   * Get all reserved words
   * الحصول على جميع الكلمات المحجوزة
   */
  getAllReservedWords(
    category?: string,
    language?: string,
    page: number = 1,
    limit: number = 50
  ): Observable<{
    data: any[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    let url = `${environment.appUrl}/reserved-words?page=${page}&limit=${limit}`;
    if (category) url += `&category=${category}`;
    if (language) url += `&language=${language}`;
    
    return this.http.get<any>(url);
  }

  /**
   * Get a reserved word by ID
   * الحصول على كلمة محجوزة حسب المعرف
   */
  getReservedWord(id: number): Observable<any> {
    return this.http.get<any>(`${environment.appUrl}/reserved-words/${id}`);
  }

  /**
   * Add a new reserved word (Admin only)
   * إضافة كلمة محجوزة جديدة
   */
  addReservedWord(data: {
    word: string;
    category: string;
    language: string;
    reason?: string;
  }): Observable<any> {
    return this.http.post<any>(`${environment.appUrl}/reserved-words`, data);
  }

  /**
   * Delete a reserved word (Admin only)
   * حذف كلمة محجوزة
   */
  deleteReservedWord(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.appUrl}/reserved-words/${id}`);
  }
}
