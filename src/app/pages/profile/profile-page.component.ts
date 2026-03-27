import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Order } from '../../models/order.model';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { ReceiptService } from '../../services/receipt.service';
import { WatchService } from '../../services/watch.service';

type ProfileTab = 'profile' | 'orders' | 'wishlist' | 'settings';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="relative overflow-hidden px-6 py-16 lg:py-20">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(200,164,107,0.12),transparent_28%),linear-gradient(180deg,#f8f3ec_0%,#f5f1eb_55%,#efe7dd_100%)]"></div>
      <div class="relative mx-auto max-w-7xl">
        <section class="rounded-[2.25rem] border border-[#ddd1c3] bg-[#2f3a4a] p-8 shadow-[0_26px_60px_rgba(31,31,31,0.12)] lg:p-10">
          <div class="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div class="flex flex-wrap items-center gap-5">
              <div class="flex h-20 w-20 items-center justify-center rounded-full bg-[#f5f1eb]/12 font-brand text-3xl tracking-[0.08em] text-[#f5f1eb]">
                {{ initials() }}
              </div>
              <div>
                <p class="text-sm font-semibold uppercase tracking-[0.38em] text-[#c8a46b]">Caliber Member</p>
                <h1 class="mt-3 font-display text-5xl text-[#f5f1eb]">{{ userName() }}</h1>
                <div class="mt-4 inline-flex flex-wrap items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-[#d7dde5]">
                  <span class="font-semibold uppercase tracking-[0.18em] text-[#c8a46b]">Email</span>
                  <span>{{ userEmail() }}</span>
                </div>
              </div>
            </div>

            <div class="flex flex-wrap gap-3">
              <a routerLink="/watches" class="rounded-full bg-[#f5f1eb] px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-[#2f3a4a]">
                Browse Watches
              </a>
              <a routerLink="/cart" class="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-[#f5f1eb]">
                Go to Cart
              </a>
            </div>
          </div>

          <div class="mt-8 grid gap-4 md:grid-cols-3">
            <div class="rounded-[1.5rem] bg-white/8 p-5">
              <p class="text-xs font-semibold uppercase tracking-[0.24em] text-[#c8a46b]">Orders</p>
              <p class="mt-3 text-4xl text-[#f5f1eb]">{{ userOrders().length }}</p>
            </div>
            <div class="rounded-[1.5rem] bg-white/8 p-5">
              <p class="text-xs font-semibold uppercase tracking-[0.24em] text-[#c8a46b]">Wishlist</p>
              <p class="mt-3 text-4xl text-[#f5f1eb]">{{ wishlistItems().length }}</p>
            </div>
            <div class="rounded-[1.5rem] bg-white/8 p-5">
              <p class="text-xs font-semibold uppercase tracking-[0.24em] text-[#c8a46b]">Total Spent</p>
              <p class="mt-3 text-4xl text-[#f5f1eb]">₹{{ totalSpent() | number:'1.0-0' }}</p>
            </div>
          </div>
        </section>

        <div class="mt-10 grid gap-8 xl:grid-cols-[0.34fr_0.66fr]">
          <aside class="rounded-[2rem] border border-[#ddd1c3] bg-[#f8f4ee] p-8 shadow-[0_18px_40px_rgba(31,31,31,0.05)]">
            <div>
              <p class="text-sm font-semibold uppercase tracking-[0.34em] text-[#c8a46b]">Account</p>
              <p class="mt-4 text-lg leading-8 text-[#6e7681]">Manage your profile, orders, wishlist, and preferences.</p>
            </div>

            <div class="mt-8 space-y-3">
              @for (tab of tabs; track tab.id) {
                <button
                  type="button"
                  (click)="activeTab.set(tab.id)"
                  class="flex w-full items-center gap-4 rounded-[1.15rem] border px-4 py-4 text-left transition"
                  [ngClass]="activeTab() === tab.id ? 'border-[#c8a46b] bg-[#efe6db] shadow-[0_12px_24px_rgba(31,31,31,0.05)]' : 'border-[#ddd1c3] bg-[#fffaf4]'"
                >
                  <span class="flex h-10 w-10 items-center justify-center rounded-full bg-[#2f3a4a] text-sm text-[#f5f1eb]">{{ tab.icon }}</span>
                  <span class="flex-1 text-lg text-[#2f3a4a]">{{ tab.label }}</span>
                  @if (tab.meta) {
                    <span class="rounded-full bg-[#f5f1eb] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#6e7681]">{{ tab.meta }}</span>
                  }
                </button>
              }
            </div>
          </aside>

          <section class="rounded-[2rem] border border-[#ddd1c3] bg-[#f8f4ee] p-8 shadow-[0_18px_40px_rgba(31,31,31,0.05)]">
            @switch (activeTab()) {
              @case ('profile') {
                <div>
                  <h2 class="font-display text-4xl text-[#2f3a4a]">Account Overview</h2>
                  <p class="mt-3 text-lg leading-8 text-[#6e7681]">Keep your details up to date and track orders with confidence.</p>

                  <div class="mt-8 grid gap-4">
                    <div class="flex items-center justify-between gap-4 border-b border-[#ddd1c3] pb-4"><span class="text-[#6e7681]">Name</span><span class="text-right text-[#2f3a4a]">{{ userName() }}</span></div>
                    <div class="flex items-center justify-between gap-4 border-b border-[#ddd1c3] pb-4"><span class="text-[#6e7681]">Email</span><span class="text-right text-[#2f3a4a]">{{ userEmail() }}</span></div>
                    <div class="flex items-center justify-between gap-4 border-b border-[#ddd1c3] pb-4"><span class="text-[#6e7681]">Phone</span><span class="text-right text-[#2f3a4a]">{{ userPhone() }}</span></div>
                    <div class="flex items-center justify-between gap-4 border-b border-[#ddd1c3] pb-4"><span class="text-[#6e7681]">Address</span><span class="text-right text-[#2f3a4a]">{{ userAddress() }}</span></div>
                    <div class="flex items-center justify-between gap-4 border-b border-[#ddd1c3] pb-4"><span class="text-[#6e7681]">City</span><span class="text-right text-[#2f3a4a]">{{ userCity() }}</span></div>
                    <div class="flex items-center justify-between gap-4 border-b border-[#ddd1c3] pb-4"><span class="text-[#6e7681]">Member Since</span><span class="text-right text-[#2f3a4a]">{{ memberSince() }}</span></div>
                    <div class="flex items-center justify-between gap-4"><span class="text-[#6e7681]">Support</span><span class="text-right text-[#2f3a4a]">Included with every order</span></div>
                  </div>

                  <div class="mt-8 flex flex-wrap gap-3">
                    <a routerLink="/watches" class="rounded-full bg-[#2f3a4a] px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-[#f5f1eb]">Browse Watches</a>
                    <a routerLink="/cart" class="rounded-full border border-[#d8cdc0] px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-[#2f3a4a]">Go to Cart</a>
                    <a routerLink="/orders" class="rounded-full border border-[#d8cdc0] px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-[#2f3a4a]">View All Orders</a>
                  </div>
                </div>
              }
              @case ('orders') {
                <div>
                  <h2 class="font-display text-4xl text-[#2f3a4a]">Orders</h2>
                  <p class="mt-3 text-lg leading-8 text-[#6e7681]">Track your recent purchases. Showing your latest 3 orders here.</p>

                  @if (!userOrders().length) {
                    <div class="mt-8 rounded-[1.5rem] border border-dashed border-[#d8cdc0] bg-[#fffaf4] p-8 text-center">
                      <p class="text-lg text-[#6e7681]">No orders yet.</p>
                      <a routerLink="/watches" class="mt-5 inline-flex rounded-full bg-[#2f3a4a] px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-[#f5f1eb]">Browse Watches</a>
                    </div>
                  } @else {
                    <div class="mt-8 overflow-x-auto">
                      <table class="min-w-full border-separate border-spacing-y-3">
                        <thead>
                          <tr class="text-left text-xs font-semibold uppercase tracking-[0.24em] text-[#6e7681]">
                            <th class="pb-2 pr-4">ID</th>
                            <th class="pb-2 pr-4">Watch</th>
                            <th class="pb-2 pr-4">Total</th>
                            <th class="pb-2 pr-4">Status</th>
                            <th class="pb-2 pr-4">Receipt</th>
                          </tr>
                        </thead>
                        <tbody>
                          @for (order of recentOrders(); track order.id) {
                            <tr class="rounded-[1.25rem] bg-[#fffaf4]">
                              <td class="rounded-l-[1.25rem] px-4 py-4 text-[#2f3a4a]">{{ shortOrderId(order.id) }}</td>
                              <td class="px-4 py-4 text-[#2f3a4a]">{{ order.products[0].name }}</td>
                              <td class="px-4 py-4 text-[#2f3a4a]">₹{{ order.totalPrice | number:'1.0-0' }}</td>
                              <td class="rounded-r-[1.25rem] px-4 py-4">
                                <span class="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]" [ngClass]="statusClasses(order.orderStatus)">
                                  {{ order.orderStatus }}
                                </span>
                              </td>
                              <td class="px-4 py-4">
                                <div class="flex flex-wrap gap-2">
                                  @if (canAccessReceipt(order)) {
                                    <button type="button" (click)="openReceipt(order)" class="rounded-full border border-[#d8cdc0] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#2f3a4a]">
                                      Show Receipt
                                    </button>
                                    <button type="button" (click)="downloadReceipt(order)" class="rounded-full bg-[#2f3a4a] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#f5f1eb]">
                                      Download
                                    </button>
                                  } @else {
                                    <span class="rounded-full border border-[#d8cdc0] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#6e7681]">
                                      Receipt after delivery
                                    </span>
                                  }
                                </div>
                              </td>
                            </tr>
                          }
                        </tbody>
                      </table>
                    </div>
                    @if (userOrders().length > 3) {
                      <div class="mt-6">
                        <a routerLink="/orders" class="inline-flex rounded-full bg-[#2f3a4a] px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-[#f5f1eb]">
                          Show All Orders
                        </a>
                      </div>
                    }
                  }
                </div>
              }
              @case ('wishlist') {
                <div>
                  <h2 class="font-display text-4xl text-[#2f3a4a]">Wishlist</h2>
                  <p class="mt-3 text-lg leading-8 text-[#6e7681]">Keep track of watches you love, ready when you are.</p>

                  @if (!wishlistItems().length) {
                    <div class="mt-8 rounded-[1.5rem] border border-dashed border-[#d8cdc0] bg-[#fffaf4] p-8 text-center">
                      <p class="text-lg text-[#6e7681]">Your wishlist is empty.</p>
                      <a routerLink="/watches" class="mt-5 inline-flex rounded-full bg-[#2f3a4a] px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-[#f5f1eb]">Browse Watches</a>
                    </div>
                  } @else {
                    <div class="mt-8 grid gap-4 md:grid-cols-2">
                      @for (watch of wishlistItems(); track watch.id) {
                        <article class="rounded-[1.5rem] border border-[#ddd1c3] bg-[#fffaf4] p-5">
                          <p class="text-xs font-semibold uppercase tracking-[0.24em] text-[#c8a46b]">{{ watch.brand }}</p>
                          <h3 class="mt-3 font-display text-3xl text-[#2f3a4a]">{{ watch.name }}</h3>
                          <p class="mt-3 text-lg text-[#6e7681]">₹{{ watch.price | number:'1.0-0' }}</p>
                          <div class="mt-5 flex gap-3">
                            <a [routerLink]="['/watch', watch.id]" class="flex-1 rounded-full border border-[#d8cdc0] px-5 py-3 text-center text-sm font-semibold uppercase tracking-[0.18em] text-[#2f3a4a]">View</a>
                            <button type="button" (click)="removeWishlist(watch.id)" class="flex-1 rounded-full border border-[#d8cdc0] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#2f3a4a]">Remove</button>
                          </div>
                        </article>
                      }
                    </div>
                  }
                </div>
              }
              @default {
                <div>
                  <h2 class="font-display text-4xl text-[#2f3a4a]">Settings</h2>
                  <p class="mt-3 text-lg leading-8 text-[#6e7681]">Personalize your Caliber experience.</p>

                  <div class="mt-8 grid gap-6">
                    <div>
                      <label class="mb-3 block text-sm font-semibold uppercase tracking-[0.22em] text-[#6e7681]">Display Name</label>
                      <input
                        [(ngModel)]="settings.name"
                        type="text"
                        class="w-full rounded-[1rem] border border-[#d8cdc0] bg-[#fffaf4] px-5 py-4 text-[#2f3a4a] outline-none"
                        placeholder="Your name"
                      >
                      <p class="mt-2 text-sm text-[#6e7681]">This updates your name in the current session.</p>
                    </div>

                    <div>
                      <label class="mb-3 block text-sm font-semibold uppercase tracking-[0.22em] text-[#6e7681]">Phone</label>
                      <input
                        [(ngModel)]="settings.phone"
                        type="text"
                        class="w-full rounded-[1rem] border border-[#d8cdc0] bg-[#fffaf4] px-5 py-4 text-[#2f3a4a] outline-none"
                        placeholder="+91 9876543210"
                      >
                    </div>

                    <div>
                      <label class="mb-3 block text-sm font-semibold uppercase tracking-[0.22em] text-[#6e7681]">Address</label>
                      <textarea
                        [(ngModel)]="settings.address"
                        rows="4"
                        class="w-full rounded-[1rem] border border-[#d8cdc0] bg-[#fffaf4] px-5 py-4 text-[#2f3a4a] outline-none"
                        placeholder="Street address, area, landmark"
                      ></textarea>
                    </div>

                    <div>
                      <label class="mb-3 block text-sm font-semibold uppercase tracking-[0.22em] text-[#6e7681]">City</label>
                      <input
                        [(ngModel)]="settings.city"
                        type="text"
                        class="w-full rounded-[1rem] border border-[#d8cdc0] bg-[#fffaf4] px-5 py-4 text-[#2f3a4a] outline-none"
                        placeholder="Your city"
                      >
                    </div>

                    <label class="flex items-center justify-between rounded-[1rem] border border-[#d8cdc0] bg-[#fffaf4] p-4">
                      <span class="text-[#2f3a4a]">Order notifications</span>
                      <input [(ngModel)]="settings.notifications" type="checkbox" class="h-4 w-4 accent-[#2f3a4a]">
                    </label>

                    <label class="flex items-center justify-between rounded-[1rem] border border-[#d8cdc0] bg-[#fffaf4] p-4">
                      <span class="text-[#2f3a4a]">Newsletter</span>
                      <input [(ngModel)]="settings.newsletter" type="checkbox" class="h-4 w-4 accent-[#2f3a4a]">
                    </label>

                    <div class="flex flex-wrap items-center gap-4">
                      <button type="button" (click)="saveSettings()" class="rounded-full bg-[#2f3a4a] px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-[#f5f1eb]">
                        Save Settings
                      </button>
                      @if (saveMessage()) {
                        <span class="text-sm text-[#6e7681]">{{ saveMessage() }}</span>
                      }
                    </div>
                  </div>
                </div>
              }
            }
          </section>
        </div>
      </div>

      @if (selectedReceiptOrder(); as receiptOrder) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-[#1f1f1f]/35 p-6 backdrop-blur-sm">
          <div class="w-full max-w-2xl rounded-[2rem] border border-[#ddd1c3] bg-[#f8f4ee] p-8 shadow-[0_26px_60px_rgba(31,31,31,0.16)]">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="text-sm font-semibold uppercase tracking-[0.32em] text-[#c8a46b]">Receipt</p>
                <h3 class="mt-3 text-[3rem] font-semibold leading-none tracking-[-0.05em] text-[#2f3a4a]">{{ receiptOrder.id }}</h3>
              </div>
              <button type="button" (click)="closeReceipt()" class="rounded-full border border-[#d8cdc0] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#2f3a4a]">
                Close
              </button>
            </div>

            <div class="mt-8 rounded-[1.5rem] border border-[#ddd1c3] bg-[#fffaf4] p-6">
              <div class="grid gap-3 text-sm text-[#6e7681] md:grid-cols-2">
                <div><span class="font-semibold text-[#2f3a4a]">Customer:</span> {{ userName() }}</div>
                <div><span class="font-semibold text-[#2f3a4a]">Email:</span> {{ userEmail() }}</div>
                <div><span class="font-semibold text-[#2f3a4a]">City:</span> {{ receiptOrder.city }}</div>
                <div><span class="font-semibold text-[#2f3a4a]">Payment:</span> {{ receiptOrder.paymentMethod }}</div>
                <div><span class="font-semibold text-[#2f3a4a]">Status:</span> {{ receiptOrder.orderStatus }}</div>
                <div><span class="font-semibold text-[#2f3a4a]">Placed:</span> {{ receiptOrder.createdAt || memberSince() }}</div>
              </div>

              <div class="mt-6 border-t border-[#e7ded2] pt-6">
                @for (product of receiptOrder.products; track product.watchId) {
                  <div class="flex items-center justify-between gap-4 border-b border-[#f0e8de] py-3 text-[#2f3a4a] last:border-b-0">
                    <span>{{ product.name }} x {{ product.quantity }}</span>
                    <span>&#8377;{{ product.price * product.quantity | number:'1.0-0' }}</span>
                  </div>
                }
              </div>

              <div class="mt-6 flex items-center justify-between border-t border-[#ddd1c3] pt-5 text-lg">
                <span class="font-semibold text-[#2f3a4a]">Total</span>
                <span class="font-semibold text-[#2f3a4a]">&#8377;{{ receiptOrder.totalPrice | number:'1.0-0' }}</span>
              </div>
            </div>

            <div class="mt-6 flex flex-wrap gap-3">
              <button type="button" (click)="downloadReceipt(receiptOrder)" class="rounded-full bg-[#2f3a4a] px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-[#f5f1eb]">
                Download Receipt
              </button>
              <button type="button" (click)="closeReceipt()" class="rounded-full border border-[#d8cdc0] px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-[#2f3a4a]">
                Close
              </button>
            </div>
          </div>
        </div>
      }
    </section>
  `
})
export class ProfilePageComponent {
  private readonly authService = inject(AuthService);
  private readonly orderService = inject(OrderService);
  private readonly receiptService = inject(ReceiptService);
  private readonly watchService = inject(WatchService);

  readonly activeTab = signal<ProfileTab>('profile');
  readonly saveMessage = signal('');
  readonly selectedReceiptOrder = signal<Order | null>(null);
  readonly settings = {
    name: this.authService.user()?.name ?? '',
    phone: this.authService.user()?.phone ?? '',
    address: this.authService.user()?.address ?? '',
    city: this.authService.user()?.city ?? '',
    notifications: true,
    newsletter: false
  };

  readonly userName = computed(() => this.authService.user()?.name ?? 'Member');
  readonly userEmail = computed(() => this.authService.user()?.email ?? 'unknown@caliber.store');
  readonly userPhone = computed(() => this.authService.user()?.phone ?? 'N/A');
  readonly userAddress = computed(() => this.authService.user()?.address?.trim() || 'Not added');
  readonly userCity = computed(() => this.authService.user()?.city?.trim() || 'Not added');
  readonly userOrders = computed(() => this.orderService.getOrdersForUser(this.authService.user()?.id));
  readonly recentOrders = computed(() => this.userOrders().slice(0, 3));
  readonly wishlistItems = computed(() =>
    this.authService.getWishlist()
      .map((id) => this.watchService.getById(id))
      .filter((watch) => !!watch)
  );
  readonly totalSpent = computed(() =>
    this.userOrders().reduce((sum, order) => sum + order.totalPrice, 0)
  );
  readonly memberSince = computed(() => {
    const user = this.authService.user();
    if (!user?.createdAt) {
      return '—';
    }

    return new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  });
  readonly initials = computed(() => {
    const label = this.userName() || this.userEmail();
    const parts = label.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return label.slice(0, 2).toUpperCase();
  });

  get tabs() {
    return [
      { id: 'profile' as const, label: 'Profile', icon: 'P', meta: '' },
      { id: 'orders' as const, label: 'Orders', icon: 'O', meta: String(this.userOrders().length) },
      { id: 'wishlist' as const, label: 'Wishlist', icon: 'W', meta: String(this.wishlistItems().length) },
      { id: 'settings' as const, label: 'Settings', icon: 'S', meta: '' }
    ];
  }

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

  removeWishlist(watchId: string): void {
    void this.authService.toggleWishlist(watchId);
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
      name: this.userName(),
      email: this.userEmail(),
      phone: this.userPhone()
    });
  }

  canAccessReceipt(order: Order): boolean {
    return order.paymentMethod !== 'Cash on Delivery' || order.orderStatus === 'Delivered';
  }

  async saveSettings(): Promise<void> {
    const trimmedName = this.settings.name.trim();
    const trimmedPhone = this.settings.phone.trim();
    const trimmedAddress = this.settings.address.trim();
    const trimmedCity = this.settings.city.trim();

    await this.authService.updateProfile({
      name: trimmedName || this.userName(),
      phone: trimmedPhone,
      address: trimmedAddress,
      city: trimmedCity
    });

    this.settings.name = trimmedName || this.userName();
    this.settings.phone = trimmedPhone;
    this.settings.address = trimmedAddress;
    this.settings.city = trimmedCity;

    this.saveMessage.set('Settings saved.');
    setTimeout(() => this.saveMessage.set(''), 2500);
  }
}
