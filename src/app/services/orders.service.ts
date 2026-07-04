import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface ShippingAddress {
  street: string;
  city: string;
  district?: string;
  postalCode?: string;
  country: string;
}

export interface OrderItemPayload {
  productId: number;
  variantId?: number;
  quantity: number;
}

export interface CreateOrderPayload {
  storeId: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: ShippingAddress;
  paymentMethod?: string;
  notes?: string;
  items: OrderItemPayload[];
}

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private readonly base = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  createOrder(payload: CreateOrderPayload): Observable<any> {
    return this.http.post(this.base, payload);
  }

  getStoreOrders(storeId: number, page = 1, limit = 20, status?: string): Observable<any> {
    const params: any = { page, limit };
    if (status) params['status'] = status;
    return this.http.get(`${this.base}/store/${storeId}`, { params });
  }

  getOrderById(id: number): Observable<any> {
    return this.http.get(`${this.base}/${id}`);
  }

  getOrderByNumber(orderNumber: string): Observable<any> {
    return this.http.get(`${this.base}/number/${orderNumber}`);
  }

  updateOrderStatus(id: number, status: string, notes?: string): Observable<any> {
    return this.http.patch(`${this.base}/${id}/status`, { status, notes });
  }

  getStoreStats(storeId: number): Observable<any> {
    return this.http.get(`${this.base}/stats/${storeId}`);
  }
}
