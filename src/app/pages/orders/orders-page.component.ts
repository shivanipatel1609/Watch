import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Order } from '../../models/order.model';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { ReceiptService } from '../../services/receipt.service';

@Component({
  selector: 'app-orders-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="relative overflow-hidden px-6 py-16 lg:py-20">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(15,61,46,0.08),transparent_28%),linear-gradient(180deg,#ffffff_0%,#f9fbfa_52%,#f4f8f6_100%)]"></div>

      <div class="relative mx-auto max-w-7xl">
        <div class="rounded-[2.25rem] border border-[#E5E5E5] bg-white p-8 shadow-[0_24px_60px_rgba(15,61,46,0.08)] lg:p-10">
          <div class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p class="text-sm font-semibold uppercase tracking-[0.38em] text-[#1F7A63]">Orders</p>
              <h1 class="mt-4 font-display text-5xl text-[#111111]">Order Tracking</h1>
              <p class="mt-4 max-w-3xl text-lg leading-8 text-[#4b5563]">
                Review your complete order history, current delivery status, and available receipts.
              </p>
            </div>

            <div class="flex flex-wrap gap-3">
              <a routerLink="/profile" class="rounded-full border border-[#E5E5E5] px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-[#111111] hover:border-[#0F3D2E] hover:text-[#0F3D2E]">
                Back to Profile
              </a>
              <a routerLink="/catalog" class="rounded-full bg-[#0F3D2E] px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-white hover:bg-[#1F7A63]">
                Browse Watches
              </a>
            </div>
          </div>

          <div class="mt-8 grid gap-4 md:grid-cols-3">
            <div class="rounded-[1.5rem] border border-[#E5E5E5] bg-[#F9F9F9] p-5">
              <p class="text-xs font-semibold uppercase tracking-[0.24em] text-[#1F7A63]">Total Orders</p>
              <p class="mt-3 text-4xl text-[#111111]">{{ userOrders().length }}</p>
            </div>
            <div class="rounded-[1.5rem] border border-[#E5E5E5] bg-[#F9F9F9] p-5">
              <p class="text-xs font-semibold uppercase tracking-[0.24em] text-[#1F7A63]">Active</p>
              <p class="mt-3 text-4xl text-[#111111]">{{ activeOrdersCount() }}</p>
            </div>
            <div class="rounded-[1.5rem] border border-[#E5E5E5] bg-[#F9F9F9] p-5">
              <p class="text-xs font-semibold uppercase tracking-[0.24em] text-[#1F7A63]">Delivered</p>
              <p class="mt-3 text-4xl text-[#111111]">{{ deliveredOrdersCount() }}</p>
            </div>
          </div>
        </div>

        @if (!userOrders().length) {
          <div class="mt-10 rounded-[2rem] border border-dashed border-[#D8E4DF] bg-white p-12 text-center shadow-[0_18px_45px_rgba(17,17,17,0.04)]">
            <p class="text-lg text-[#4b5563]">No orders yet.</p>
            <a routerLink="/catalog" class="mt-6 inline-flex rounded-full bg-[#0F3D2E] px-6 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-white hover:bg-[#1F7A63]">
              Start Shopping
            </a>
          </div>
        } @else {
          <div class="mt-10 overflow-x-auto rounded-[2rem] border border-[#E5E5E5] bg-white p-6 shadow-[0_18px_45px_rgba(17,17,17,0.05)]">
            <table class="min-w-full border-separate border-spacing-y-3">
              <thead>
                <tr class="text-left text-xs font-semibold uppercase tracking-[0.24em] text-[#6e7681]">
                  <th class="pb-2 pr-4">Order</th>
                  <th class="pb-2 pr-4">Watch</th>
                  <th class="pb-2 pr-4">Placed</th>
                  <th class="pb-2 pr-4">Total</th>
                  <th class="pb-2 pr-4">Status</th>
                  <th class="pb-2 pr-4">Receipt</th>
                </tr>
              </thead>
              <tbody>
                @for (order of userOrders(); track order.id) {
                  <tr class="rounded-[1.25rem] bg-[#F9FBFA]">
                    <td class="rounded-l-[1.25rem] px-4 py-4 text-[#111111]">{{ shortOrderId(order.id) }}</td>
                    <td class="px-4 py-4 text-[#111111]">{{ order.products[0].name }}</td>
                    <td class="px-4 py-4 text-[#4b5563]">{{ formatPlacedAt(order.createdAt) }}</td>
                    <td class="px-4 py-4 text-[#111111]">₹{{ order.totalPrice | number:'1.0-0' }}</td>
                    <td class="px-4 py-4">
                      <span class="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]" [ngClass]="statusClasses(order.orderStatus)">
                        {{ order.orderStatus }}
                      </span>
                    </td>
                    <td class="rounded-r-[1.25rem] px-4 py-4">
                      <div class="flex flex-wrap gap-2">
                        @if (canAccessReceipt(order)) {
                          <button type="button" (click)="openReceipt(order)" class="rounded-full border border-[#D7E5E0] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#0F3D2E] hover:border-[#0F3D2E] hover:bg-[#F4FBF8]">
                            Show
                          </button>
                          <button type="button" (click)="downloadReceipt(order)" class="rounded-full bg-[#0F3D2E] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white hover:bg-[#1F7A63]">
                            Download
                          </button>
                        } @else {
                          <span class="rounded-full border border-[#E5E5E5] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#6b7280]">
                            After delivery
                          </span>
                        }
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>

      @if (selectedReceiptOrder(); as receiptOrder) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-[#0f3d2e]/12 p-6 backdrop-blur-sm">
          <div class="w-full max-w-2xl rounded-[2rem] border border-[#E5E5E5] bg-white p-8 shadow-[0_26px_60px_rgba(15,61,46,0.16)]">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="text-sm font-semibold uppercase tracking-[0.32em] text-[#1F7A63]">Receipt</p>
                <h3 class="mt-3 text-[3rem] font-semibold leading-none tracking-[-0.05em] text-[#111111]">{{ receiptOrder.id }}</h3>
              </div>
              <button type="button" (click)="closeReceipt()" class="rounded-full border border-[#E5E5E5] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#111111] hover:border-[#0F3D2E] hover:text-[#0F3D2E]">
                Close
              </button>
            </div>

            <div class="mt-8 rounded-[1.5rem] border border-[#E5E5E5] bg-[#F9F9F9] p-6">
              <div class="grid gap-3 text-sm text-[#4b5563] md:grid-cols-2">
                <div><span class="font-semibold text-[#111111]">Customer:</span> {{ authService.user()?.name }}</div>
                <div><span class="font-semibold text-[#111111]">Email:</span> {{ authService.user()?.email }}</div>
                <div><span class="font-semibold text-[#111111]">City:</span> {{ receiptOrder.city }}</div>
                <div><span class="font-semibold text-[#111111]">Payment:</span> {{ receiptOrder.paymentMethod }}</div>
                <div><span class="font-semibold text-[#111111]">Status:</span> {{ receiptOrder.orderStatus }}</div>
                <div><span class="font-semibold text-[#111111]">Placed:</span> {{ formatPlacedAt(receiptOrder.createdAt) }}</div>
              </div>

              <div class="mt-6 border-t border-[#E5E5E5] pt-6">
                @for (product of receiptOrder.products; track product.watchId) {
                  <div class="flex items-center justify-between gap-4 border-b border-[#EBEBEB] py-3 text-[#111111] last:border-b-0">
                    <span>{{ product.name }} x {{ product.quantity }}</span>
                    <span>₹{{ product.price * product.quantity | number:'1.0-0' }}</span>
                  </div>
                }
              </div>

              <div class="mt-6 flex items-center justify-between border-t border-[#E5E5E5] pt-5 text-lg">
                <span class="font-semibold text-[#111111]">Total</span>
                <span class="font-semibold text-[#0F3D2E]">₹{{ receiptOrder.totalPrice | number:'1.0-0' }}</span>
              </div>
            </div>

            <div class="mt-6 flex flex-wrap gap-3">
              <button type="button" (click)="downloadReceipt(receiptOrder)" class="rounded-full bg-[#0F3D2E] px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-white hover:bg-[#1F7A63]">
                Download Receipt
              </button>
              <button type="button" (click)="closeReceipt()" class="rounded-full border border-[#E5E5E5] px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-[#111111] hover:border-[#0F3D2E] hover:text-[#0F3D2E]">
                Close
              </button>
            </div>
          </div>
        </div>
      }
    </section>
  `
})
export class OrdersPageComponent {
  readonly authService = inject(AuthService);
  private readonly orderService = inject(OrderService);
  private readonly receiptService = inject(ReceiptService);

  readonly selectedReceiptOrder = signal<Order | null>(null);
  readonly userOrders = computed(() => this.orderService.getOrdersForUser(this.authService.user()?.id));
  readonly activeOrdersCount = computed(() => this.userOrders().filter((order) => order.orderStatus !== 'Delivered').length);
  readonly deliveredOrdersCount = computed(() => this.userOrders().filter((order) => order.orderStatus === 'Delivered').length);

  shortOrderId(orderId: string): string {
    return orderId.slice(0, 8);
  }

  statusClasses(status: string): string {
    const normalized = status.toLowerCase();
    if (normalized.includes('deliver')) {
      return 'bg-[#dfe7d5] text-[#536146]';
    }
    if (normalized.includes('ship')) {
      return 'bg-[#e5ecf4] text-[#48617f]';
    }
    if (normalized.includes('pack')) {
      return 'bg-[#efe4d5] text-[#8a6845]';
    }
    return 'bg-[#ece7df] text-[#6e7681]';
  }

  openReceipt(order: Order): void {
    if (!this.canAccessReceipt(order)) {
      return;
    }
    this.selectedReceiptOrder.set(order);
  }

  closeReceipt(): void {
    this.selectedReceiptOrder.set(null);
  }

  downloadReceipt(order: Order): void {
    if (!this.canAccessReceipt(order)) {
      return;
    }

    this.receiptService.downloadOrderReceipt(order, {
      name: this.authService.user()?.name ?? 'Member',
      email: this.authService.user()?.email ?? 'N/A',
      phone: this.authService.user()?.phone ?? 'N/A'
    });
  }

  canAccessReceipt(order: Order): boolean {
    return order.paymentMethod !== 'Cash on Delivery' || order.orderStatus === 'Delivered';
  }

  formatPlacedAt(value?: string): string {
    if (!value) {
      return 'N/A';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }
}
