import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CartItem {
  productId: number;
  variantId?: number;
  title: string;
  image?: string;
  price: number;
  quantity: number;
}

export interface Cart {
  storeId: number;
  items: CartItem[];
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartSubjects = new Map<number, BehaviorSubject<CartItem[]>>();

  // ── PRIVATE HELPERS ──────────────────────────────────────────

  private storageKey(storeId: number): string {
    return `cart_${storeId}`;
  }

  private loadFromStorage(storeId: number): CartItem[] {
    try {
      const raw = localStorage.getItem(this.storageKey(storeId));
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveToStorage(storeId: number, items: CartItem[]): void {
    localStorage.setItem(this.storageKey(storeId), JSON.stringify(items));
  }

  private getSubject(storeId: number): BehaviorSubject<CartItem[]> {
    if (!this.cartSubjects.has(storeId)) {
      const initial = this.loadFromStorage(storeId);
      this.cartSubjects.set(storeId, new BehaviorSubject<CartItem[]>(initial));
    }
    return this.cartSubjects.get(storeId)!;
  }

  private emit(storeId: number, items: CartItem[]): void {
    this.saveToStorage(storeId, items);
    this.getSubject(storeId).next(items);
  }

  // ── PUBLIC API ───────────────────────────────────────────────

  getCart$(storeId: number): Observable<CartItem[]> {
    return this.getSubject(storeId).asObservable();
  }

  getCart(storeId: number): CartItem[] {
    return this.getSubject(storeId).value;
  }

  cartCount$(storeId: number): Observable<number> {
    return new Observable((observer) => {
      this.getSubject(storeId).subscribe((items) => {
        observer.next(items.reduce((sum, i) => sum + i.quantity, 0));
      });
    });
  }

  getCartTotal(storeId: number): number {
    return this.getCart(storeId).reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );
  }

  addItem(storeId: number, product: Omit<CartItem, 'quantity'>, quantity = 1): void {
    const items = [...this.getCart(storeId)];
    const idx = items.findIndex(
      (i) => i.productId === product.productId && i.variantId === product.variantId
    );

    if (idx >= 0) {
      items[idx] = { ...items[idx], quantity: items[idx].quantity + quantity };
    } else {
      items.push({ ...product, quantity });
    }

    this.emit(storeId, items);
  }

  updateQuantity(storeId: number, productId: number, quantity: number, variantId?: number): void {
    if (quantity <= 0) {
      this.removeItem(storeId, productId, variantId);
      return;
    }
    const items = this.getCart(storeId).map((i) =>
      i.productId === productId && i.variantId === variantId
        ? { ...i, quantity }
        : i
    );
    this.emit(storeId, items);
  }

  removeItem(storeId: number, productId: number, variantId?: number): void {
    const items = this.getCart(storeId).filter(
      (i) => !(i.productId === productId && i.variantId === variantId)
    );
    this.emit(storeId, items);
  }

  clearCart(storeId: number): void {
    this.emit(storeId, []);
  }

  itemCount(storeId: number): number {
    return this.getCart(storeId).reduce((sum, i) => sum + i.quantity, 0);
  }
}
