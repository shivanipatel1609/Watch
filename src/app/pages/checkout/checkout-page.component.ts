import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Order } from '../../models/order.model';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';

type PaymentMethod = 'Razorpay' | 'Stripe' | 'Cash on Delivery';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="relative overflow-hidden bg-[radial-gradient(circle_at_top,#eef7f3_0%,transparent_34%),linear-gradient(180deg,#ffffff_0%,#f9f9f9_100%)]">
      <div class="mx-auto max-w-7xl px-6 py-12 lg:py-16">
        <div class="mb-10">
          <p class="text-sm font-semibold uppercase tracking-[0.45em] text-[#1F7A63]">Checkout</p>
          <h1 class="mt-4 font-display text-5xl text-[#111111]">Private client delivery</h1>
          <p class="mt-4 max-w-3xl leading-8 text-[#4b5563]">
            Confirm your delivery details and payment method. Every order includes insured handling and concierge support.
          </p>
        </div>

        @if (!cartService.items().length && !orderPlaced) {
          <div class="rounded-[2rem] border border-dashed border-[#D7E5E0] bg-white p-12 text-center shadow-[0_24px_60px_rgba(15,61,46,0.08)]">
            <h2 class="font-display text-3xl text-[#111111]">Your cart is empty</h2>
            <p class="mt-4 text-[#4b5563]">Add a watch before proceeding to checkout.</p>
            <a routerLink="/watches" class="mt-6 inline-flex rounded-full bg-[#0F3D2E] px-6 py-4 text-sm font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-[#1F7A63]">
              Browse Watches
            </a>
          </div>
        } @else if (orderPlaced) {
          <div class="rounded-[2rem] border border-[#D7E5E0] bg-white p-10 text-center shadow-[0_24px_60px_rgba(15,61,46,0.08)]">
            <p class="text-sm uppercase tracking-[0.35em] text-[#1F7A63]">Order Confirmed</p>
            <h2 class="mt-4 font-display text-4xl text-[#111111]">Thank you, {{ form.name }}</h2>
            <p class="mx-auto mt-5 max-w-2xl leading-8 text-[#4b5563]">
              Your order has been placed successfully. A confirmation for {{ selectedPaymentMethod }} will follow shortly.
            </p>
            <a routerLink="/dashboard" class="mt-8 inline-flex rounded-full bg-[#0F3D2E] px-6 py-4 text-sm font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-[#1F7A63]">
              View Dashboard
            </a>
          </div>
        } @else {
          <div class="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <form class="rounded-[2rem] border border-[#E5E5E5] bg-white p-8 shadow-[0_24px_60px_rgba(15,61,46,0.08)]" (ngSubmit)="placeOrder()">
              <div class="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-[#EAEAEA] pb-6">
                <div>
                  <p class="text-xs font-semibold uppercase tracking-[0.28em] text-[#1F7A63]">Delivery Profile</p>
                  <h2 class="mt-3 font-display text-3xl text-[#111111]">Billing and shipment details</h2>
                </div>
                <p class="max-w-xs text-sm leading-6 text-[#4b5563]">We use these details for dispatch verification, delivery scheduling, and post-purchase assistance.</p>
              </div>

              <div class="grid gap-6 md:grid-cols-2">
                <div>
                  <label class="mb-2 block text-xs uppercase tracking-[0.28em] text-[#1F7A63]">Name</label>
                  <input [(ngModel)]="form.name" name="name" placeholder="Full name" class="w-full rounded-[1rem] border border-[#E5E5E5] bg-[#F9F9F9] px-5 py-4 text-[#111111] outline-none transition focus:border-[#0F3D2E] focus:bg-white">
                </div>
                <div>
                  <label class="mb-2 block text-xs uppercase tracking-[0.28em] text-[#1F7A63]">Phone</label>
                  <input [(ngModel)]="form.phone" name="phone" placeholder="+91 9876543210" class="w-full rounded-[1rem] border border-[#E5E5E5] bg-[#F9F9F9] px-5 py-4 text-[#111111] outline-none transition focus:border-[#0F3D2E] focus:bg-white">
                </div>
                <div class="md:col-span-2">
                  <label class="mb-2 block text-xs uppercase tracking-[0.28em] text-[#1F7A63]">Address</label>
                  <textarea [(ngModel)]="form.address" name="address" placeholder="Street address, area, landmark" rows="4" class="w-full rounded-[1rem] border border-[#E5E5E5] bg-[#F9F9F9] px-5 py-4 text-[#111111] outline-none transition focus:border-[#0F3D2E] focus:bg-white"></textarea>
                </div>
                <div>
                  <label class="mb-2 block text-xs uppercase tracking-[0.28em] text-[#1F7A63]">City</label>
                  <input [(ngModel)]="form.city" name="city" placeholder="City" class="w-full rounded-[1rem] border border-[#E5E5E5] bg-[#F9F9F9] px-5 py-4 text-[#111111] outline-none transition focus:border-[#0F3D2E] focus:bg-white">
                </div>
                <div>
                  <label class="mb-2 block text-xs uppercase tracking-[0.28em] text-[#1F7A63]">Payment Method</label>
                  <select [(ngModel)]="selectedPaymentMethod" name="paymentMethod" class="w-full rounded-[1rem] border border-[#E5E5E5] bg-[#F9F9F9] px-5 py-4 text-[#111111] outline-none transition focus:border-[#0F3D2E] focus:bg-white">
                    <option value="Razorpay">Razorpay</option>
                    <option value="Stripe">Stripe</option>
                    <option value="Cash on Delivery">Cash on Delivery</option>
                  </select>
                </div>
              </div>

              <div class="mt-8 grid gap-4 md:grid-cols-3">
                @for (payment of paymentOptions; track payment.title) {
                  <button
                    type="button"
                    (click)="selectedPaymentMethod = payment.title"
                    class="rounded-[1.4rem] border p-5 text-left transition"
                    [ngClass]="selectedPaymentMethod === payment.title ? 'border-[#0F3D2E] bg-[#F4FBF8] shadow-[0_16px_35px_rgba(15,61,46,0.08)]' : 'border-[#E5E5E5] bg-[#F9F9F9]'"
                  >
                    <p class="text-sm uppercase tracking-[0.25em] text-[#1F7A63]">{{ payment.title }}</p>
                    <p class="mt-3 text-sm leading-6 text-[#4b5563]">{{ payment.description }}</p>
                  </button>
                }
              </div>

              @if (errorMessage) {
                <p class="mt-6 rounded-[1rem] border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-700">
                  {{ errorMessage }}
                </p>
              }

              <div class="mt-8 flex flex-wrap gap-4">
                <button type="submit" class="rounded-full bg-[#0F3D2E] px-7 py-4 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-[#1F7A63]">
                  Place Order
                </button>
                <a routerLink="/cart" class="rounded-full border border-[#E5E5E5] px-7 py-4 text-sm uppercase tracking-[0.3em] text-[#111111] transition hover:border-[#0F3D2E] hover:text-[#0F3D2E]">
                  Back to Cart
                </a>
              </div>
            </form>

            <aside class="rounded-[2rem] border border-[#E5E5E5] bg-white p-8 shadow-[0_24px_60px_rgba(15,61,46,0.08)]">
              <p class="text-xs font-semibold uppercase tracking-[0.28em] text-[#1F7A63]">Order Summary</p>
              <h2 class="mt-3 font-display text-3xl text-[#111111]">Your reserved pieces</h2>

              <div class="mt-8 space-y-5">
                @for (item of cartService.items(); track item.watch.id) {
                  <div class="flex items-center gap-4 border-b border-[#EAEAEA] pb-5">
                    <img [src]="item.watch.images[0]" [alt]="item.watch.name" class="h-20 w-20 rounded-[1rem] object-cover">
                    <div class="min-w-0 flex-1">
                      <p class="truncate text-[#111111]">{{ item.watch.name }}</p>
                      <p class="mt-1 text-sm text-[#4b5563]">{{ item.watch.brand }} · Qty {{ item.quantity }}</p>
                    </div>
                    <p class="text-[#111111]">₹{{ item.watch.price * item.quantity | number:'1.0-0' }}</p>
                  </div>
                }
              </div>

              <div class="mt-8 rounded-[1.5rem] border border-[#E5E5E5] bg-[#F9F9F9] p-5">
                <div class="space-y-4 text-sm">
                  <div class="flex justify-between text-[#4b5563]"><span>Subtotal</span><span>₹{{ cartService.subtotal() | number:'1.0-0' }}</span></div>
                  <div class="flex justify-between text-[#4b5563]"><span>Discount</span><span>-₹{{ cartService.discount() | number:'1.0-0' }}</span></div>
                  <div class="flex justify-between text-[#4b5563]"><span>Shipping</span><span>Included</span></div>
                  <div class="flex justify-between border-t border-[#E5E5E5] pt-4 text-lg font-semibold text-[#111111]"><span>Total</span><span class="text-[#0F3D2E]">₹{{ cartService.total() | number:'1.0-0' }}</span></div>
                </div>
              </div>

              <div class="mt-8 rounded-[1.5rem] border border-[#0F3D2E] bg-[#0F3D2E] p-5 text-white">
                <p class="text-xs uppercase tracking-[0.28em] text-[#BEE3D7]">Delivery</p>
                <p class="mt-3 text-white/80">Insured shipping, premium packaging, and order tracking are included with every Caliber purchase.</p>
              </div>
            </aside>
          </div>
        }
      </div>
    </section>
  `
})
export class CheckoutPageComponent {
  readonly cartService = inject(CartService);
  private readonly authService = inject(AuthService);
  private readonly orderService = inject(OrderService);
  private readonly router = inject(Router);

  errorMessage = '';
  orderPlaced = false;
  selectedPaymentMethod: PaymentMethod = 'Razorpay';

  form = {
    name: this.authService.user()?.name ?? '',
    phone: this.authService.user()?.phone ?? '',
    address: this.authService.user()?.address ?? '',
    city: this.authService.user()?.city ?? ''
  };

  readonly paymentOptions = [
    { title: 'Razorpay' as PaymentMethod, description: 'Fast checkout for Indian cards, UPI, net banking, and wallets.' },
    { title: 'Stripe' as PaymentMethod, description: 'Global card payments with secure international processing.' },
    { title: 'Cash on Delivery' as PaymentMethod, description: 'Available for selected locations with verification before dispatch.' }
  ];

  async placeOrder(): Promise<void> {
    if (!this.isFormValid()) {
      this.errorMessage = 'Complete all checkout fields before placing the order.';
      return;
    }

    try {
      this.errorMessage = '';
      const createdAt = new Date().toISOString();
      const order: Order = {
        id: this.generateOrderId(createdAt),
        userId: this.authService.user()?.id ?? 'guest',
        products: this.cartService.items().map((item) => ({
          watchId: item.watch.id,
          name: item.watch.name,
          quantity: item.quantity,
          price: item.watch.price
        })),
        totalPrice: this.cartService.total(),
        address: this.form.address,
        city: this.form.city,
        paymentMethod: this.selectedPaymentMethod,
        orderStatus: 'Processing',
        createdAt
      };

      await this.authService.updateProfile({
        name: this.form.name.trim(),
        phone: this.form.phone.trim(),
        address: this.form.address.trim(),
        city: this.form.city.trim()
      });

      await this.orderService.createOrder(order);
      this.orderPlaced = true;
      this.cartService.clearCart();
      void this.router.navigate([], { replaceUrl: true });
    } catch (error) {
      this.errorMessage = error instanceof Error
        ? error.message
        : 'Unable to place your order right now. Please try again.';
    }
  }

  private isFormValid(): boolean {
    return !!this.form.name.trim() &&
      !!this.form.phone.trim() &&
      !!this.form.address.trim() &&
      !!this.form.city.trim() &&
      this.cartService.items().length > 0;
  }

  private generateOrderId(createdAt: string): string {
    const timestamp = new Date(createdAt).getTime().toString().slice(-6);
    const randomSuffix = Math.floor(Math.random() * 900 + 100);
    return `CW-${timestamp}-${randomSuffix}`;
  }
}
