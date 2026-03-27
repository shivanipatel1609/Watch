import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { WatchService } from '../../services/watch.service';

@Component({
  selector: 'app-wishlist-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="relative overflow-hidden px-6 py-16 lg:py-20">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(159,34,65,0.06),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(15,61,46,0.05),transparent_26%),linear-gradient(180deg,#ffffff_0%,#ffffff_58%,#f7faf8_100%)]"></div>

      <div class="relative mx-auto max-w-7xl">
        <div class="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div class="rounded-[2.4rem] border border-[#E5E5E5] bg-white p-8 shadow-[0_24px_60px_rgba(17,17,17,0.05)] lg:p-10">
            <p class="text-sm font-semibold uppercase tracking-[0.42em] text-[#9F2241]">Saved Pieces</p>
            <h1 class="mt-5 font-display text-5xl leading-[0.95] text-[#111111] md:text-[5.1rem]">
              Your
              <br>
              Wishlist
            </h1>
            <p class="mt-6 max-w-2xl text-lg leading-8 text-[#111111]/66">
              Keep the references you want close, compare your next move, and send them to cart when you're ready.
            </p>

            <div class="mt-10 grid gap-4 sm:grid-cols-3">
              <div class="rounded-[1.8rem] border border-[#E6DDD2] bg-white px-6 py-5">
                <p class="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#9F2241]">Saved</p>
                <p class="mt-3 font-display text-4xl text-[#111111]">{{ wishlist().length }}</p>
              </div>
              <div class="rounded-[1.8rem] border border-[#E6DDD2] bg-white px-6 py-5">
                <p class="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#9F2241]">Brands</p>
                <p class="mt-3 font-display text-4xl text-[#111111]">{{ brandCount() }}</p>
              </div>
              <div class="rounded-[1.8rem] border border-[#E6DDD2] bg-white px-6 py-5">
                <p class="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#9F2241]">Total Value</p>
                <p class="mt-3 font-display text-4xl text-[#111111]">₹{{ totalValue() | number:'1.0-0' }}</p>
              </div>
            </div>
          </div>

          <div class="rounded-[2.4rem] border border-[#DCE7E2] bg-[#0F3D2E] p-8 text-white shadow-[0_24px_60px_rgba(15,61,46,0.18)] lg:p-10">
            <p class="text-sm font-semibold uppercase tracking-[0.42em] text-[#BFE2D6]">Collector Notes</p>
            <h2 class="mt-5 font-display text-4xl leading-tight text-[#F4F1EA]">Turn saved interest into your next acquisition.</h2>
            <p class="mt-6 text-lg leading-8 text-[#D6E6E0]">
              Every piece here is one step closer to checkout. Review pricing, revisit details, or move selected watches into the cart instantly.
            </p>

            <div class="mt-10 grid gap-4">
              <button
                type="button"
                (click)="moveAllToCart()"
                [disabled]="!wishlist().length"
                class="rounded-full bg-[#F4F1EA] px-6 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-[#0F3D2E] transition hover:bg-white disabled:cursor-not-allowed disabled:bg-[#F4F1EA]/40 disabled:text-white/55"
              >
                Move All To Cart
              </button>
              <a routerLink="/catalog" class="rounded-full border border-white/25 px-6 py-4 text-center text-sm font-semibold uppercase tracking-[0.24em] text-white transition hover:border-white hover:bg-white/8">
                Continue Browsing
              </a>
            </div>

            <div class="mt-10 rounded-[1.9rem] border border-white/10 bg-white/5 p-6">
              <p class="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#BFE2D6]">Tip</p>
              <p class="mt-3 text-base leading-7 text-[#E6F1EC]">
                Saved pieces stay tied to your signed-in Caliber profile, so you can return later and pick up where you left off.
              </p>
            </div>
          </div>
        </div>

        @if (wishlist().length) {
          <div class="mt-12 grid gap-8 xl:grid-cols-2">
            @for (watch of wishlist(); track watch.id) {
              <article class="overflow-hidden rounded-[2rem] border border-[#E5E5E5] bg-white shadow-[0_24px_55px_rgba(17,17,17,0.05)]">
                <div class="grid gap-0 md:grid-cols-[0.9fr_1.1fr]">
                  <a [routerLink]="['/watch', watch.id]" class="block bg-[#f7f6f3]">
                    <img [src]="watch.images[0]" [alt]="watch.name" class="h-full min-h-[300px] w-full object-cover">
                  </a>

                  <div class="flex h-full flex-col p-7">
                    <div class="flex items-start justify-between gap-4">
                      <div>
                        <p class="text-xs font-semibold uppercase tracking-[0.32em] text-[#9F2241]">{{ watch.brand }}</p>
                        <h2 class="mt-3 font-display text-4xl leading-tight text-[#111111]">{{ watch.name }}</h2>
                      </div>
                      <span class="rounded-full border border-[#E5E5E5] bg-[#FCFCFC] px-3 py-1 text-xs uppercase tracking-[0.18em] text-[#111111]/62">
                        {{ watch.category }}
                      </span>
                    </div>

                    <p class="mt-5 text-base leading-7 text-[#111111]/64">{{ watch.description }}</p>

                    <div class="mt-6 flex flex-wrap gap-3 text-sm uppercase tracking-[0.16em] text-[#111111]/56">
                      <span class="rounded-full border border-[#E5E5E5] bg-[#FAFAFA] px-4 py-2">Rating {{ watch.rating }}</span>
                      <span class="rounded-full border border-[#E5E5E5] bg-[#FAFAFA] px-4 py-2">{{ watch.stock }} in stock</span>
                    </div>

                    <div class="mt-auto pt-8">
                      <div class="flex items-end justify-between gap-4">
                        <p class="font-price text-[2.1rem] leading-none tracking-[0.02em] text-[#0F3D2E]">₹{{ watch.price | number:'1.0-0' }}</p>
                        <a [routerLink]="['/watch', watch.id]" class="text-sm font-semibold uppercase tracking-[0.2em] text-[#111111]/56 hover:text-[#0F3D2E]">
                          View Details
                        </a>
                      </div>

                      <div class="mt-6 flex flex-wrap gap-3">
                        <button type="button" (click)="addToCart(watch.id)" class="rounded-full bg-[#0F3D2E] px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#1F7A63]">
                          Add To Cart
                        </button>
                        <button type="button" (click)="removeFromWishlist(watch.id)" class="rounded-full border border-[#E5E5E5] px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#111111] transition hover:border-[#9F2241] hover:text-[#9F2241]">
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            }
          </div>
        } @else {
          <div class="mt-12 rounded-[2.4rem] border border-dashed border-[#D8D8D8] bg-white/90 p-12 text-center shadow-[0_18px_45px_rgba(17,17,17,0.04)]">
            <p class="text-sm font-semibold uppercase tracking-[0.42em] text-[#9F2241]">Nothing Saved Yet</p>
            <h2 class="mt-5 font-display text-4xl text-[#111111]">Build your shortlist</h2>
            <p class="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#111111]/62">
              Start exploring the collection and save the references you want to compare later.
            </p>
            <a routerLink="/catalog" class="mt-8 inline-flex rounded-full bg-[#0F3D2E] px-7 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-[#1F7A63]">
              Browse Watches
            </a>
          </div>
        }
      </div>
    </section>
  `
})
export class WishlistPageComponent {
  private readonly authService = inject(AuthService);
  private readonly watchService = inject(WatchService);
  private readonly cartService = inject(CartService);

  readonly wishlist = computed(() =>
    this.authService.getWishlist()
      .map((id) => this.watchService.getById(id))
      .filter((watch): watch is NonNullable<typeof watch> => !!watch)
  );

  readonly brandCount = computed(() => new Set(this.wishlist().map((watch) => watch.brand)).size);
  readonly totalValue = computed(() => this.wishlist().reduce((sum, watch) => sum + watch.price, 0));

  addToCart(watchId: string): void {
    const watch = this.watchService.getById(watchId);
    if (!watch) {
      return;
    }

    this.cartService.addToCart(watch);
  }

  moveAllToCart(): void {
    this.wishlist().forEach((watch) => {
      this.cartService.addToCart(watch);
    });
  }

  removeFromWishlist(watchId: string): void {
    void this.authService.toggleWishlist(watchId);
  }
}
