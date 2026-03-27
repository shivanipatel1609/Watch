import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Order } from '../../models/order.model';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { ReceiptService } from '../../services/receipt.service';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="relative overflow-hidden bg-[radial-gradient(circle_at_top,#edf6f2_0%,transparent_36%),linear-gradient(180deg,#ffffff_0%,#f9f9f9_100%)]">
      <div class="mx-auto max-w-7xl px-6 py-16">
      <div class="mb-10 max-w-3xl">
        <p class="text-sm font-semibold uppercase tracking-[0.38em] text-[#1F7A63]">Client Dashboard</p>
        <h1 class="mt-4 font-display text-5xl text-[#111111]">Private Caliber profile</h1>
        <p class="mt-4 max-w-2xl text-lg leading-8 text-[#4b5563]">
          Review orders, manage your saved timepieces, and access receipts in a clean client space built around the Caliber white and emerald identity.
        </p>
      </div>

      <div class="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div class="rounded-[2rem] border border-[#E5E5E5] bg-white p-8 shadow-[0_24px_60px_rgba(15,61,46,0.08)]">
          <p class="text-sm font-semibold uppercase tracking-[0.4em] text-[#1F7A63]">Client Profile</p>
          <h1 class="mt-4 font-display text-4xl text-[#111111]">{{ authService.user()?.name }}</h1>
          <p class="mt-3 text-[#4b5563]">{{ authService.user()?.email }}</p>
          <p class="text-[#4b5563]">{{ authService.user()?.phone }}</p>
          <div class="mt-8 rounded-[1.5rem] border border-[#DCE9E4] bg-[#F9F9F9] p-5">
            <p class="text-xs font-semibold uppercase tracking-[0.3em] text-[#1F7A63]">Wishlist</p>
            <p class="mt-3 text-3xl text-[#111111]">{{ authService.getWishlist().length }}</p>
          </div>
        </div>
        <div class="grid gap-6 md:grid-cols-3">
          <div class="rounded-[2rem] border border-[#E5E5E5] bg-white p-6 shadow-[0_20px_50px_rgba(15,61,46,0.06)]">
            <p class="text-xs font-semibold uppercase tracking-[0.3em] text-[#1F7A63]">Orders</p>
            <p class="mt-4 text-4xl text-[#111111]">{{ userOrders().length }}</p>
            <p class="mt-2 text-[#4b5563]">{{ activeOrdersCount() }} currently in transit</p>
          </div>
          <div class="rounded-[2rem] border border-[#E5E5E5] bg-white p-6 shadow-[0_20px_50px_rgba(15,61,46,0.06)]">
            <p class="text-xs font-semibold uppercase tracking-[0.3em] text-[#1F7A63]">Status</p>
            <p class="mt-4 text-4xl text-[#111111]">Elite</p>
            <p class="mt-2 text-[#4b5563]">Concierge delivery enabled</p>
          </div>
          <div class="rounded-[2rem] border border-[#E5E5E5] bg-white p-6 shadow-[0_20px_50px_rgba(15,61,46,0.06)]">
            <p class="text-xs font-semibold uppercase tracking-[0.3em] text-[#1F7A63]">Saved Timepieces</p>
            <p class="mt-4 text-4xl text-[#111111]">{{ authService.getWishlist().length }}</p>
            <p class="mt-2 text-[#4b5563]">Cross-device synchronized</p>
          </div>
          <div class="rounded-[2rem] border border-[#E5E5E5] bg-white p-6 shadow-[0_24px_60px_rgba(15,61,46,0.08)] md:col-span-3">
            <p class="text-sm font-semibold uppercase tracking-[0.35em] text-[#1F7A63]">Order Tracking</p>
            <div class="mt-6 space-y-5">
              @if (userOrders().length) {
                @for (order of userOrders(); track order.id) {
                  <div class="border-b border-[#EAEAEA] pb-4">
                    <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                      <div class="min-w-0">
                        <span class="break-words text-[#111111]">{{ order.products[0].name }} <span class="text-[#6b7280]">({{ order.id }})</span></span>
                      </div>
                      <div class="flex flex-wrap items-center justify-start gap-3 lg:justify-end">
                        <span class="rounded-full bg-[#ECF6F2] px-3 py-2 text-sm font-medium text-[#0F3D2E]">{{ order.orderStatus }}</span>
                        @if (canAccessReceipt(order)) {
                          <button type="button" (click)="openReceipt(order)" class="rounded-full border border-[#D7E5E0] px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#0F3D2E] transition hover:border-[#0F3D2E] hover:bg-[#F4FBF8]">
                            Show Receipt
                          </button>
                          <button type="button" (click)="downloadReceipt(order)" class="rounded-full bg-[#0F3D2E] px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#1F7A63]">
                            Download
                          </button>
                        } @else {
                          <span class="rounded-full border border-[#E5E5E5] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#6b7280]">
                            Receipt after delivery
                          </span>
                        }
                      </div>
                    </div>
                  </div>
                }
              } @else {
                <p class="text-[#4b5563]">No tracked orders yet. Place an order to see live status here.</p>
              }
            </div>
          </div>
        </div>
      </div>
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
                    <span>&#8377;{{ product.price * product.quantity | number:'1.0-0' }}</span>
                  </div>
                }
              </div>

              <div class="mt-6 flex items-center justify-between border-t border-[#E5E5E5] pt-5 text-lg">
                <span class="font-semibold text-[#111111]">Total</span>
                <span class="font-semibold text-[#0F3D2E]">&#8377;{{ receiptOrder.totalPrice | number:'1.0-0' }}</span>
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
export class DashboardPageComponent {
  readonly authService = inject(AuthService);
  private readonly orderService = inject(OrderService);
  private readonly receiptService = inject(ReceiptService);

  readonly selectedReceiptOrder = signal<Order | null>(null);
  readonly userOrders = computed(() => this.orderService.getOrdersForUser(this.authService.user()?.id));
  readonly activeOrdersCount = computed(() =>
    this.userOrders().filter((order) => order.orderStatus !== 'Delivered').length
  );

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

  formatPlacedAt(value?: string): string {
    if (!value) {
      return 'N/A';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  }

  canAccessReceipt(order: Order): boolean {
    return order.paymentMethod !== 'Cash on Delivery' || order.orderStatus === 'Delivered';
  }

}
