import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { WatchService } from '../../services/watch.service';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="relative overflow-hidden px-6 py-16 lg:py-20">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(115,115,115,0.16),transparent_28%),linear-gradient(180deg,#ffffff_0%,#f7f7f7_58%,#ededed_100%)]"></div>
      <div class="relative mx-auto max-w-7xl">
        <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p class="text-sm font-semibold uppercase tracking-[0.42em] text-[#6b6b6b]">Admin Dashboard</p>
            <h1 class="mt-4 font-display text-5xl text-[#111111] md:text-6xl">Commerce command center</h1>
            <p class="mt-5 max-w-3xl text-lg leading-8 text-[#4d4d4d]">
              Manage watches, fulfillment, customer activity, analytics, and store operations from one place.
            </p>
          </div>
          <a routerLink="/admin/watches" class="rounded-full bg-[#111111] px-6 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-[#303030]">
            Manage Inventory
          </a>
        </div>

        <div class="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div class="rounded-[2rem] border border-[#d4d4d4] bg-white p-6 shadow-[0_16px_30px_rgba(0,0,0,0.06)]">
            <p class="text-xs font-semibold uppercase tracking-[0.24em] text-[#6b6b6b]">Total Sales</p>
            <p class="mt-4 text-4xl text-[#111111]">Rs {{ totalSales() | number:'1.0-0' }}</p>
          </div>
          <div class="rounded-[2rem] border border-[#d4d4d4] bg-white p-6 shadow-[0_16px_30px_rgba(0,0,0,0.06)]">
            <p class="text-xs font-semibold uppercase tracking-[0.24em] text-[#6b6b6b]">Total Orders</p>
            <p class="mt-4 text-4xl text-[#111111]">{{ ordersCount() }}</p>
          </div>
          <div class="rounded-[2rem] border border-[#d4d4d4] bg-white p-6 shadow-[0_16px_30px_rgba(0,0,0,0.06)]">
            <p class="text-xs font-semibold uppercase tracking-[0.24em] text-[#6b6b6b]">Top Seller</p>
            <p class="mt-4 text-2xl text-[#111111]">{{ topSeller() }}</p>
          </div>
          <div class="rounded-[2rem] border border-[#d4d4d4] bg-white p-6 shadow-[0_16px_30px_rgba(0,0,0,0.06)]">
            <p class="text-xs font-semibold uppercase tracking-[0.24em] text-[#6b6b6b]">Total Users</p>
            <p class="mt-4 text-4xl text-[#111111]">{{ totalUsers() }}</p>
          </div>
        </div>

        <div class="mt-10 grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <div class="rounded-[2rem] border border-[#d4d4d4] bg-white p-8 shadow-[0_16px_30px_rgba(0,0,0,0.06)]">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="text-sm font-semibold uppercase tracking-[0.35em] text-[#6b6b6b]">Revenue Chart</p>
                <p class="mt-3 text-3xl text-[#111111]">Rs {{ totalSales() | number:'1.0-0' }}</p>
                <p class="mt-2 text-sm text-[#6b6b6b]">Distributed across the latest six revenue slots.</p>
              </div>
              <div class="rounded-full border border-[#d4d4d4] bg-[#fafafa] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#6b6b6b]">
                Peak Rs {{ maxRevenueSlot() | number:'1.0-0' }}
              </div>
            </div>

            <div class="mt-8 rounded-[1.75rem] border border-[#ececec] bg-[linear-gradient(180deg,#ffffff_0%,#f8f8f8_100%)] p-6">
              <div class="relative h-72">
                <div class="absolute inset-0 flex flex-col justify-between pb-10">
                  @for (line of chartGuideLines; track line) {
                    <div class="border-t border-dashed border-[#e5e5e5]"></div>
                  }
                </div>

                <div class="absolute bottom-10 left-0 right-0 border-t border-[#cfcfcf]"></div>

                <div class="relative flex h-full items-end gap-4">
                  @for (bar of revenueChartData(); track bar.label) {
                    <div class="flex h-full flex-1 flex-col justify-end">
                      <div class="flex h-full flex-col justify-end">
                        <p class="mb-3 text-center text-xs font-medium text-[#7a7a7a]">Rs {{ bar.total | number:'1.0-0' }}</p>
                        <div
                          class="mx-auto w-full max-w-[5rem] rounded-t-[1.1rem] bg-gradient-to-t from-[#111111] via-[#4a4a4a] to-[#b8b8b8] shadow-[0_14px_24px_rgba(0,0,0,0.12)]"
                          [style.height.%]="bar.height"
                        ></div>
                      </div>
                      <p class="mt-4 text-center text-xs font-semibold uppercase tracking-[0.18em] text-[#6b6b6b]">{{ bar.label }}</p>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>

          <div class="rounded-[2rem] border border-[#d4d4d4] bg-white p-8 shadow-[0_16px_30px_rgba(0,0,0,0.06)]">
            <p class="text-sm font-semibold uppercase tracking-[0.35em] text-[#6b6b6b]">Order Queue</p>
            <div class="mt-8 space-y-4">
              @if (recentOrders().length) {
                @for (order of recentOrders(); track order.id) {
                  <div class="rounded-[1.5rem] border border-[#d4d4d4] bg-[#fafafa] p-4">
                    <p class="text-[#111111]">{{ order.id }}</p>
                    <p class="mt-2 text-[#4d4d4d]">{{ order.products[0].name }}</p>
                    <p class="mt-2 text-sm text-[#6b6b6b]">{{ customerName(order.userId) }}</p>
                    <p class="mt-2 text-[#111111]">{{ order.orderStatus }}</p>
                  </div>
                }
              } @else {
                <div class="rounded-[1.5rem] border border-dashed border-[#d4d4d4] p-6 text-[#6b6b6b]">
                  No orders yet. New checkout orders will appear here.
                </div>
              }
            </div>
          </div>
        </div>

        <div class="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <a routerLink="/admin/watches" class="rounded-[1.5rem] border border-[#d4d4d4] bg-[#fafafa] p-5 text-[#111111] shadow-[0_14px_26px_rgba(0,0,0,0.04)] hover:border-[#111111]">Manage Watches</a>
          <a routerLink="/admin/orders" class="rounded-[1.5rem] border border-[#d4d4d4] bg-[#fafafa] p-5 text-[#111111] shadow-[0_14px_26px_rgba(0,0,0,0.04)] hover:border-[#111111]">Manage Orders</a>
          <a routerLink="/admin/users" class="rounded-[1.5rem] border border-[#d4d4d4] bg-[#fafafa] p-5 text-[#111111] shadow-[0_14px_26px_rgba(0,0,0,0.04)] hover:border-[#111111]">User Management</a>
          <a routerLink="/admin/analytics" class="rounded-[1.5rem] border border-[#d4d4d4] bg-[#fafafa] p-5 text-[#111111] shadow-[0_14px_26px_rgba(0,0,0,0.04)] hover:border-[#111111]">Analytics</a>
          <a routerLink="/admin/settings" class="rounded-[1.5rem] border border-[#d4d4d4] bg-[#fafafa] p-5 text-[#111111] shadow-[0_14px_26px_rgba(0,0,0,0.04)] hover:border-[#111111]">Settings</a>
        </div>
      </div>
    </section>
  `
})
export class AdminPageComponent {
  private readonly authService = inject(AuthService);
  private readonly orderService = inject(OrderService);
  private readonly watchService = inject(WatchService);
  readonly chartGuideLines = [1, 2, 3, 4];

  readonly ordersCount = computed(() => this.orderService.orders().length);
  readonly totalSales = computed(() => this.orderService.orders().reduce((sum, order) => sum + order.totalPrice, 0));
  readonly topSeller = computed(() => {
    const counts = new Map<string, number>();
    for (const order of this.orderService.orders()) {
      for (const product of order.products) {
        counts.set(product.name, (counts.get(product.name) ?? 0) + product.quantity);
      }
    }
    const top = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
    return top?.[0] ?? 'No sales yet';
  });
  readonly totalUsers = computed(() => this.authService.getAllUsers().length);
  readonly recentOrders = computed(() => this.orderService.orders().slice(0, 3));
  readonly revenueChartData = computed(() => {
    const orders = this.orderService.orders();
    const labels = ['Slot 1', 'Slot 2', 'Slot 3', 'Slot 4', 'Slot 5', 'Slot 6'];

    if (!orders.length) {
      return [
        { label: labels[0], total: 164000, height: 30 },
        { label: labels[1], total: 312000, height: 58 },
        { label: labels[2], total: 228000, height: 42 },
        { label: labels[3], total: 276000, height: 51 },
        { label: labels[4], total: 241000, height: 45 },
        { label: labels[5], total: 334000, height: 62 }
      ];
    }

    const bars = [0, 0, 0, 0, 0, 0];
    orders.forEach((order, index) => {
      bars[index % bars.length] += order.totalPrice;
    });

    const max = Math.max(...bars, 1);
    return bars.map((value, index) => ({
      label: labels[index],
      total: value,
      height: Math.max(18, Math.round((value / max) * 100))
    }));
  });
  readonly maxRevenueSlot = computed(() => Math.max(...this.revenueChartData().map((bar) => bar.total), 0));

  customerName(userId: string): string {
    return this.authService.getUserById(userId)?.name ?? 'Unknown Customer';
  }
}
