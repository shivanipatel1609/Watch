import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { WatchCardComponent } from '../../components/shared/watch-card.component';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { RecommendationService } from '../../services/recommendation.service';
import { WatchService } from '../../services/watch.service';

@Component({
  selector: 'app-product-details-page',
  standalone: true,
  imports: [CommonModule, RouterLink, WatchCardComponent],
  template: `
    @if (watch(); as selectedWatch) {
      <section class="relative overflow-hidden px-6 py-16">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(15,61,46,0.08),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(31,122,99,0.06),transparent_22%),linear-gradient(180deg,#ffffff_0%,#fbfcfb_52%,#f4f8f6_100%)]"></div>

        <div class="relative mx-auto max-w-7xl">
          <div class="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div class="space-y-6">
              <div class="overflow-hidden rounded-[2rem] border border-[#E5E5E5] bg-white p-4 shadow-[0_18px_40px_rgba(17,17,17,0.05)]">
                <img [src]="selectedImage()" [alt]="selectedWatch.name" class="h-[520px] w-full rounded-[1.5rem] object-cover">
              </div>
              <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                @for (image of selectedWatch.images; track image) {
                  <button
                    type="button"
                    (click)="selectedImage.set(image)"
                    class="overflow-hidden rounded-[1.5rem] border p-2 transition"
                    [ngClass]="selectedImage() === image ? 'border-[#0F3D2E] bg-[#EEF7F4]' : 'border-[#E5E5E5] bg-white'">
                    <img [src]="image" [alt]="selectedWatch.name" class="h-40 w-full rounded-[1rem] object-cover transition hover:scale-[1.02]">
                  </button>
                }
              </div>
            </div>

            <div>
              <p class="text-sm uppercase tracking-[0.45em] text-[#1F7A63]">{{ selectedWatch.brand }}</p>
              <h1 class="mt-4 font-display text-5xl text-[#111111]">{{ selectedWatch.name }}</h1>
              <p class="mt-6 max-w-2xl text-lg leading-8 text-[#111111]/66">{{ selectedWatch.description }}</p>

              <div class="mt-8 flex flex-wrap items-center gap-4 text-sm uppercase tracking-[0.25em] text-[#111111]/58">
                <span class="rounded-full border border-[#E5E5E5] bg-white px-4 py-2">{{ selectedWatch.rating }} ★ Rated</span>
                <span class="rounded-full border border-[#E5E5E5] bg-white px-4 py-2">{{ selectedWatch.stock }} In Stock</span>
                <span class="rounded-full border border-[#E5E5E5] bg-white px-4 py-2">{{ selectedWatch.category }}</span>
              </div>

              <p class="mt-8 font-price text-[2.6rem] leading-none tracking-[0.02em] text-[#0F3D2E]">₹{{ selectedWatch.price | number:'1.0-0' }}</p>

              <div class="mt-8 flex flex-wrap gap-4">
                <button type="button" (click)="cartService.addToCart(selectedWatch)" class="rounded-full bg-[#0F3D2E] px-7 py-4 text-sm font-semibold uppercase tracking-[0.3em] text-white hover:bg-[#1F7A63]">
                  Add to Cart
                </button>
                <button type="button" (click)="toggleWishlist(selectedWatch.id)" class="rounded-full border border-[#E5E5E5] bg-white px-7 py-4 text-sm uppercase tracking-[0.3em] text-[#111111] hover:border-[#0F3D2E] hover:text-[#0F3D2E]">
                  {{ isWishlisted(selectedWatch.id) ? 'Remove from Wishlist' : 'Save to Wishlist' }}
                </button>
              </div>

              <div class="mt-10 grid gap-4 sm:grid-cols-3">
                @for (spec of selectedWatch.specifications.slice(0, 3); track spec.label) {
                  <div class="rounded-[1.5rem] border border-[#E5E5E5] bg-white p-5">
                    <p class="text-[11px] uppercase tracking-[0.35em] text-[#1F7A63]">{{ spec.label }}</p>
                    <p class="mt-3 text-sm leading-6 text-[#111111]">{{ spec.value }}</p>
                  </div>
                }
              </div>
            </div>
          </div>

          <div class="mt-16 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div class="rounded-[2rem] border border-[#E5E5E5] bg-white p-8">
              <p class="text-sm uppercase tracking-[0.4em] text-[#1F7A63]">Specifications</p>
              <div class="mt-6 space-y-4">
                @for (spec of selectedWatch.specifications; track spec.label) {
                  <div class="flex items-center justify-between gap-4 border-b border-[#F1F1F1] pb-4 text-sm">
                    <span class="text-[#111111]/64">{{ spec.label }}</span>
                    <span class="text-right text-[#111111]">{{ spec.value }}</span>
                  </div>
                }
              </div>
            </div>
            <div class="rounded-[2rem] border border-[#E5E5E5] bg-white p-8">
              <p class="text-sm uppercase tracking-[0.4em] text-[#1F7A63]">Reviews</p>
              <div class="mt-6 space-y-6">
                @for (review of selectedWatch.reviews; track review.author) {
                  <div class="border-b border-[#F1F1F1] pb-6">
                    <p class="font-semibold text-[#111111]">{{ review.author }} <span class="ml-2 text-[#0F3D2E]">{{ review.rating }} ★</span></p>
                    <p class="mt-3 text-[#111111]/64">{{ review.comment }}</p>
                  </div>
                }
              </div>
            </div>
          </div>

          <div class="mt-16">
            <div class="flex items-end justify-between gap-6">
              <div>
                <p class="text-sm uppercase tracking-[0.4em] text-[#1F7A63]">Related Watches</p>
                <h2 class="mt-2 font-display text-4xl text-[#111111]">Recommended for your collection</h2>
              </div>
              <a routerLink="/catalog" class="text-sm uppercase tracking-[0.3em] text-[#111111]/56 hover:text-[#0F3D2E]">Browse more</a>
            </div>
            <div class="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              @for (item of recommendations(); track item.id) {
                <app-watch-card [watch]="item" (add)="cartService.addToCart($event)"></app-watch-card>
              }
            </div>
          </div>
        </div>
      </section>
    } @else {
      <section class="relative overflow-hidden px-6 py-24">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(15,61,46,0.08),transparent_24%),linear-gradient(180deg,#ffffff_0%,#fbfcfb_52%,#f4f8f6_100%)]"></div>
        <div class="relative mx-auto max-w-4xl">
          <div class="rounded-[2rem] border border-[#E5E5E5] bg-white p-10 text-center">
            <p class="text-sm uppercase tracking-[0.45em] text-[#1F7A63]">Watch Not Found</p>
            <h1 class="mt-4 font-display text-5xl text-[#111111]">This reference is unavailable</h1>
            <p class="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#111111]/64">
              The requested watch page could not be located. Browse the current collection to continue.
            </p>
            <a routerLink="/catalog" class="mt-8 inline-flex rounded-full bg-[#0F3D2E] px-7 py-4 text-sm font-semibold uppercase tracking-[0.3em] text-white hover:bg-[#1F7A63]">
              View Collection
            </a>
          </div>
        </div>
      </section>
    }
  `
})
export class ProductDetailsPageComponent {
  readonly cartService = inject(CartService);
  readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly watchService = inject(WatchService);
  private readonly recommendationService = inject(RecommendationService);
  private readonly watchId = signal(this.route.snapshot.paramMap.get('id'));

  readonly watch = computed(() => this.watchService.getById(this.watchId()));
  readonly recommendations = computed(() => this.recommendationService.getRecommendations(this.watchService.watches(), this.watch()));
  readonly selectedImage = signal('');

  constructor() {
    this.route.paramMap.subscribe((params) => {
      this.watchId.set(params.get('id'));
      window.scrollTo({ top: 0, behavior: 'auto' });
    });

    effect(() => {
      const currentWatch = this.watch();
      this.selectedImage.set(currentWatch?.images[0] ?? '');
    });
  }

  isWishlisted(watchId: string): boolean {
    return this.authService.getWishlist().includes(watchId);
  }

  toggleWishlist(watchId: string): void {
    if (!this.authService.isAuthenticated()) {
      return;
    }

    void this.authService.toggleWishlist(watchId);
  }
}
