import { Injectable, computed, inject, signal } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc
} from '@angular/fire/firestore';
import { environment } from '../environment';
import { Order } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly firestore = inject(Firestore);
  private readonly ordersCollection = collection(this.firestore, 'orders');
  private readonly storageKey = 'caliber-orders';
  private readonly autoDeliveryWindowMs = 10 * 60 * 1000;
  private readonly ordersState = signal<Order[]>([]);
  private readonly firebaseEnabled = this.isFirebaseConfigured();

  readonly orders = this.ordersState.asReadonly();
  readonly activeOrdersCount = computed(() =>
    this.ordersState().filter((order) => order.orderStatus !== 'Delivered').length
  );

  constructor() {
    if (this.firebaseEnabled) {
      this.bindOrders();
    } else {
      this.ordersState.set(this.sortOrders(this.restoreOrders().map((order) => this.normalizeOrder(order))));
    }

    this.applyAutoDelivery();
    window.setInterval(() => this.applyAutoDelivery(), 30_000);
  }

  async createOrder(order: Order): Promise<void> {
    const nextOrder = this.normalizeOrder({
      ...order,
      createdAt: order.createdAt ?? new Date().toISOString()
    });

    if (!this.firebaseEnabled) {
      this.ordersState.update((orders) => this.sortOrders([nextOrder, ...orders]));
      this.persistOrders(this.ordersState());
      return;
    }

    await setDoc(doc(this.firestore, 'orders', nextOrder.id), nextOrder);
  }

  async updateOrderStatus(orderId: string, status: Order['orderStatus']): Promise<void> {
    const order = this.ordersState().find((entry) => entry.id === orderId);
    if (!order || order.orderStatus === 'Delivered') {
      return;
    }

    if (!this.firebaseEnabled) {
      this.ordersState.update((orders) =>
        this.sortOrders(
          orders.map((entry) =>
            entry.id === orderId
              ? this.normalizeOrder({
                  ...entry,
                  orderStatus: status,
                  deliveredAt: status === 'Delivered' ? new Date().toISOString() : entry.deliveredAt
                })
              : entry
          )
        )
      );
      this.persistOrders(this.ordersState());
      return;
    }

    await updateDoc(doc(this.firestore, 'orders', orderId), {
      orderStatus: status,
      deliveredAt: status === 'Delivered' ? new Date().toISOString() : order.deliveredAt ?? null
    });
  }

  getOrdersForUser(userId: string | undefined): Order[] {
    if (!userId) {
      return [];
    }
    return this.ordersState().filter((order) => order.userId === userId);
  }

  isDeliveredLocked(order: Order): boolean {
    return order.orderStatus === 'Delivered';
  }

  private bindOrders(): void {
    onSnapshot(this.ordersCollection, (snapshot) => {
      const orders = snapshot.docs.map((entry) => this.normalizeOrder(entry.data() as Order));
      this.ordersState.set(this.sortOrders(orders));
    }, (error) => {
      console.error('Failed to load orders from Firestore:', error);
      this.ordersState.set([]);
    });
  }

  private applyAutoDelivery(): void {
    for (const order of this.ordersState()) {
      if (order.orderStatus === 'Delivered' || !order.createdAt) {
        continue;
      }

      const createdAt = new Date(order.createdAt).getTime();
      if (Number.isNaN(createdAt) || Date.now() - createdAt < this.autoDeliveryWindowMs) {
        continue;
      }

      if (!this.firebaseEnabled) {
        this.ordersState.update((orders) =>
          this.sortOrders(
            orders.map((entry) =>
              entry.id === order.id
                ? this.normalizeOrder({
                    ...entry,
                    orderStatus: 'Delivered',
                    deliveredAt: order.deliveredAt ?? new Date(createdAt + this.autoDeliveryWindowMs).toISOString()
                  })
                : entry
            )
          )
        );
        this.persistOrders(this.ordersState());
        continue;
      }

      void updateDoc(doc(this.firestore, 'orders', order.id), {
        orderStatus: 'Delivered',
        deliveredAt: order.deliveredAt ?? new Date(createdAt + this.autoDeliveryWindowMs).toISOString()
      });
    }
  }

  private normalizeOrder(order: Order): Order {
    const createdAt = order.createdAt ?? new Date().toISOString();
    return {
      ...order,
      createdAt,
      deliveredAt: order.orderStatus === 'Delivered' ? order.deliveredAt ?? new Date().toISOString() : order.deliveredAt
    };
  }

  private sortOrders(orders: Order[]): Order[] {
    return [...orders].sort((left, right) => {
      const leftTime = left.createdAt ? new Date(left.createdAt).getTime() : 0;
      const rightTime = right.createdAt ? new Date(right.createdAt).getTime() : 0;
      return rightTime - leftTime;
    });
  }

  private restoreOrders(): Order[] {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) as Order[] : [];
    } catch {
      localStorage.removeItem(this.storageKey);
      return [];
    }
  }

  private persistOrders(orders: Order[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(orders));
  }

  private isFirebaseConfigured(): boolean {
    const { apiKey, projectId, appId } = environment.firebase;
    return ![apiKey, projectId, appId].some((value) => !value || value.startsWith('YOUR_FIREBASE_'));
  }
}
