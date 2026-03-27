import { Injectable, computed, signal } from '@angular/core';
import { Watch } from '../models/watch.model';

export interface CartItem {
  watch: Watch;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly itemsState = signal<CartItem[]>([]);
  private readonly couponState = signal<string>('');

  readonly items = this.itemsState.asReadonly();
  readonly coupon = this.couponState.asReadonly();
  readonly subtotal = computed(() => this.itemsState().reduce((sum, item) => sum + item.watch.price * item.quantity, 0));
  readonly discount = computed(() => this.couponState().toUpperCase() === 'CALIBER10' ? this.subtotal() * 0.1 : 0);
  readonly total = computed(() => this.subtotal() - this.discount());

  addToCart(watch: Watch): void {
    const existing = this.itemsState().find((item) => item.watch.id === watch.id);
    if (existing) {
      this.updateQuantity(watch.id, existing.quantity + 1);
      return;
    }

    this.itemsState.update((items) => [...items, { watch, quantity: 1 }]);
  }

  updateQuantity(watchId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(watchId);
      return;
    }

    this.itemsState.update((items) =>
      items.map((item) => item.watch.id === watchId ? { ...item, quantity } : item)
    );
  }

  removeItem(watchId: string): void {
    this.itemsState.update((items) => items.filter((item) => item.watch.id !== watchId));
  }

  applyCoupon(code: string): void {
    this.couponState.set(code.trim());
  }

  clearCart(): void {
    this.itemsState.set([]);
    this.couponState.set('');
  }
}
