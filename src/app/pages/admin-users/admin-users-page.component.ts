import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-admin-users-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="mx-auto max-w-7xl px-6 py-16">
      <p class="text-sm uppercase tracking-[0.45em] text-[#6b7280]">Admin / Users</p>
      <h1 class="mt-4 font-display text-5xl text-[#111111]">User Management</h1>
      <p class="mt-4 max-w-3xl leading-8 text-[#4b5563]">
        Every registered or logged-in customer is listed here with live order activity from the storefront.
      </p>

      <div class="mt-10 grid gap-5 md:grid-cols-3">
        <div class="rounded-[1.5rem] border border-[#d8dde3] bg-white p-6 shadow-[0_12px_24px_rgba(15,23,42,0.04)]">
          <p class="text-xs uppercase tracking-[0.25em] text-[#6b7280]">Total Users</p>
          <p class="mt-4 text-4xl text-[#111111]">{{ users().length }}</p>
        </div>
        <div class="rounded-[1.5rem] border border-[#d8dde3] bg-white p-6 shadow-[0_12px_24px_rgba(15,23,42,0.04)]">
          <p class="text-xs uppercase tracking-[0.25em] text-[#6b7280]">Active Buyers</p>
          <p class="mt-4 text-4xl text-[#111111]">{{ activeBuyersCount() }}</p>
        </div>
        <div class="rounded-[1.5rem] border border-[#d8dde3] bg-white p-6 shadow-[0_12px_24px_rgba(15,23,42,0.04)]">
          <p class="text-xs uppercase tracking-[0.25em] text-[#6b7280]">Admins</p>
          <p class="mt-4 text-4xl text-[#111111]">{{ adminCount() }}</p>
        </div>
      </div>

      <div class="mt-10 overflow-hidden rounded-[2rem] border border-[#d8dde3] bg-white shadow-[0_16px_30px_rgba(15,23,42,0.04)]">
        @if (users().length) {
          <table class="w-full text-left">
            <thead class="border-b border-[#d8dde3] text-[#6b7280]">
              <tr>
                <th class="px-6 py-4">Name</th>
                <th class="px-6 py-4">Email</th>
                <th class="px-6 py-4">Phone</th>
                <th class="px-6 py-4">Role</th>
                <th class="px-6 py-4">Orders</th>
                <th class="px-6 py-4">Spent</th>
                <th class="px-6 py-4">City</th>
              </tr>
            </thead>
            <tbody>
              @for (user of users(); track user.id) {
                <tr class="border-b border-[#eef1f4] last:border-b-0">
                  <td class="px-6 py-4 text-[#111111]">{{ user.name }}</td>
                  <td class="px-6 py-4 text-[#4b5563]">{{ user.email }}</td>
                  <td class="px-6 py-4 text-[#4b5563]">{{ user.phone || 'N/A' }}</td>
                  <td class="px-6 py-4">
                    <span class="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]" [ngClass]="user.role === 'admin' ? 'bg-[#111111] text-white' : 'bg-[#eef1f4] text-[#111111]'">
                      {{ user.role }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-[#111111]">{{ orderCountForUser(user.id) }}</td>
                  <td class="px-6 py-4 text-[#111111]">Rs {{ totalSpentForUser(user.id) | number:'1.0-0' }}</td>
                  <td class="px-6 py-4 text-[#4b5563]">{{ user.city || latestCityForUser(user.id) || 'N/A' }}</td>
                </tr>
              }
            </tbody>
          </table>
        } @else {
          <div class="p-8 text-[#6b7280]">
            No customer records yet. Users will appear here after login or registration.
          </div>
        }
      </div>
    </section>
  `
})
export class AdminUsersPageComponent {
  private readonly authService = inject(AuthService);
  private readonly orderService = inject(OrderService);

  readonly users = computed(() => this.authService.getAllUsers());
  readonly activeBuyersCount = computed(() =>
    this.users().filter((user) => this.orderService.getOrdersForUser(user.id).length > 0).length
  );
  readonly adminCount = computed(() =>
    this.users().filter((user) => user.role === 'admin').length
  );

  orderCountForUser(userId: string): number {
    return this.orderService.getOrdersForUser(userId).length;
  }

  totalSpentForUser(userId: string): number {
    return this.orderService.getOrdersForUser(userId).reduce((sum, order) => sum + order.totalPrice, 0);
  }

  latestCityForUser(userId: string): string {
    return this.orderService.getOrdersForUser(userId)[0]?.city ?? '';
  }
}
