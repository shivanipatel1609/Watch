import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="relative overflow-hidden px-6 py-12 lg:py-16">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(15,61,46,0.08),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(31,122,99,0.06),transparent_22%),linear-gradient(180deg,#ffffff_0%,#fbfcfb_52%,#f4f8f6_100%)]"></div>
      <div class="relative mx-auto max-w-7xl">
        <div class="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p class="text-sm font-semibold uppercase tracking-[0.4em] text-[#1F7A63]">Shopping Cart</p>
            <h1 class="mt-3 font-display text-4xl text-[#111111] sm:text-5xl">Review your selected timepieces</h1>
            <p class="mt-4 max-w-2xl text-base leading-7 text-[#111111]/64">
              Your cart holds reserved pieces while you finalise delivery details. Adjust quantities, apply your private code, or continue browsing.
            </p>
          </div>
          <a routerLink="/catalog" class="inline-flex items-center rounded-full border border-[#E5E5E5] bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#111111] hover:border-[#0F3D2E] hover:text-[#0F3D2E]">
            Continue Shopping
          </a>
        </div>

        <div class="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div class="rounded-[2rem] border border-[#E5E5E5] bg-white p-8 shadow-[0_18px_45px_rgba(17,17,17,0.05)]">
            <div class="flex flex-wrap items-center justify-between gap-4 border-b border-[#F1F1F1] pb-6">
              <h2 class="font-display text-3xl text-[#111111]">Cart Items</h2>
              <p class="text-sm uppercase tracking-[0.28em] text-[#111111]/55">{{ cartService.items().length }} selected</p>
            </div>

            <div class="mt-8 space-y-6">
              @for (item of cartService.items(); track item.watch.id) {
                <div class="grid gap-4 rounded-[1.75rem] border border-[#E5E5E5] bg-[#FCFCFC] p-5 shadow-[0_16px_36px_rgba(17,17,17,0.05)] md:grid-cols-[140px_1fr_auto] md:items-center">
                  <img [src]="item.watch.images[0]" [alt]="item.watch.name" class="h-32 w-full rounded-[1rem] object-cover">
                  <div>
                    <p class="text-sm uppercase tracking-[0.3em] text-[#1F7A63]">{{ item.watch.brand }}</p>
                    <p class="mt-2 font-display text-2xl text-[#111111]">{{ item.watch.name }}</p>
                    <p class="mt-3 text-[#111111]/64">₹{{ item.watch.price | number:'1.0-0' }}</p>
                  </div>
                  <div class="space-y-3 md:text-right">
                    <label class="block text-[11px] font-semibold uppercase tracking-[0.24em] text-[#111111]/50">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      [ngModel]="item.quantity"
                      (ngModelChange)="cartService.updateQuantity(item.watch.id, +$event)"
                      class="w-24 rounded-full border border-[#E5E5E5] bg-white px-4 py-3 text-center text-[#111111]"
                    >
                    <button type="button" (click)="cartService.removeItem(item.watch.id)" class="block text-xs uppercase tracking-[0.2em] text-[#111111]/60 hover:text-[#0F3D2E] md:ml-auto">Remove</button>
                  </div>
                </div>
              }

              @if (!cartService.items().length) {
                <div class="rounded-[1.75rem] border border-dashed border-[#E5E5E5] bg-[#FCFCFC] p-10 text-center">
                  <p class="font-display text-3xl text-[#111111]">Your cart is empty</p>
                  <p class="mt-4 text-[#111111]/64">Browse the collection to add a timepiece.</p>
                  <a routerLink="/catalog" class="mt-6 inline-flex items-center rounded-full bg-[#0F3D2E] px-6 py-3 text-xs font-semibold uppercase tracking-[0.26em] text-white hover:bg-[#1F7A63]">
                    Browse Collection
                  </a>
                </div>
              }
            </div>
          </div>

          <aside class="rounded-[2rem] border border-[#E5E5E5] bg-white p-8 shadow-[0_18px_45px_rgba(17,17,17,0.05)]">
            <p class="text-sm font-semibold uppercase tracking-[0.32em] text-[#1F7A63]">Order Summary</p>
            <h2 class="mt-3 font-display text-3xl text-[#111111]">Concierge Checkout</h2>
            <p class="mt-4 text-sm leading-7 text-[#111111]/64">
              Every order includes insured shipping, secure payment processing, and premium presentation.
            </p>

            <label class="mt-8 block text-sm uppercase tracking-[0.3em] text-[#1F7A63]">Coupon</label>
            <div class="mt-3 flex gap-3">
              <input [(ngModel)]="coupon" type="text" placeholder="Private access code" class="flex-1 rounded-full border border-[#E5E5E5] bg-[#F9F9F9] px-5 py-3 text-[#111111]">
              <button type="button" (click)="cartService.applyCoupon(coupon)" class="rounded-full border border-[#0F3D2E] px-5 py-3 text-sm uppercase tracking-[0.2em] text-[#0F3D2E] hover:bg-[#0F3D2E] hover:text-white">Apply</button>
            </div>

            <div class="mt-8 rounded-[1.5rem] border border-[#E5E5E5] bg-[#F9F9F9] p-5">
              <div class="space-y-4 text-sm">
                <div class="flex justify-between text-[#111111]/64"><span>Subtotal</span><span>₹{{ cartService.subtotal() | number:'1.0-0' }}</span></div>
                <div class="flex justify-between text-[#111111]/64"><span>Discount</span><span>-₹{{ cartService.discount() | number:'1.0-0' }}</span></div>
                <div class="flex justify-between border-t border-[#E5E5E5] pt-4 text-lg font-semibold text-[#111111]"><span>Total</span><span>₹{{ cartService.total() | number:'1.0-0' }}</span></div>
              </div>
            </div>

            <div class="mt-8 rounded-[1.5rem] border border-[#B8D5CC] bg-[#0F3D2E] p-5 text-white">
              <p class="text-xs uppercase tracking-[0.3em] text-white/72">Delivery Promise</p>
              <p class="mt-3 text-sm leading-7 text-white/78">Insured transit, order tracking, and concierge assistance are included from dispatch to delivery.</p>
            </div>

            <a routerLink="/checkout" class="mt-8 inline-flex w-full justify-center rounded-full bg-[#0F3D2E] px-6 py-4 text-sm font-semibold uppercase tracking-[0.3em] text-white hover:bg-[#1F7A63]">
              Secure Checkout
            </a>
          </aside>
        </div>
      </div>
    </section>
  `
})
export class CartPageComponent {
  readonly cartService = inject(CartService);
  coupon = '';
}
