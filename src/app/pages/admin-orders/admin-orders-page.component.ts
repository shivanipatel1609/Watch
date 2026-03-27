import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Order } from '../../models/order.model';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-admin-orders-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="mx-auto max-w-7xl px-6 py-16">
      <p class="text-sm uppercase tracking-[0.45em] text-[#6b7280]">Admin / Orders</p>
      <h1 class="mt-4 font-display text-5xl text-[#111111]">Order Queue</h1>
      <p class="mt-4 max-w-3xl leading-8 text-[#4b5563]">
        Orders are automatically marked as delivered 10 minutes after placement. Once delivered, status changes are locked.
      </p>

      <div class="mt-10 grid gap-5">
        @if (orderService.orders().length) {
          @for (order of orderService.orders(); track order.id) {
            <div class="rounded-[1.5rem] border border-[#d8dde3] bg-white p-6 shadow-[0_12px_24px_rgba(15,23,42,0.04)]">
              <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p class="text-[#111111]">{{ order.id }}</p>
                  <p class="mt-2 text-[#4b5563]">{{ order.products[0].name }} · {{ order.city }}</p>
                  <p class="mt-2 text-sm text-[#6b7280]">{{ customerName(order.userId) }} · {{ customerEmail(order.userId) }}</p>
                  @if (order.createdAt) {
                    <p class="mt-2 text-xs uppercase tracking-[0.2em] text-[#9ca3af]">Placed {{ order.createdAt | date:'medium' }}</p>
                  }
                </div>

                @if (orderService.isDeliveredLocked(order)) {
                  <div class="text-right">
                    <div class="rounded-full border border-[#d1d5db] bg-[#f3f4f6] px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#111111]">
                      Delivered
                    </div>
                    <p class="mt-2 text-xs uppercase tracking-[0.18em] text-[#9ca3af]">Locked</p>
                  </div>
                } @else {
                  <select
                    [ngModel]="order.orderStatus"
                    (ngModelChange)="updateStatus(order.id, $event)"
                    class="rounded-full border border-[#d8dde3] bg-[#f8fafc] px-5 py-3 text-[#111111]"
                  >
                    @for (status of statuses; track status) {
                      <option [value]="status">{{ status }}</option>
                    }
                  </select>
                }
              </div>
            </div>
          }
        } @else {
          <div class="rounded-[1.5rem] border border-dashed border-[#d8dde3] bg-white p-8 text-[#6b7280]">
            No orders available yet. Orders placed from checkout will appear here for status management.
          </div>
        }
      </div>
    </section>
  `
})
export class AdminOrdersPageComponent {
  private readonly authService = inject(AuthService);
  readonly orderService = inject(OrderService);
  readonly statuses: Order['orderStatus'][] = ['Processing', 'Packed', 'Shipped', 'Delivered'];

  updateStatus(orderId: string, status: Order['orderStatus']): void {
    void this.orderService.updateOrderStatus(orderId, status);
  }

  customerName(userId: string): string {
    return this.authService.getUserById(userId)?.name ?? 'Unknown Customer';
  }

  customerEmail(userId: string): string {
    return this.authService.getUserById(userId)?.email ?? 'N/A';
  }
}
